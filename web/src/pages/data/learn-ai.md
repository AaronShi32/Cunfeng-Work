## AI Agent 架构与开发

### Q1：什么是 AI Agent

**核心定义** AI Agent = Model + Harness 环境

相比于单独调用 LLM API， Agent 具备让模型独立思考下一步要做的事情，包括是否调用工具，执行策略(ReAct)等，而 Harness 环境则提供工具，维护状态&上下文，控制权限，处理失败失败重试，行为边界，判断终止条件等

> RAG 不算 Agent，因为 RAG 的行为是固定的，处理数据 - 生成向量 - 返回检索
