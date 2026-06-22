# 项目专题面试题

> 结合 Microsoft FCS / Scout / Hilo 项目经验的实战问答，含架构设计、技术选型与难点拆解。

---

## Hilo

### 为什么选择轮询 CR status，而不是 Watch 或 operator 回调？

**题目背景：** 在 Hilo 里，控制面通过 K8s API 写入 Cluster CR，集群内 operator watch 这个 CR，再去创建真实的 Pod、Service 等资源。控制面需要判断这次 rollout 什么时候真正完成。

**核心回答：** 我会把“轮询 CR”看成一个**控制面等待数据面收敛**的问题，而不只是一个简单的状态查询实现。  
当前选择轮询 CR status，是因为它的模型简单、和 operator 解耦、失败语义清晰、恢复性好。控制面只依赖 Kubernetes 里的最终状态，不需要 operator 反向回调 Hilo，也不用额外维护一条回调链路。

#### 我在设计上会重点关注四件事

1. **终态判断必须可靠**  
   不能只看 CR 存在，而要看 `observedGeneration`、`Ready` 条件、rollout finished，以及是否进入 terminal / critical 状态。

2. **超时和卡死检测要明确**  
   轮询不仅是“等 Ready”，还承担了 stuck rollout 检测和超时失败的职责。

3. **和编排模型匹配**  
   在 Hilo 当前的 DTFx Activity 模型下，轮询虽然笨一点，但语义稳定；如果改成 Watch，Activity 也还是会一直挂在那里等事件，不会天然变成“异步回调后继续”。

4. **优化可以做，但不要破坏可靠性**  
   如果要优化延迟和 API QPS，我会考虑 **Watch + fallback polling**，而不是纯 Watch，更不会让 operator 直接回调 RP，因为那会增加耦合和运维复杂度。

#### 一句话总结

我选择轮询 CR，不是因为它最先进，而是因为在 Hilo 这种**控制面 / 数据面分离**、又需要**强恢复语义**的系统里，它是最稳、最清晰、最容易兜底的方案。

#### 面试时可以这样展开

**1. 先定义问题本质**  
不要把它讲成“为什么不用更高级的 Watch”，而要先说明：这里本质上是控制面确认数据面是否已经完成收敛。

**2. 再讲为什么 polling 是当前阶段的合理工程选择**  
- 控制面只依赖 Kubernetes 最终状态，依赖边界更清晰。  
- operator 不需要额外对外回调，链路更短，故障面更小。  
- 控制面重启、Activity 重试后，可以继续从 CR status 恢复判断。  
- 超时、失败、卡住的语义容易统一收敛。

**3. 最后表达你不是保守，而是有演进思路**  
如果后面流量更大、对时延更敏感，我会优先做 Watch + fallback polling，在降低无效轮询的同时保留可靠兜底能力。

#### 可追问问题

- 你会如何定义 rollout finished 的终态条件？
- 如果 `Ready=True` 但 `observedGeneration` 还没追上，应该怎么处理？
- stuck rollout 的检测信号会来自哪些字段或事件？
- DTFx Activity 场景下，Watch 和轮询在恢复语义上有什么本质差异？
- 如果未来要优化 API QPS，你会怎么设计 Watch + fallback polling？

---

## Scout

### 这个项目一句话怎么介绍？

**答：** Scout 是一个面向 Azure Data / Spark 生产问题排障的智能体平台。  
它的核心不是通用问答，而是把专家排障方法论、领域知识和 Kusto 调查流程沉淀成可复用的智能体能力，帮助工程师更快定位根因。

### persona 可以怎么理解？

**答：** 在 Scout 里，persona 更适合翻译成 **专家角色**。  
它不是单纯的 skill，而是定义了智能体以什么身份、什么方法论去分析问题；skill 更偏单点能力，persona 更偏专家视角和调查策略。

### 整体架构怎么讲？

**答：** 我会概括成五层：**接入层、MCP 服务层、Persona 编排层、Knowledge 层、数据执行层**。

1. **接入层**：VS Code Agent / 本地扩展作为入口。  
2. **MCP 服务层**：`main.py` 启动 Python MCP Server，对外暴露 tools、resources、resource templates。  
3. **Persona 编排层**：`Personas/*.md` 定义不同排障专家角色，比如 JobService、Reliability。  
4. **Knowledge 层**：`Resources/` 和 `Analyzers/` 存放 schema、TSG、调查模式。  
5. **数据执行层**：外部 Kusto MCP / Fabric RTI MCP 负责真实查询，Scout 负责“怎么查”和“怎么分析”。

### `main.py` 主要做了什么？

**答：** `main.py` 本质上是 Scout 的 MCP 服务入口，主要做六件事：

1. **启动 MCP Server**：通过 `stdio_server()` 等待宿主连接。  
2. **加载配置**：读取 server 名称、personas 目录、Kusto 配置、日志级别等。  
3. **动态加载 persona**：扫描 `Personas/*.md`，提取 name、description、parameters、instructions。  
4. **动态加载资源**：扫描 `Resources/` 和 `Analyzers/`，注册成可读资源。  
5. **暴露 MCP 能力**：实现 `list_tools`、`list_resources`、`read_resource`、`call_tool`。  
6. **处理 persona 调用**：校验参数、识别 persona 中引用的 `scout://resources/...`，自动加载知识并返回完整上下文。

### LLM 什么时候知道该调用哪个 MCP？

**答：** 不是 Scout 内部硬编码决定的，而是 **MCP host 初始化时做能力发现**。

- 宿主先连接各个 MCP server  
- 调用每个 server 的 `list_tools()` / `list_resources()`  
- 把这些 tool 描述统一提供给当前 LLM  
- LLM 再根据用户问题语义决定先调 Scout，还是直接调 Kusto MCP

所以可以理解成：

- **Scout**：提供专家调查方法和知识增强  
- **Kusto MCP**：提供真实数据查询能力  
- **LLM + Host**：负责工具选择和调用路由

### 这个项目的亮点是什么？

**答：** 我会强调四点：

1. **不是通用聊天，而是生产排障智能体**。  
2. **Persona 数据驱动**，新增专家角色主要靠加 markdown，不用频繁改主逻辑。  
3. **知识自动注入**，persona 引用 resource 后会自动加载 schema / analyzer / TSG。  
4. **工程化完整**，包含参数校验、路径安全、缓存、线程安全、日志和测试。

### 难点在哪里？

**答：**

1. **把隐性专家经验产品化**：把资深同学脑中的排障经验拆成 persona、resource、analyzer。  
2. **控制上下文和准确性**：知识不能一股脑全塞给模型，需要按场景精确注入。  
3. **兼顾灵活性和稳定性**：既要让 Agent 会调查，又要保证参数安全、资源安全和可恢复性。  
4. **多集群、多数据源一致性**：要让不同环境下的调查流程和口径保持一致。

### 如果今天重做，你会怎么设计？

**答：** 我会保留“专家角色 + 领域知识 + 调查流程”这三个核心思想，但不会再以 MCP 作为架构中心，而是升级成一个 **生产排障 Agent 平台**。

核心改动有三点：

1. **从协议驱动改成编排驱动**：引入 Orchestrator，负责意图识别、流程编排、证据汇总。  
2. **从 markdown persona 改成可执行策略**：把 persona 升级成带触发条件、调查 DAG、停止条件的策略。  
3. **从资源拼接改成知识检索和证据链**：把 TSG、schema、Analyzer 做成结构化知识层，按需召回，并输出可验证的 evidence chain。

一句话总结：

> 老的 Scout 更像“把 persona 暴露成 MCP tool”；新的 Scout 应该是“把排障流程做成可观测、可评估、可编排的智能调查系统”。

### 结合当前 AI 技术趋势，这个工具今天会怎么设计？

**答：** 如果按现在的技术趋势重做，Scout 不应该只停留在 **LLM + MCP**，而应该升级成一个 **生产排障 Agent 平台**：  
**`LLM + Orchestrator + Domain Tools + Retrieval/Memory + Eval/Observability + Guardrails`**。  
MCP 仍然可以保留，但更适合作为工具接入协议，而不是架构核心。

#### 我会强调三点升级

1. **从自由 tool-calling 升级成编排驱动**  
   增加 Orchestrator，负责问题分类、调查策略选择、步骤控制、证据汇总，而不是让 LLM 自己随意调工具。

2. **从 prompt persona 升级成可执行策略**  
   persona 不再只是专家说明书，而是带触发条件、调查 DAG、停止条件、人工升级条件的 Investigation Policy。

3. **从资源拼接升级成 agentic retrieval + memory**  
   不再把 schema / TSG / analyzer 全量拼进上下文，而是建立 Knowledge Service，按步骤动态检索，并结合历史 case 做长期记忆。

#### 工具层也要升级

我会尽量让模型调用 **领域 API**，而不是直接写底层 KQL，比如：

- `get_job_lifecycle(...)`
- `find_scheduler_blockers(...)`
- `get_cluster_health(...)`

这样比直接暴露原始查询工具更稳定、更安全，也更方便做权限控制、审计和评测。

#### 输出方式也要变

新版 Scout 不应该只输出自然语言结论，而应该输出：

- **root cause**
- **confidence**
- **evidence chain**
- **recommended actions**
- **是否需要人工升级**

这样它才是一个真正可落地的生产排障系统，而不是“会回答问题的聊天助手”。

#### 一句话总结

> 现在的趋势不是“让模型会调更多工具”，而是“让 Agent 在受控编排、知识检索、证据链和评测体系下稳定地完成复杂任务”。Scout 如果今天重做，核心会从 MCP tool 暴露，升级成可编排、可观测、可评估的智能排障平台。

---

## FCS / Telemetry

### CP + ACI Telemetry 架构怎么讲

**简历映射：** 对应“设计 Telemetry 架构，落地日志、指标、链路、发布治理一体化能力”。

**一段话版本：**  
我在 FCS 里做的 Telemetry，不是简单给服务“打日志”，而是把 **控制面 CP** 和 **集群侧 ACI** 做成分层采集架构：CP 负责服务自身日志、指标和相关性上下文，ACI 负责 workload 运行时日志和节点侧指标。两边统一接入 Geneva 体系，日志进入 Kusto，指标进入 MDM，最终支撑故障定位、发布观测和稳定性治理闭环。

#### 先把架构分成两层讲

#### 1. CP（Control Plane）Telemetry

- **日志链路**：业务代码写 NLog / Event，经过 `EventSourceTarget` 写入 `FcsEventSource` / `FcsMdsEventSource`，再进入 Geneva / MDS，最终供 Kusto 检索分析。  
- **指标链路**：服务内指标通过 `GenevaMetricLogger` 上报到 Geneva MDM，环境配置里会带 `RpGenevaMdmAccountName`、`RpGenevaMdmNamespace`。  
- **链路上下文**：不是标准 OTel，而是通过 `CorrelationId`、`ClientRequestId`、`ResourceId`、`DeploymentId`、`OrchestrationInstanceId` 做相关性串联。  
- **核心价值**：回答“控制面自己发生了什么”，比如 API 请求、编排活动、失败原因、版本变更影响面。

#### 2. ACI（Cluster / Data Plane）Telemetry

- **采集组件**：ACI 模板里统一下发 `collectd`、`fluent-bit`、`mdsd`。  
- **日志链路**：业务容器日志、系统日志先落本地卷，再由 `fluent-bit` tail，补充 Cluster / Region / DeploymentId 等维度后转发给本地 `mdsd`。  
- **指标链路**：`collectd` 采集进程、网络、探活等指标，输出到日志文件后再由 `fluent-bit` 接走，统一进入 `mdsd` / Geneva。  
- **配置下发**：FCS 控制面在创建 ACI 集群时，把 `GCS environment/account/namespace/config version` 以及证书从环境配置和 Key Vault 注入模板。  
- **核心价值**：回答“集群里 workload 实际跑得怎么样，发布后行为是否异常，客户负载侧到底发生了什么”。

#### 我会怎么把它讲成“架构设计”

#### 1. 分层清晰

我不是把所有日志都堆进一个系统，而是明确区分：

- **CP 看控制面行为**
- **ACI 看运行时行为**
- **日志、指标、链路上下文分别治理**

这样故障发生时，能快速判断是控制面编排问题，还是 workload / runtime 问题。

#### 2. 统一维度，而不只是统一工具

我重点做的是统一观测维度：

- `CorrelationId`
- `DeploymentId`
- Cluster / Region / ClusterType
- 统一 Geneva 接入方式

这样日志才能和发布、环境、故障真正关联起来。

#### 3. 平台化下发，而不是人工接线

ACI 侧采集能力不是业务自己装 agent，而是由平台统一注入：

- agent 镜像版本
- fluent-bit / collectd 配置
- Geneva 账号与 namespace
- 证书和密钥

这体现的是**平台能力沉淀**，不是一次性项目开发。

#### 4. 最终服务于发布治理

Telemetry 的目标不是“有 dashboard”，而是支撑：

- 新版本发布后的异常观测
- 按 deployment / region / cluster type 快速收敛影响面
- 回滚和止血时的快速判断
- 复盘时还原控制面和 workload 面的完整证据链

#### 面试时推荐回答

**提问：** 你简历里写“设计 Telemetry 架构”，具体做了什么？

**回答：**  
我在 FCS 里做的是一个分层 Telemetry 架构。控制面 CP 采集服务自身日志、指标和相关性上下文，主要支撑 API、编排、发布和稳定性治理；集群侧 ACI 则在模板里统一下发 collectd、fluent-bit、mdsd，采集 workload 日志和节点运行指标。  
两边都接到 Geneva 体系，日志进入 Kusto，指标进入 MDM。这样我就能把“请求进来了什么、编排做了什么、集群里实际发生了什么、发布后哪个 deployment 出问题了”串成一条完整链路。  
所以这件事的价值不只是可观测性，而是把故障定位、发布观测和平台治理打通。

#### 面试亮点要强调的 5 点

1. **我做的是平台级 Telemetry，而不是给单个服务加日志。**
2. **我把控制面和集群侧拆开治理，边界清晰。**
3. **我关心日志、指标、链路上下文怎么统一，而不只是采集工具本身。**
4. **我把采集能力做成模板和平台默认能力，降低 workload 接入成本。**
5. **我让 Telemetry 真正服务于发布治理和故障闭环，而不是停留在观测层。**

#### 可追问问题

- 为什么 CP 指标进 MDM，而日志进 Kusto？
- ACI 为什么用 `collectd + fluent-bit + mdsd` 这种分层方式？
- 如果没有标准 trace，你怎么做链路关联？
- 你如何把发布信息和 Telemetry 关联起来？
- 如果今天重做这套架构，你会不会引入 OpenTelemetry？

#### 如果被追问“你的设计难点是什么”

**答：** 我觉得难点不是把 agent 装上，而是三件事：

1. **控制面和 workload 面口径统一**，不然故障定位会断层。  
2. **配置和证书平台化下发**，不然每个 workload 都会重复造轮子。  
3. **让 Telemetry 服务于发布治理**，而不只是做一个“有很多日志”的系统。  

#### 一句话收尾

> 我做的不是单点日志接入，而是把 CP 和 ACI 两层观测能力统一到 Geneva / Kusto / MDM 体系里，让 Telemetry 真正成为稳定性治理和发布治理的基础设施。

### AKS 和 ACI 技术选型特点

#### 选型对比表

| 维度 | AKS | ACI |
| --- | --- | --- |
| **定位** | 面向长期运行、平台化、复杂编排的 workload | 面向轻量、快速拉起、平台托管更多的 workload |
| **底层模型** | 完整 Kubernetes 集群，支持 Helm、CRD、Operator、Node Pool | Container Group 模型，更接近“直接起容器实例” |
| **控制力** | 控制面可深度管理 HelmRelease、K8s 资源、节点池、发布流程 | 控制面主要管理模板和容器组，控制粒度更粗 |
| **扩展性** | 强，适合多组件协同、持续演进和复杂治理 | 中等，适合结构相对简单、生命周期更直接的场景 |
| **交付效率** | 创建链路更长，部署收敛更复杂 | 创建路径更短，交付更轻、更快 |
| **运维复杂度** | 高，需要处理集群、节点、Helm、运行时依赖等问题 | 低，不需要承接完整 K8s 控制面运维成本 |
| **生态能力** | 强，天然适合接入 Kubernetes 生态工具链 | 弱于 AKS，不适合重度依赖 K8s 生态的 workload |
| **适合的 Telemetry 形态** | 更适合平台级治理，结合 Helm / Agent / K8s 资源做统一观测 | 更适合 sidecar / agent 直插式采集，如 `collectd + fluent-bit + mdsd` |
| **典型优势** | 能力完整、控制力强、适合复杂系统长期运营 | 启动快、模型轻、平台托管更多、交付成本低 |
| **典型代价** | 学习和运维成本更高，创建和收敛链路更长 | 灵活性和生态能力不如 AKS，上限较低 |

#### 我在面试里会怎么总结

| 问题 | 推荐回答 |
| --- | --- |
| **为什么 FCS 同时用了 AKS 和 ACI？** | 因为这不是二选一，而是按 workload 形态分层承载。AKS 提供能力上限和平台控制力，ACI 提供轻量交付和更低运维成本。 |
| **AKS 的技术选型特点是什么？** | AKS 更像平台型底座，适合长期运行、复杂编排、依赖 Kubernetes 生态、后续持续演进的 workload。 |
| **ACI 的技术选型特点是什么？** | ACI 更像轻量运行底座，适合快速起实例、少运维、结构相对简单的 workload。 |
| **这背后的架构思路是什么？** | 不是追求统一底座，而是根据 workload 对控制力、扩展性、交付速度、运维复杂度的不同诉求做分层选型。 |

#### 一句话总结

> AKS 赢在能力和控制力，ACI 赢在轻量和交付效率；FCS 的选型特点不是强行统一基础设施，而是按 workload 特征选择最合适的承载底座。

### ClusterHealth 为什么不用 ACI readiness，而是自己实现

#### 核心结论

**答：** 因为 FCS 要判断的不是“某个容器 probe 是否通过”，而是 **整个 container group / node 能不能被平台视为 Ready**。  
ACI 的 `readinessProbe` 解决的是 workload 局部健康问题；FCS 的 ClusterHealth 解决的是平台级 readiness gate，需要统一收敛成自己的 `NodeHealthState`，并支撑编排、扩缩容、发布治理和故障恢复。

#### 为什么不直接用 ACI readinessProbe

| 原因 | 解释 |
| --- | --- |
| **判定对象不同** | ACI readiness 更偏单容器是否可接流量；FCS 要的是整个 container group / node 是否 ready。 |
| **需要统一平台状态** | FCS 后续流程依赖 DB 里的 `Node.Health`，所以必须统一映射成 `Ready / Failed / Unknown`。 |
| **需要组合判断** | 除了应用 HTTP probe，还要看 sidecar、collectd、fluent-bit、heartbeat、服务状态等多种信号。 |
| **要和编排闭环打通** | readiness 结果要参与 cluster 创建完成判定、超时失败、后续排障和 auto healing。 |

#### 实现通路怎么讲

| 阶段 | 通路 | 作用 |
| --- | --- | --- |
| **1** | workload / sidecar 自检 | Manifest 里可以有 `readinessProbe` / `livenessProbe`，这是局部健康信号。 |
| **2** | `bundle-collectd-healthcheck` monitor container | 汇总进程检查、HTTP 检查、服务检查，生成统一健康结果。 |
| **3** | monitor 主动发 heartbeat 到 RP | 通过 `FCS_ENDPOINT`、`FCS_HEART_BEAT_API_PORT`、token 调 FCS heartbeat API。 |
| **4** | RP 收到 heartbeat 后发 Service Bus | 让 heartbeat API 保持轻量，后续异步处理。 |
| **5** | HeartbeatProcessor 写 Redis 历史并更新 DB | Redis 存 heartbeat history，DB 更新 `Node.Health`。 |
| **6** | Cluster create/update 轮询 DB | `WaitForContainerGroupsToBeHealthyActivity` 先查 DB，作为第一 readiness 来源。 |
| **7** | DB 超时后 fallback 到 ACI exec | 在 monitor container 里执行 `cat fcs-healthcheck`，直接读健康结果并回写 DB。 |
| **8** | 仍失败则拉 ARM instanceView 和 logs | 用于排障，不是主 readiness gate。 |

#### monitor container 做了什么

**答：** 它不是单纯的 sidecar，而是 FCS 自己的健康汇总器。  
典型配置里会定义：

- `health_monitor_container_name = bundle-collectd-healthcheck`
- `health_monitor_container_exec_command = cat fcs-healthcheck`
- `response_key = status`
- `Healthy -> Ready`
- `Unhealthy -> Failed`

它内部会做三类检查：

1. **进程检查**：比如 `fcs-healthcheck-monitor`、`collectd`、`fluent-bit` 等  
2. **HTTP 检查**：比如业务容器 `/health`  
3. **服务状态落盘 + heartbeat 上报**：把结果写到 `fcs-healthcheck`，并主动发 heartbeat 给 RP

#### 面试时推荐回答

**提问：** 为什么 FCS 不直接依赖 ACI 的 readinessProbe？

**回答：**  
因为 ACI readinessProbe 只能说明单个容器局部是否 ready，但 FCS 需要的是平台级的 cluster/node readiness。  
所以我们没有直接拿 ACI probe 做最终判定，而是自己做了一层 ClusterHealth：在集群里放一个 monitor container，汇总应用探针、进程和 sidecar 状态，再主动上报 heartbeat 到 RP。RP 侧把 heartbeat 经过 Service Bus、Redis、DB 收敛成 `Node.Health`，编排层再以 DB 为第一信号源判断 cluster 是否 ready。  
如果 DB 没及时收敛，再 fallback 到 ACI 里 exec health monitor command 直接查健康文件。这样既保留了 workload 自检能力，又让平台有统一的 readiness 语义和恢复能力。

#### 一句话总结

> FCS 不是不用 readiness，而是**没有把 ACI 原生 readinessProbe 当成最终真相**；它在上层又做了一套 **monitor + heartbeat + DB NodeHealth + exec fallback** 的平台级 ClusterHealth 模型。

### Helm 部署链路怎么讲

#### 核心结论

**答：** FCS 不是在 RP 里直接执行 `helm install`，而是走 **Flux `HelmRelease`** 模型：  
FCS 先渲染 manifest 里的 `HelmRelease` 模板，再把它作为 K8s CR 写进 AKS，后续由集群里的 **flux `helm-controller`** 真正去拉 chart 并安装。FCS 自己负责的是 **模板生成、资源下发、状态轮询和失败收敛**。

#### 整体流程

| 阶段 | 动作 | 作用 |
| --- | --- | --- |
| **1** | 创建 AKS / node pool，准备 kubeconfig、image pull secret、证书等运行时参数 | 为 Helm 部署准备上下文 |
| **2** | 先部署 `k8sResources` | 先把 namespace、secret、CRD、`HelmRepository`、`helm-controller` / `source-controller` 等前置资源装好 |
| **3** | 渲染 `HelmRelease` | 用 manifest + `TemplatePropertyBundle` + request overrides 生成最终 HelmRelease |
| **4** | 把 `HelmRelease` upsert 到 AKS | FCS 写的是 K8s CR，不是直接跑 helm CLI |
| **5** | Flux `helm-controller` reconcile | 由集群内 controller 去 ACR OCI repo 拉 chart 并安装 |
| **6** | FCS 轮询 `HelmRelease.status` | 判断 `IsStatusUpToDate()` 和 `IsReady()`，作为部署完成条件 |
| **7** | 失败时抓 K8s events | 提取 unready services，统一作为异常上抛 |

#### Helm Chart 和 HelmRelease 在哪里

| 对象 | 在哪里 | 说明 |
| --- | --- | --- |
| **HelmRelease 模板** | Manifest repo：`manifests/*/resources/helm/HelmRelease/*.tpl` | 定义 chart 名、version、values、sourceRef |
| **HelmRepository 模板** | Manifest repo：`DefaultService/FcsPlatform/resources/k8s/HelmRepository/0_0_1.tpl` | 指向 `oci://<imageRegistry>/helm` |
| **真正的 Helm Chart** | ACR OCI registry | 不在 FCS repo / manifest repo 里，实际由 Flux 从 ACR 拉取 |

典型例子：

- 平台级 release：`FcsPlatform/resources/helm/HelmRelease/fcsplatform_0_0_1.tpl`
- Geneva release：`FcsPlatform/resources/helm/HelmRelease/geneva_0_0_12.tpl`
- workload release：`ContainerService/Sample/resources/helm/HelmRelease/sample_0_0_1.tpl`

#### flux `helm-controller` 在哪里

**答：** 它也是 FCS 平台资源的一部分，不是 workload chart 自带的。  
定义在 Manifest repo：

- `DefaultService/FcsPlatform/resources/k8s/Deployment/helm-controller/0_0_1.tpl`
- `DefaultService/FcsPlatform/resources/k8s/ServiceAccount/helm-controller/0_0_1.tpl`

它会在 **cluster pool 创建阶段**，作为 `FcsPlatform` 的 `k8sResources` 被 FCS 先部署进 AKS。  
所以后续所有 workload 的 `HelmRelease`，本质上都是交给这套预先装好的 Flux controller 去 reconcile。

#### 为什么要这么设计

| 设计点 | 原因 |
| --- | --- |
| **不用 helm CLI，改用 HelmRelease** | 更符合控制面 / 数据面分离，部署状态可落到 K8s CR，恢复性更好 |
| **Chart 不放在 repo，放 ACR OCI** | 方便版本化、发版和多环境复用 |
| **FCS 只写 CR，不直接管 Pod** | 降低控制面复杂度，把实际安装职责交给集群内 controller |
| **FCS 自己轮询 HelmRelease** | 统一把部署完成、失败、超时语义收敛到编排层 |

#### 面试时推荐回答

**提问：** FCS 这里 Helm 是怎么部署的？

**回答：**  
FCS 这里不是控制面直接执行 `helm install`，而是采用 Flux 的 `HelmRelease` 模型。  
在 cluster pool 创建阶段，FCS 先把 `helm-controller`、`source-controller`、`HelmRepository` 这些前置平台资源装进 AKS；等 cluster 创建时，再根据 manifest 渲染 workload 对应的 `HelmRelease`，把它写进集群。  
之后由集群内的 flux `helm-controller` 去 ACR OCI registry 拉真正的 chart 并安装，而 FCS 自己只轮询 `HelmRelease.status`，看它是不是 up-to-date 且 ready。  
这样部署链路更符合控制面 / 数据面分层，也更容易做失败恢复和状态收敛。

#### 一句话总结

> FCS 的 Helm 部署本质上是 **”FCS 渲染并下发 HelmRelease，Flux controller 在集群内拉 chart 并安装，FCS 再轮询 HelmRelease 状态做收敛”**；`HelmRelease` 在 Manifest repo，真正的 chart 在 ACR OCI。

### 技术难点 - 记一次分页故障

#### 背景

这是一次很典型的 **基础设施变更触发应用链路故障**。  
当时我们把 Cosmos DB 里几个高流量容器（`Nodes` / `Clusters` / `ClusterPools`）的 RU 上限从 **10k 提到 15k**。扩容后，Cosmos DB 在底层新增了 **physical partition**，数据发生了重新分布。

这个变化把一个原本被掩盖的问题暴露出来：`ListNodes` 按设计本来应该是 **single-partition query**，但实现上实际上还是 **cross-partition query**。

#### 故障现象

扩容后，`ListNodes` 出现了一个很隐蔽的分页边界情况：

- **当前页为空**
- **但 continuation token 非空**

我们的查询逻辑看到这一页没数据，就直接返回给上游，没有继续消费 continuation token。  
于是上游把这个结果误判成“**没有节点**”。

这个错误结果继续往上游传导：

1. `ListNodes` 错误返回空结果  
2. `TokenService` 误判 FCS Cluster Node IP 校验失败  
3. `Pubsub agent -> Pubsub service` 调用全部失败  
4. 最终影响 **所有 PYNB session startup**

#### 技术难点

真正难的地方不是接口报错，而是它表面上 **返回成功**，只是**语义错了**。  
从现象上看，问题暴露在 session startup failure；但真正根因需要一层层往下追：

- 从上游 session 启动失败，追到 `TokenService`
- 再追到 `ListNodes`
- 最后追到底层 Cosmos DB 的分页行为，以及扩容后 **physical partition** 变化

这个故障的本质，是两个隐藏假设同时被打破了：

1. **误把 cross-partition query 当成稳定的 single-partition query 在用**  
2. **误把 empty page 当成 query finished，没有结合 continuation token 一起判断**

#### 修复思路

#### 1. 短期止血

先修正底层分页逻辑：**只要 continuation token 还存在，就必须继续翻页**，不能因为当前页为空就提前返回。  
这个修复对应 **2025-06-17 commit `26997ddc0`**。

#### 2. 长期治理

把 `ListNodes` 改成真正的 **partition-scoped query**，避免 cross-partition query 带来的正确性风险和性能风险。

#### 面试时怎么讲亮点

这个案例不是普通的分页 bug，而是一个 **容量扩展触发的分布式系统边界问题**。

扩容本身没有错，但它改变了底层 **physical partition** 分布，暴露了应用层对查询行为的错误假设。  
这个故事能体现三点：

1. **你理解数据库分区模型，而不只是会用 SDK**  
2. **你知道分页语义不能只看“当前页有没有数据”，还要结合 continuation token**  
3. **你能从链路级故障现象，一层层定位到存储层根因**

#### 可能的 follow-up 问题

**Q：你刚才提到 RU 扩容和 physical partition 变化，能解释一下 logical partition、physical partition、cross-partition query 之间的关系吗？**

**答：**  
Cosmos DB 对业务暴露的是 **logical partition**，由 partition key 决定；底层真正承载吞吐和数据的是 **physical partition**。  
当 RU 扩容到一定规模后，Cosmos DB 可能新增 physical partition，并把一部分 logical partitions 重新映射过去。

如果查询被 partition key 精确限定，那它就是 **single-partition query**；如果没有限定，就会变成 **cross-partition query**，需要跨多个 physical partitions 聚合结果。  
这样在扩容或数据重分布后，就更容易暴露出分页、部分结果、`empty page + non-empty token` 这类边界情况。

#### 一句话总结

> 这次事故的关键经验不是“修了一个分页 bug”，而是**不能依赖某个规模下看起来没问题的 cross-partition query 行为**；应该从设计上把查询收敛到正确的 partition scope。

---

## 小马智行

> 面向小马智行面试场景整理的 FCS 项目问答，重点强调平台复杂度、技术判断、管理决策和工程权衡。

### 2. Workload 选型的因素

#### 核心回答

**答：** 我做 workload 选型时，不会先看某个技术“流不流行”，而是先看它和业务目标是否匹配。  
在 FCS 这类平台里，本质上是在不同 workload 的 **时延、弹性、隔离、稳定性、成本、平台控制力** 之间做平衡。

#### 我通常会看的维度

| 维度 | 我会重点看什么 |
| --- | --- |
| **启动时延** | 业务对冷启动是否敏感，是分钟级可接受，还是要求秒级拉起 |
| **运行形态** | 是短时批任务、长期在线服务，还是状态型 / GPU / 大内存任务 |
| **弹性模式** | 流量是平稳还是有明显波峰波谷，是否需要快速 scale out |
| **隔离要求** | 租户之间是否要强隔离，是否有网络、权限、安全边界要求 |
| **平台能力** | 是否依赖 Helm、CRD、Operator、复杂网络策略、K8s 生态能力 |
| **稳定性要求** | SLA、升级方式、回滚成本、故障恢复要求有多高 |
| **成本模型** | 是更看重空载成本，还是更看重峰值响应能力 |
| **团队能力** | 团队是否能承担对应的运维复杂度和长期治理成本 |

#### 在 FCS 里的典型理解

- **ACI** 更适合轻量、交付快、平台托管更多、对 K8s 深度能力依赖不高的 workload  
- **AKS** 更适合长期运行、编排更复杂、需要更强控制力和生态扩展能力的 workload

#### 一句话总结

> 我不会选“最强”的底座，而是选**业务收益和系统复杂度最匹配**的底座。

### 3. 作为领导怎么决策

#### 核心回答

**答：** 作为领导，我不希望团队每次都靠经验拍脑袋做技术选择，而是会先建立一个**可复制的决策框架**。  
技术决策的重点不只是这次选得对不对，而是以后类似问题能不能持续做出高质量判断。

#### 我通常怎么做

1. **先定义目标函数**：这次优先保 SLA、保成本、保交付速度，还是保平台统一性。  
2. **把决策维度量化**：延迟、可用性、复杂度、风险、团队学习成本尽量都量化。  
3. **设默认路径和例外机制**：比如默认推荐轻量方案，只有满足明确条件才升级到更重的底座。  
4. **先试点再放大**：先用小流量、小范围验证，再逐步推广，而不是一开始全量切换。  
5. **用数据关门**：最后靠压测、线上指标、故障演练和回滚成本来收敛争论。

#### 面试时可以强调的点

- **领导不是替团队做所有技术细节判断，而是建立决策机制**
- **好的技术决策必须带回滚路径**
- **平台决策要考虑长期治理成本，而不只是短期交付速度**

#### 一句话总结

> 我更看重的不是单次拍板，而是把技术决策沉淀成团队可以复用的方法论。

### 4. Agent 在项目里的使用程度、场景，以及怎么看待这件事

#### 核心回答

**答：** 我会把 Agent 当成一个**高频使用的提效工具**，但不会把它当成决策主体。  
它非常适合帮助工程师提升信息处理效率，但在架构判断、关键链路改动和复杂故障分析上，最终责任还是在人。

#### 在项目里的使用程度

我日常会比较高频地用 Agent，尤其在代码理解、日志分析、文档初稿、排障辅助这些场景里价值很明显。  
但我不会把它用成“自动写完系统设计”的黑盒，而是把它放在工程师工作流里做增强。

#### 典型场景

| 场景 | Agent 的价值 |
| --- | --- |
| **读代码 / 找入口** | 快速总结模块边界、调用链和关键类职责 |
| **日志 / 告警初筛** | 帮助归并异常、提取时间线、形成初步假设 |
| **脚本 / 查询生成** | 辅助写 Kusto、排障脚本、SQL、自动化命令 |
| **测试和样板代码** | 生成单测骨架、接口示例、重复性代码 |
| **文档和 Review** | 生成 PR 摘要、文档初稿、review checklist |

#### 我怎么看这件事

| 维度 | 我的看法 |
| --- | --- |
| **正面价值** | Agent 能显著提升信息处理速度，尤其适合大仓、多模块、跨领域协作场景 |
| **风险边界** | 它可能会误解上下文、遗漏约束、给出看似合理但不可靠的结论 |
| **管理要求** | 必须有 code review、测试门禁、权限隔离和人工兜底 |

#### 一句话总结

> 我把 Agent 看成“高级副驾驶”，不是“自动驾驶”；用得越多，越需要边界感和工程约束。

### 6. Health Check 做到 FCS 这一层和上层的权衡

#### 核心回答

**答：** 我不认为这是一个二选一问题。  
更合理的做法是：**FCS 做平台通用健康，上层做业务语义健康**。

#### 为什么不能全放 FCS

| 原因 | 解释 |
| --- | --- |
| **平台不应该过度侵入业务语义** | 不同 workload 对“健康”的定义差异很大，平台很难统一抽象到位 |
| **会让控制面变重** | 如果把业务级探针逻辑都堆到 FCS，平台复杂度和脆弱性都会上升 |
| **会弱化上层责任** | 真正的业务可用性，最终还是业务自己最清楚 |

#### 为什么也不能全放上层

| 原因 | 解释 |
| --- | --- |
| **平台需要统一生命周期治理** | 没有平台级健康信号，就很难做扩缩容、重部署、自动修复和编排收敛 |
| **上层未必能看到底层异常** | 有些问题是容器、节点、网络、sidecar 层面的，业务探针感知不到 |
| **需要统一 readiness 语义** | FCS 编排层必须知道什么时候可以把一个 node / cluster 判定为 Ready |

#### 我会怎么分层

| 层级 | 负责什么 |
| --- | --- |
| **FCS 层** | 资源是否 ready、heartbeat 是否正常、容器组 / 节点健康、编排是否收敛 |
| **上层业务层** | 核心接口是否可服务、关键依赖是否满足 SLA、降级是否生效、业务结果是否正确 |

#### 面试时推荐回答

**回答：**  
我的理解是，Health Check 最好做成分层治理。FCS 负责统一的平台级健康判断，比如资源 ready、heartbeat、节点状态、自动修复触发条件；上层 workload 负责自己的业务语义健康，比如接口是否真的可服务、依赖是否满足 SLA。  
这样做的好处是：平台有统一的生命周期控制能力，业务也保留对真实可用性的最终定义权。

#### 一句话总结

> 最佳实践不是谁全负责，而是 **FCS 保底、上层保真**。

---

## DurableTask (DTF)

### 1. 技术原理

**Q1：DurableTaskFramework 的核心工作原理是什么？**

**答：** 我会把 DTF 理解成一个 **基于 Event Sourcing 的分布式工作流引擎**。  
它把 Orchestrator 当成“流程定义者”，把每一步真实执行放到 Activity 里；每次流程推进，不是靠进程内存保存状态，而是把状态变化持久化下来，后续再通过 replay 恢复执行上下文。

#### 可以怎么展开

1. **Orchestrator 负责流程编排，不做实际 IO**  
   它定义先做什么、后做什么、失败怎么处理，但真正访问外部系统的是 Activity。
2. **状态靠历史事件恢复**  
   每次被唤醒时，框架会根据已持久化的历史事件 replay，恢复出当前执行到哪一步。
3. **天然支持长流程和失败恢复**  
   进程重启、机器切换、消息重投后，流程仍然可以从历史状态继续推进，而不是从头再来。
4. **代码必须是确定性的**  
   因为 Orchestrator 会被重复 replay，所以不能直接写 `DateTime.Now`、随机数、`Guid.NewGuid()` 这类非确定性逻辑。

#### 一句话总结

> DTF 的核心不是“异步任务调度”，而是**把工作流状态外置持久化，再通过 replay 驱动可靠恢复**。

---

### 2. 选型的 Tradeoff（SQL vs Storage Account）

**Q2：DurableTaskFramework 为什么选 Storage Account 后端，而不是 SQL 后端？Tradeoff 是什么？**

**答：** 这个问题本质上不是“哪个更先进”，而是 **吞吐、运维复杂度、成本、可观测性、业务规模** 的权衡。  
如果业务规模中等、在 Azure 生态内、希望尽量少维护基础设施，Storage Account 往往更合适；如果追求更强查询能力、更高吞吐或更复杂的实例管理能力，SQL 会更有优势。

#### 我会怎么对比

| 维度 | Storage Account | SQL |
| --- | --- | --- |
| **运维成本** | 低，Azure 托管，几乎零额外基础设施 | 中，需维护数据库容量、连接、索引和高可用 |
| **成本结构** | 更轻，适合中等规模 workflow | 更高，但换来更强能力 |
| **吞吐和查询能力** | 够用，但查询和分析能力偏弱 | 更强，适合更复杂的实例检索和管理 |
| **扩展方式** | 更偏消息队列和表存储模型 | 更偏数据库模型，管理和观测更集中 |
| **适合场景** | Azure 原生、中等并发、追求简单稳定 | 高并发、复杂查询、对状态管理要求更高 |

#### 在项目里我会怎么回答

如果像 Hilo 这类场景，工作流量级是中等规模，而且整套系统本来就在 Azure 生态里，那我会优先选 Storage Account，因为它的**综合成本最低，接入最轻，可靠性也够用**。  
但如果未来工作流数量和并发明显上升，或者我们需要对实例做更复杂的检索、排查和运营管理，那 SQL 后端会更有吸引力。

#### 一句话总结

> Storage 赢在**轻量和托管成本低**，SQL 赢在**能力上限和查询管理能力更强**；选型关键看业务规模和治理诉求。
