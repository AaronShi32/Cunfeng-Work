## AI Agent 架构与开发

### Q1: 什么是 AI Agent

**核心定义** AI Agent = Model + Tools + Memory + ReAct +  Harness 

相比于单独调用 LLM API， Agent 具备让模型独立思考下一步要做的事情，包括是否调用工具，执行策略(ReAct)等，而 Harness 环境则提供工具，记忆, 维护状态&上下文，控制权限，处理失败失败重试，行为边界，判断终止条件等. **口诀: 模型是脑，工具是手，记忆规划各有用，Harness 负责串联** 

> RAG 不算 Agent，因为 RAG 的行为是固定的，处理数据 - 生成向量 - 返回检索

> Agent 和 Chatbot 区别: Agent 是架构形态， Chatbot 是产品形态， Agent 具备工具（手和脚） + 规划（指挥部） + 记忆（认识你）等基础能力

> Agent 和 Workflow 区别: Workflow 适合步骤已知，稳定可复现的场景， Agent 适合步骤不确定，需要自主探索的场景, Workflow 优势在于: 每步可单独测试，可回滚，成本可预测

### Q2: Agent 是如何工作的

**五步闭环** 组装上下文, 调用模型, 执行工具，注入结果，循环继续（前四轮）
**核心逻辑** While 循环 ReAct

1. 组装上下文: 系统提示词，工具定义， CLAUDE.md, 对话历史，用户消息
2. 调用模型看信号: 模型返回结果，包含是否需要使用工具，是否完成任务
3. tool_use 执行工具: 获取结果，注入结果给模型
4. 循环往复，直到模型给出 end_turn 信号

期间 Agent 还会完成上下文压缩，权限管理，错误恢复等任务（Harness）

### Q3: Agent 如何选择执行哪个工具
