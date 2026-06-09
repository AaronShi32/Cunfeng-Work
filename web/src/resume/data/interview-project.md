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

## Scout：这个项目一句话怎么介绍？

**答：** Scout 是一个面向 Azure Data / Spark 生产问题排障的智能体平台。  
它的核心不是通用问答，而是把专家排障方法论、领域知识和 Kusto 调查流程沉淀成可复用的智能体能力，帮助工程师更快定位根因。

## Scout：persona 可以怎么理解？

**答：** 在 Scout 里，persona 更适合翻译成 **专家角色**。  
它不是单纯的 skill，而是定义了智能体以什么身份、什么方法论去分析问题；skill 更偏单点能力，persona 更偏专家视角和调查策略。

## Scout：整体架构怎么讲？

**答：** 我会概括成五层：**接入层、MCP 服务层、Persona 编排层、Knowledge 层、数据执行层**。

1. **接入层**：VS Code Agent / 本地扩展作为入口。  
2. **MCP 服务层**：`main.py` 启动 Python MCP Server，对外暴露 tools、resources、resource templates。  
3. **Persona 编排层**：`Personas/*.md` 定义不同排障专家角色，比如 JobService、Reliability。  
4. **Knowledge 层**：`Resources/` 和 `Analyzers/` 存放 schema、TSG、调查模式。  
5. **数据执行层**：外部 Kusto MCP / Fabric RTI MCP 负责真实查询，Scout 负责“怎么查”和“怎么分析”。

## Scout：`main.py` 主要做了什么？

**答：** `main.py` 本质上是 Scout 的 MCP 服务入口，主要做六件事：

1. **启动 MCP Server**：通过 `stdio_server()` 等待宿主连接。  
2. **加载配置**：读取 server 名称、personas 目录、Kusto 配置、日志级别等。  
3. **动态加载 persona**：扫描 `Personas/*.md`，提取 name、description、parameters、instructions。  
4. **动态加载资源**：扫描 `Resources/` 和 `Analyzers/`，注册成可读资源。  
5. **暴露 MCP 能力**：实现 `list_tools`、`list_resources`、`read_resource`、`call_tool`。  
6. **处理 persona 调用**：校验参数、识别 persona 中引用的 `scout://resources/...`，自动加载知识并返回完整上下文。

## Scout：LLM 什么时候知道该调用哪个 MCP？

**答：** 不是 Scout 内部硬编码决定的，而是 **MCP host 初始化时做能力发现**。

- 宿主先连接各个 MCP server  
- 调用每个 server 的 `list_tools()` / `list_resources()`  
- 把这些 tool 描述统一提供给当前 LLM  
- LLM 再根据用户问题语义决定先调 Scout，还是直接调 Kusto MCP

所以可以理解成：

- **Scout**：提供专家调查方法和知识增强  
- **Kusto MCP**：提供真实数据查询能力  
- **LLM + Host**：负责工具选择和调用路由

## Scout：这个项目的亮点是什么？

**答：** 我会强调四点：

1. **不是通用聊天，而是生产排障智能体**。  
2. **Persona 数据驱动**，新增专家角色主要靠加 markdown，不用频繁改主逻辑。  
3. **知识自动注入**，persona 引用 resource 后会自动加载 schema / analyzer / TSG。  
4. **工程化完整**，包含参数校验、路径安全、缓存、线程安全、日志和测试。

## Scout：难点在哪里？

**答：**

1. **把隐性专家经验产品化**：把资深同学脑中的排障经验拆成 persona、resource、analyzer。  
2. **控制上下文和准确性**：知识不能一股脑全塞给模型，需要按场景精确注入。  
3. **兼顾灵活性和稳定性**：既要让 Agent 会调查，又要保证参数安全、资源安全和可恢复性。  
4. **多集群、多数据源一致性**：要让不同环境下的调查流程和口径保持一致。

## Scout：如果今天重做，你会怎么设计？

**答：** 我会保留“专家角色 + 领域知识 + 调查流程”这三个核心思想，但不会再以 MCP 作为架构中心，而是升级成一个 **生产排障 Agent 平台**。

核心改动有三点：

1. **从协议驱动改成编排驱动**：引入 Orchestrator，负责意图识别、流程编排、证据汇总。  
2. **从 markdown persona 改成可执行策略**：把 persona 升级成带触发条件、调查 DAG、停止条件的策略。  
3. **从资源拼接改成知识检索和证据链**：把 TSG、schema、Analyzer 做成结构化知识层，按需召回，并输出可验证的 evidence chain。

一句话总结：

> 老的 Scout 更像“把 persona 暴露成 MCP tool”；新的 Scout 应该是“把排障流程做成可观测、可评估、可编排的智能调查系统”。

## Scout：结合当前 AI 技术趋势，这个工具今天会怎么设计？

**答：** 如果按现在的技术趋势重做，Scout 不应该只停留在 **LLM + MCP**，而应该升级成一个 **生产排障 Agent 平台**：  
**`LLM + Orchestrator + Domain Tools + Retrieval/Memory + Eval/Observability + Guardrails`**。  
MCP 仍然可以保留，但更适合作为工具接入协议，而不是架构核心。

### 我会强调三点升级

1. **从自由 tool-calling 升级成编排驱动**  
   增加 Orchestrator，负责问题分类、调查策略选择、步骤控制、证据汇总，而不是让 LLM 自己随意调工具。

2. **从 prompt persona 升级成可执行策略**  
   persona 不再只是专家说明书，而是带触发条件、调查 DAG、停止条件、人工升级条件的 Investigation Policy。

3. **从资源拼接升级成 agentic retrieval + memory**  
   不再把 schema / TSG / analyzer 全量拼进上下文，而是建立 Knowledge Service，按步骤动态检索，并结合历史 case 做长期记忆。

### 工具层也要升级

我会尽量让模型调用 **领域 API**，而不是直接写底层 KQL，比如：

- `get_job_lifecycle(...)`
- `find_scheduler_blockers(...)`
- `get_cluster_health(...)`

这样比直接暴露原始查询工具更稳定、更安全，也更方便做权限控制、审计和评测。

### 输出方式也要变

新版 Scout 不应该只输出自然语言结论，而应该输出：

- **root cause**
- **confidence**
- **evidence chain**
- **recommended actions**
- **是否需要人工升级**

这样它才是一个真正可落地的生产排障系统，而不是“会回答问题的聊天助手”。

### 一句话总结

> 现在的趋势不是“让模型会调更多工具”，而是“让 Agent 在受控编排、知识检索、证据链和评测体系下稳定地完成复杂任务”。Scout 如果今天重做，核心会从 MCP tool 暴露，升级成可编排、可观测、可评估的智能排障平台。

## FCS：CP + ACI Telemetry 架构怎么讲

**简历映射：** 对应“设计 Telemetry 架构，落地日志、指标、链路、发布治理一体化能力”。

**一段话版本：**  
我在 FCS 里做的 Telemetry，不是简单给服务“打日志”，而是把 **控制面 CP** 和 **集群侧 ACI** 做成分层采集架构：CP 负责服务自身日志、指标和相关性上下文，ACI 负责 workload 运行时日志和节点侧指标。两边统一接入 Geneva 体系，日志进入 Kusto，指标进入 MDM，最终支撑故障定位、发布观测和稳定性治理闭环。

### 先把架构分成两层讲

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

### 我会怎么把它讲成“架构设计”

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

### 面试时推荐回答

**提问：** 你简历里写“设计 Telemetry 架构”，具体做了什么？

**回答：**  
我在 FCS 里做的是一个分层 Telemetry 架构。控制面 CP 采集服务自身日志、指标和相关性上下文，主要支撑 API、编排、发布和稳定性治理；集群侧 ACI 则在模板里统一下发 collectd、fluent-bit、mdsd，采集 workload 日志和节点运行指标。  
两边都接到 Geneva 体系，日志进入 Kusto，指标进入 MDM。这样我就能把“请求进来了什么、编排做了什么、集群里实际发生了什么、发布后哪个 deployment 出问题了”串成一条完整链路。  
所以这件事的价值不只是可观测性，而是把故障定位、发布观测和平台治理打通。

### 面试亮点要强调的 5 点

1. **我做的是平台级 Telemetry，而不是给单个服务加日志。**
2. **我把控制面和集群侧拆开治理，边界清晰。**
3. **我关心日志、指标、链路上下文怎么统一，而不只是采集工具本身。**
4. **我把采集能力做成模板和平台默认能力，降低 workload 接入成本。**
5. **我让 Telemetry 真正服务于发布治理和故障闭环，而不是停留在观测层。**

### 可追问问题

- 为什么 CP 指标进 MDM，而日志进 Kusto？
- ACI 为什么用 `collectd + fluent-bit + mdsd` 这种分层方式？
- 如果没有标准 trace，你怎么做链路关联？
- 你如何把发布信息和 Telemetry 关联起来？
- 如果今天重做这套架构，你会不会引入 OpenTelemetry？

### 如果被追问“你的设计难点是什么”

**答：** 我觉得难点不是把 agent 装上，而是三件事：

1. **控制面和 workload 面口径统一**，不然故障定位会断层。  
2. **配置和证书平台化下发**，不然每个 workload 都会重复造轮子。  
3. **让 Telemetry 服务于发布治理**，而不只是做一个“有很多日志”的系统。  

### 一句话收尾

> 我做的不是单点日志接入，而是把 CP 和 ACI 两层观测能力统一到 Geneva / Kusto / MDM 体系里，让 Telemetry 真正成为稳定性治理和发布治理的基础设施。

## FCS：AKS 和 ACI 技术选型特点

### 选型对比表

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

### 我在面试里会怎么总结

| 问题 | 推荐回答 |
| --- | --- |
| **为什么 FCS 同时用了 AKS 和 ACI？** | 因为这不是二选一，而是按 workload 形态分层承载。AKS 提供能力上限和平台控制力，ACI 提供轻量交付和更低运维成本。 |
| **AKS 的技术选型特点是什么？** | AKS 更像平台型底座，适合长期运行、复杂编排、依赖 Kubernetes 生态、后续持续演进的 workload。 |
| **ACI 的技术选型特点是什么？** | ACI 更像轻量运行底座，适合快速起实例、少运维、结构相对简单的 workload。 |
| **这背后的架构思路是什么？** | 不是追求统一底座，而是根据 workload 对控制力、扩展性、交付速度、运维复杂度的不同诉求做分层选型。 |

### 一句话总结

> AKS 赢在能力和控制力，ACI 赢在轻量和交付效率；FCS 的选型特点不是强行统一基础设施，而是按 workload 特征选择最合适的承载底座。
