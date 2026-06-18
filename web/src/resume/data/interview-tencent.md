# 腾讯总监面

---

## 一、当前 Agent 概念、优化点、技术前沿

Agent 不是"给 LLM 挂一堆 tool"，而是**让 AI 在受控编排下完成复杂多步任务**。我做的 Scout 就是一个生产排障 Agent：MCP 暴露领域工具，Persona 定义专家策略，Knowledge 层精确注入上下文。

### 优化点（实际遇到的）

- **上下文控制**：不能全量塞知识，要按场景动态召回（我用 resource 引用 + 自动加载）
- **编排而非自由调用**：纯 tool-calling 不稳定，需要 Orchestrator 做意图识别 + 步骤控制
- **可评估性**：输出不能只是自然语言，要有 evidence chain + confidence + 可验证结论

### 技术前沿

- **Multi-Agent 协作**：不同 persona 协同调查（如一个负责日志分析，一个负责资源检查）
- **Agentic RAG**：不是一次检索，而是 Agent 自己决定何时、查什么
- **Memory + 长期学习**：历史 case 积累后，排障准确率提升
- **Guardrails / Eval Loop**：部署前必须有评测闭环，不能只靠 vibe check

### 面试回答

> Agent 的核心不是 tool-calling，而是"受控编排 + 领域知识 + 可评估输出"。我做的 Scout 是一个生产排障 Agent，五层架构：接入层、MCP 服务层、Persona 编排层、Knowledge 层、数据执行层。实际落地中最大的优化点是上下文控制——不能把所有知识塞给模型，要按场景精确注入。如果今天重做，我会升级成编排驱动 + Agentic RAG + Evidence Chain 的架构，让 Agent 不只是"会调工具"，而是"能稳定完成复杂调查任务"。

---

## 二、AI 对半托管产品（PaaS: EMR）怎么赋能

半托管 PaaS 的痛点：用户要自己处理集群运维、作业调优、故障排查。AI 赋能方向是**把专家经验产品化，降低用户运维门槛**。

### 三层赋能

| 层次 | 能力 | 对应我做的事 |
|------|------|------------|
| **智能运维** | 故障自动诊断、根因定位 | Scout Agent：把 SRE 排障经验变成 Persona + Knowledge，自动调查 |
| **智能调优** | Spark 参数推荐、资源 right-sizing | 可结合历史作业 Telemetry 做推荐（我做了采集基建） |
| **智能交付** | 集群配置推荐、启动加速 | HDInsight 启动优化 + FCS Autoscale 降本 80% |

### 关键认知

AI 赋能不是在 PaaS 上加一个 Copilot 聊天框，而是要深入到**平台的控制回路**里——诊断结果能触发自动修复，调优建议能直接生效，不需要用户手动操作。

### 面试回答

> 我理解 AI 对 EMR 类产品的赋能分三层：智能运维（自动诊断根因）、智能调优（参数推荐和 right-sizing）、智能交付（配置推荐和启动加速）。我做的 Scout 就是智能运维层的落地——把资深 SRE 的排障经验拆成 Persona 和 Knowledge，让 Agent 自动完成调查。同时我在 FCS 做的 Telemetry 基建为调优提供了数据基础，Autoscale 优化降本 80% 是智能交付的一个实例。关键是 AI 要嵌入平台控制回路，不是一个独立的聊天窗口。

---

## 三、Fabric 底层为什么不直接对接 HDI

### 直接对接 HDI 的问题

| 问题 | 具体 |
|------|------|
| **启动太慢** | HDI 创建集群 15-20 分钟，Fabric Notebook 要求秒级~分钟级 |
| **资源模型不匹配** | HDI 是 dedicated cluster，Fabric 要 CU 池化 + 多租户共享 |
| **成本结构** | HDI 按 VM 计费，即使空闲也收费；Fabric 要按使用量（CU）计费 |
| **控制力不够** | HDI 是半托管，用户 SSH 进节点；Fabric 要全托管，用户只提交 Notebook |
| **多工作负载统一** | HDI 只管 Spark/Hadoop；Fabric 要统一 Spark + SQL + KQL + BI 底座 |

### 为什么重建

HDI 是 IaaS 思维的产物（给你一个集群你自己管），Fabric 需要 SaaS 思维（你提交代码我全包），底层基础设施的假设完全不同。所以微软选择在 ACI/AKS 上新建 FCS 这套容器管控层——**更轻、更快、全托管、CU 池化**。

### 面试回答

> HDI 是 VM 集群模式，每个用户一个长期运行的 Hadoop/Spark 集群，创建要 15-20 分钟，按 VM 计费。但 Fabric 要的是 Serverless 按需启停、秒级交付、CU 池化计费、全托管。这两套假设完全不兼容——资源模型、成本模型、控制模型都对不上。所以微软选择在 ACI/AKS 上重建一套容器管控层（FCS），我做的就是这套基础设施：把 Spark 工作负载容器化，支持快速启停、多租户隔离、统一编排。本质上是从 IaaS 思维转向 SaaS 思维。

---

## 四、做了 PaaS 后如何理解 IaaS 功能？PaaS 用到了什么网络功能？

### IaaS → PaaS 的网络能力映射

| IaaS 网络能力 | PaaS（FCS/Fabric）里怎么用 |
|--------------|--------------------------|
| VNet/Subnet 规划 | ACI Container Group 注入客户 VNet（VNet injection），数据不出客户网络 |
| NSG / 安全组 | 控制面 → 数据面的 Secure Tunnel，限制入站只走 443 |
| DNS 解析 | AKS 内 CoreDNS + 外部 Traffic Manager 做多 Region 路由 |
| 负载均衡 | AKS Ingress Controller + Azure Front Door |
| IP 管理 | ACI Subnet IP 预留和回收，避免 IP 泄漏影响客户 VNet 容量 |
| 跨 Region 互联 | Control Plane 跨 Region 部署，走 Azure Backbone 而非公网 |

### 关键认知

PaaS 不是不需要网络，而是把网络复杂度**从用户侧转移到了平台侧**。做平台的人必须比用户更懂网络，因为用户的网络安全和隔离是平台保证的。

### 面试回答

> 我在阿里做 ECS 时核心是 ENI 网络虚拟化——弹性网卡挂载、跨 AZ 热迁移时 IP 保持、VPC 路由下发。到 PaaS 层后，网络没有消失，而是被平台封装了。比如 FCS 里：ACI 要注入客户 VNet 保证数据不出客户网络（对应 VNet injection）；控制面到数据面走 Secure Tunnel 只开 443（对应 NSG）；ACI Subnet IP 预留和回收要平台来管（对应 IP 管理）；多 Region 部署走 Azure Backbone（对应跨域互联）。本质上 PaaS 是把网络复杂度从用户转移到了平台，做平台的人要比用户更懂网络。

---

## 五、HDI 难点 + 启动速度优化 + FCS 技术难点

### HDI 控制面难点

- **多 Region 一致性**：30+ Region 部署，每个 Region 独立 stamp，配置一致性治理难
- **长流程编排**：Cluster CRUD 是 DTFx 编排，任何中间步骤失败都要支持恢复和补偿
- **存储层边界**：多租户 Cosmos DB 分区设计——经历过 RU 扩容导致 physical partition 重分布的分页故障

### 启动速度优化

HDI 现状 15-20 分钟（VM 创建 + Hadoop 部署 + 配置收敛），FCS/Fabric 的优化方向：

| 手段 | 效果 |
|------|------|
| **预热池** | 提前创建好 ACI Container Group，请求来了直接分配 |
| **镜像优化** | 精简 Spark runtime 镜像层数和大小，减少 pull 时间 |
| **并行化** | 集群创建各步骤并行（网络 + 存储 + 计算同时准备） |
| **Warm start** | Session 复用，不需要每次都冷启 |

### FCS 技术难点（深讲案例）

**分页故障**：Cosmos DB RU 扩容后 physical partition 变化，暴露 cross-partition query 的 empty page 边界问题。

- **现象**：ListNodes 返回空 → TokenService 校验失败 → 全量 PYNB session 创建失败
- **根因**：把"当前页为空"误判为"查询结束"，没结合 continuation token
- **修复**：短期修正分页逻辑（只要 token 存在就继续翻页），长期改成 partition-scoped query
- **价值**：体现对分布式存储分区模型的理解，能从链路级故障一层层追到存储层根因

**ClusterHealth**：不能直接用 ACI readinessProbe，自建了分层健康模型。

- **原因**：平台要的是组合信号（进程 + HTTP + heartbeat + sidecar），不是单容器 probe
- **方案**：monitor container + heartbeat → Service Bus → Redis + DB → 编排层轮询 → exec fallback

### 面试回答

> HDI 控制面最难的是长流程编排的可靠性——30+ Region、DTFx 编排、任何步骤失败要能恢复。启动速度方面，HDI 15-20 分钟是 VM 模式的天花板，FCS 的思路是容器化 + 预热池 + 镜像优化 + 并行化，把冷启降到分钟级。技术难点我深讲一个：Cosmos DB RU 扩容后，底层 physical partition 重分布，暴露了 ListNodes 的 cross-partition 分页边界问题——当前页为空但 continuation token 非空，我们误判为查询结束，导致全量 session 创建失败。这个案例不是普通的分页 bug，而是容量扩展触发的分布式系统边界问题，需要从链路级现象一层层追到存储层根因。

---
