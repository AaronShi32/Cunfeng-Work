# 项目专题面试题

## Hilo：为什么选择轮询 CR status，而不是 Watch 或 operator 回调？

**题目背景：** 在 Hilo 里，控制面通过 K8s API 写入 Cluster CR，集群内 operator watch 这个 CR，再去创建真实的 Pod、Service 等资源。控制面需要判断这次 rollout 什么时候真正完成。

**核心回答：** 我会把“轮询 CR”看成一个**控制面等待数据面收敛**的问题，而不只是一个简单的状态查询实现。  
当前选择轮询 CR status，是因为它的模型简单、和 operator 解耦、失败语义清晰、恢复性好。控制面只依赖 Kubernetes 里的最终状态，不需要 operator 反向回调 Hilo，也不用额外维护一条回调链路。

### 我在设计上会重点关注四件事

1. **终态判断必须可靠**  
   不能只看 CR 存在，而要看 `observedGeneration`、`Ready` 条件、rollout finished，以及是否进入 terminal / critical 状态。

2. **超时和卡死检测要明确**  
   轮询不仅是“等 Ready”，还承担了 stuck rollout 检测和超时失败的职责。

3. **和编排模型匹配**  
   在 Hilo 当前的 DTFx Activity 模型下，轮询虽然笨一点，但语义稳定；如果改成 Watch，Activity 也还是会一直挂在那里等事件，不会天然变成“异步回调后继续”。

4. **优化可以做，但不要破坏可靠性**  
   如果要优化延迟和 API QPS，我会考虑 **Watch + fallback polling**，而不是纯 Watch，更不会让 operator 直接回调 RP，因为那会增加耦合和运维复杂度。

### 一句话总结

我选择轮询 CR，不是因为它最先进，而是因为在 Hilo 这种**控制面 / 数据面分离**、又需要**强恢复语义**的系统里，它是最稳、最清晰、最容易兜底的方案。

### 面试时可以这样展开

**1. 先定义问题本质**  
不要把它讲成“为什么不用更高级的 Watch”，而要先说明：这里本质上是控制面确认数据面是否已经完成收敛。

**2. 再讲为什么 polling 是当前阶段的合理工程选择**  
- 控制面只依赖 Kubernetes 最终状态，依赖边界更清晰。  
- operator 不需要额外对外回调，链路更短，故障面更小。  
- 控制面重启、Activity 重试后，可以继续从 CR status 恢复判断。  
- 超时、失败、卡住的语义容易统一收敛。

**3. 最后表达你不是保守，而是有演进思路**  
如果后面流量更大、对时延更敏感，我会优先做 Watch + fallback polling，在降低无效轮询的同时保留可靠兜底能力。

### 可追问问题

- 你会如何定义 rollout finished 的终态条件？
- 如果 `Ready=True` 但 `observedGeneration` 还没追上，应该怎么处理？
- stuck rollout 的检测信号会来自哪些字段或事件？
- DTFx Activity 场景下，Watch 和轮询在恢复语义上有什么本质差异？
- 如果未来要优化 API QPS，你会怎么设计 Watch + fallback polling？
