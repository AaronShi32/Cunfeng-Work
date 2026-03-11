# 模拟面试题

基于简历内容，模拟大厂技术面试官视角提出的问题。

---

## 一、简历项目深挖

### 1. 容器平台架构设计

你在 FCS 中基于 ACI 和 AKS 实现 Workload 生命周期管控，请详细描述控制面和数据面的架构分层，以及两者之间的通信机制是如何设计的？

### 2. 成本优化的量化分析

从 VM 切换到 Container 实现了 80% 成本降低，这个数据是如何度量的？除了计算资源本身，是否考虑了迁移成本、运维成本和性能损耗？

### 3. 事件驱动架构重构

你将网卡 API 的通信模型从主动轮询改为事件驱动，请描述具体的技术选型（消息队列/事件总线）、如何保证事件的可靠投递、以及如何处理事件乱序问题？

### 4. 接口幂等性设计

全面实现接口幂等是一个系统性工程，请举一个具体的 API 为例，说明你是如何设计幂等键、处理并发冲突、以及保证分布式环境下的幂等一致性的？

### 5. 深分页性能优化

百万级网卡查询从 300ms 优化到 3ms，请详细说明 NextToken 方案与传统 OFFSET 分页的区别，索引结构做了哪些调整，以及如何验证优化效果的？

### 6. 跨可用区迁移的私网 IP 保持

迁移后私网 IP 不变被称为业界难题，请解释为什么这在技术上是困难的（涉及 VPC 网段、子网划分等），以及你的方案是如何突破的？

### 7. Scout 智能诊断 Agent

你将 LLM 与日志检索引擎（MCP）集成，请描述 Agent 的工作流程：如何决定调用哪些工具、如何构造 Prompt、如何评估诊断结果的准确性？

### 8. 高可用与容错设计

FCS 服务可用性维持在 99% 以上，请描述你的自动化运维与告警系统的架构，智能诊断与自动修复具体涵盖哪些故障场景？

### 9. 60 万台实例跨网络迁移

保障 60 万台实例的平稳跨网络迁移，请描述迁移的灰度策略、回滚机制、以及如何在迁移过程中保证业务零中断？

### 10. 分布式全链路日志

你设计了 Telemetry 架构并实现分布式全链路日志，请说明 TraceID 的生成与透传机制、日志采集的性能开销控制、以及如何在海量日志中快速定位问题？

---

## 二、容器与 Kubernetes 高频题

### 11. 容器核心原理

Docker 容器的隔离机制底层依赖 Linux 的哪些技术？请分别说明 Namespace 和 Cgroups 各自解决什么问题，以及容器与虚拟机在隔离粒度上的本质区别。

<details>
<summary>参考答案</summary>

**Namespace** 提供资源隔离（6 种）：PID（进程）、NET（网络）、MNT（文件系统）、UTS（主机名）、IPC（进程间通信）、USER（用户）。每个容器看到独立的进程树、网络栈、文件系统。

**Cgroups** 提供资源限制：限制 CPU、内存、磁盘 I/O、网络带宽的使用量，防止单个容器耗尽宿主机资源。

**与虚拟机的本质区别**：VM 通过 Hypervisor 虚拟化硬件，每个 VM 有独立内核，隔离性强但开销大（GB 级）；容器共享宿主机内核，启动快（ms 级）、开销小（MB 级），但隔离性弱于 VM。

</details>

### 12. K8s 调度机制

Kubernetes 的 Scheduler 是如何为一个 Pod 选择合适 Node 的？请描述预选（Filtering）和优选（Scoring）两个阶段的核心逻辑。

<details>
<summary>参考答案</summary>

**预选（Filtering）**：排除不满足条件的节点。常见过滤器：PodFitsResources（资源充足）、NodeSelector/Affinity（节点亲和性）、Taints/Tolerations（污点容忍）。

**优选（Scoring）**：对通过预选的节点评分。策略：LeastRequestedPriority（资源最少优先）、BalancedResourceAllocation（CPU/内存均衡）、InterPodAffinity（Pod 亲和性）。

**扩展**：通过 Scheduling Framework Plugin 机制（Filter/Score/Reserve/Bind 扩展点）实现自定义调度。

</details>

### 13. Pod 生命周期与健康检查

请解释 livenessProbe、readinessProbe、startupProbe 三者的区别和使用场景。如果一个 Pod 频繁被 Kill 重启，你的排查思路是什么？

<details>
<summary>参考答案</summary>

- **livenessProbe**：检测容器是否存活，失败则 Kill 重启。用于死锁等无法自恢复的状态。
- **readinessProbe**：检测是否就绪接收流量，失败则从 Endpoints 摘除。用于启动预热场景。
- **startupProbe**：慢启动时替代 liveness，避免慢启动应用被误杀。

**频繁重启排查**：kubectl describe pod 看 Events/Last State -> 检查 liveness 配置 -> kubectl logs --previous -> 检查 limits 是否 OOM。

</details>

### 14. K8s 网络模型

Kubernetes 要求每个 Pod 有独立 IP 且 Pod 间可直接通信，请解释这个网络模型是如何实现的？CNI 插件的核心差异是什么？

<details>
<summary>参考答案</summary>

**三大要求**：Pod 间直接通信（无 NAT）、Node 与 Pod 直接通信、Pod 看到的 IP 与外部一致。

**CNI 插件**：
- **Flannel**：VXLAN Overlay，简单，不支持 NetworkPolicy。
- **Calico**：BGP 三层路由，支持 NetworkPolicy，适合大规模生产。
- **Cilium**：基于 eBPF 内核态处理，性能最优，支持 L7 策略，新一代主流。

</details>

### 15. Service 与 Ingress

请说明 ClusterIP、NodePort、LoadBalancer 三种 Service 类型的区别和适用场景。

<details>
<summary>参考答案</summary>

- **ClusterIP**（默认）：仅集群内访问，微服务间调用。
- **NodePort**：每个 Node 开放端口（30000-32767），适合测试。
- **LoadBalancer**：创建云厂商 LB，适合生产对外暴露。

**Ingress** 解决 L7 路由：多 Service 共享 LB，基于域名/路径分发，支持 TLS。

</details>

### 16. 容器存储

请解释 PV、PVC、StorageClass 之间的关系。有状态服务容器化的存储考量？

<details>
<summary>参考答案</summary>

- **PV**：集群级存储资源。**PVC**：用户存储申请，K8s 自动绑定 PV。**StorageClass**：动态供给策略，PVC 引用后自动创建 PV。

**关键因素**：数据持久性、访问模式（RWO/RWX）、性能（IOPS/SSD）、Snapshot 备份、跨 AZ 拓扑亲和。

</details>

### 17. 资源管理与弹性伸缩

K8s 中 requests 和 limits 的区别？QoS 等级如何影响驱逐优先级？

<details>
<summary>参考答案</summary>

- **requests**：调度依据 + 最低保证。**limits**：资源上限，CPU 超限被 Throttle，内存超限 OOM Kill。

**QoS**（驱逐优先级低→高）：Guaranteed（requests=limits）、Burstable、BestEffort（最先驱逐）。

**HPA** 水平扩缩副本数（无状态）；**VPA** 调整单 Pod 资源（有状态/波动大）。

</details>

### 18. ACI vs AKS 选型

什么场景选 ACI，什么场景选 AKS？冷启动、资源上限、网络集成的差异？

<details>
<summary>参考答案</summary>

**ACI**：短任务/突发流量/简单容器，秒级启动，按秒计费，单容器最大 4vCPU/16GB。

**AKS**：长期微服务/复杂编排/GPU 负载，完整 K8s 能力。

**差异**：冷启动 ACI 5-10s vs AKS 1-3s；ACI 不支持 Service Mesh，AKS 完整支持 CNI/Ingress/NetworkPolicy。

</details>

---

## 三、分布式系统高频题

### 19. CAP 与一致性

请解释 CAP 定理，并结合实际经验说明系统如何取舍？

<details>
<summary>参考答案</summary>

**CAP**：网络分区（P）时，一致性（C）和可用性（A）二选一。P 不可避免。

**实际取舍**：网卡绑定选 CP（分布式锁互斥，宁超时不允许不一致）；查询选 AP（允许短暂旧数据，最终一致）。

</details>

### 20. 分布式锁

高并发场景如何实现分布式锁？Redis/ZooKeeper/数据库各自优缺点？

<details>
<summary>参考答案</summary>

- **Redis**（SET NX EX）：性能最高，可能主从切换丢锁。
- **ZooKeeper**（临时有序节点）：强一致，性能较低。
- **数据库**（SELECT FOR UPDATE）：无额外依赖，性能最低。

**实践**：Redis 锁 + 数据库乐观锁（版本号）双重保障。

</details>

### 21. 异步转同步

网卡 API 异步转同步的实现方案？如何处理超时和回调丢失？

<details>
<summary>参考答案</summary>

RequestID 关联 CompletableFuture，后端回调写入结果，前端阻塞等待。超时返回异常，后台继续执行，客户端可再查询。定时补偿任务扫描未完成请求。重试依赖接口幂等 + 指数退避。

</details>

### 22. 限流与熔断

令牌桶和漏桶的区别？熔断器状态机如何工作？

<details>
<summary>参考答案</summary>

**漏桶**固定速率处理，平滑但不应对突发；**令牌桶**允许积攒应对突发，更灵活。

**熔断状态机**：Closed（正常）-> 错误率超阈值 -> Open（快速失败）-> 超时 -> Half-Open（试探）-> 成功回 Closed / 失败回 Open。

</details>

### 23. 消息队列可靠性

如何保证消息不丢失、不重复消费？

<details>
<summary>参考答案</summary>

**防丢失**：生产端 ACK、Broker 持久化+副本（ISR）、消费端手动提交 Offset。

**At-Least-Once** + 业务幂等（去重表）是最佳实践。**Exactly-Once** 需 Kafka 事务或本地事务，代价是性能和复杂度。

</details>

---

## 四、数据库与性能优化

### 24. MySQL 索引原理

B+ 树结构、覆盖索引、最左前缀匹配规则？

<details>
<summary>参考答案</summary>

**B+ 树**：非叶子存键值，叶子存数据+链表连接，树高 3-4 层覆盖千万级数据。

**覆盖索引**：查询字段全在索引中，无需回表（Using index）。

**最左前缀**：联合索引 (a,b,c) 必须从左连续使用。WHERE a=1 AND c=3 只用到 a。ORDER BY 与索引顺序一致可避免 Filesort。

</details>

### 25. 慢 SQL 排查方法论

线上慢 SQL 排查流程？EXPLAIN 关注哪些字段？

<details>
<summary>参考答案</summary>

**流程**：慢查询日志 -> EXPLAIN -> 检查索引 -> 检查数据量 -> 优化验证。

**关键字段**：type（ALL 最差/const 最优）、key（NULL=未走索引）、rows（扫描行数）、Extra（filesort/temporary 差，Using index 好）。

</details>

### 26. 分库分表

分库分表策略？ShardKey 选择？跨分片查询？

<details>
<summary>参考答案</summary>

优先读写分离 -> 分区表 -> 分库分表。ShardKey 要高离散度、查询高频、业务相关。跨分片：冗余全局表、中间件聚合、异构索引（ES），尽量避免跨分片 JOIN。

</details>

---

## 五、AI Agent 与 LLM 应用

### 27. RAG 架构

文档切片、向量化、检索、生成的流程？如何评估？

<details>
<summary>参考答案</summary>

文档按语义分块（512-1024 tokens，10-20% overlap）-> Embedding 向量化存入向量库 -> 查询向量化后 Top-K 检索 -> chunk 拼入 Prompt 生成答案。

评估：Recall@K、MRR、Faithfulness（无幻觉）、Answer Relevancy。

</details>

### 28. MCP 协议

MCP 解决什么问题？与 Function Calling 的区别？

<details>
<summary>参考答案</summary>

MCP 为 LLM 与工具提供标准协议（类似 USB-C）。工具以独立 Server 运行，JSON-RPC 通信。

vs FC：FC 工具耦合在 Prompt、平台相关；MCP 工具可复用、动态发现、跨平台、安全隔离。

</details>

### 29. Agent 可靠性

如何保证 LLM Agent 输出的可靠性和可解释性？

<details>
<summary>参考答案</summary>

**可靠性**：约束输出格式（JSON Schema）、结论引用具体日志/指标、关键操作人工确认、低置信度升级人工。

**可解释性**：记录思维链和工具调用链路，诊断报告展示证据链（告警->日志->根因->建议），每步可追溯。

</details>

---

## 六、开放性问题

### 30. 职业规划

你在阿里云和微软都有深度的云计算经验，未来 3-5 年你的职业发展方向是什么？是偏向技术深度（如架构师）还是技术管理？

### 31. 技术判断力

从你的经历看，你经历了 VM -> Container -> Serverless 的演进，你认为云计算基础设施的下一个重大技术变革是什么？为什么？

### 32. 跨文化协作

从阿里云到微软，两家公司的工程文化和研发流程有哪些显著差异？你是如何适应这种转变的？

### 33. 复杂项目决策

在跨可用区迁移项目中，如果迁移方案与产品经理的上线时间表产生冲突，你会如何权衡技术完整性和业务交付压力？

### 34. AI 与传统工程的融合

你参与了 Scout 智能诊断 Agent 的开发，你认为 AI Agent 会在多大程度上改变传统的运维和 SRE 工作模式？

### 35. 系统设计思维

如果让你从零设计一个支持百万级实例的弹性网卡管理系统，你会如何设计整体架构？请从存储、缓存、API 网关、异步处理等维度展开。
