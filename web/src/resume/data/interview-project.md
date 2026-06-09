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
