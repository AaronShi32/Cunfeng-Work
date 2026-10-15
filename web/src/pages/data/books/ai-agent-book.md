## 《深入理解 AI Infra: 量化分析与系统设计》

- Github: https://github.com/bojieli/ai-agent-book
- 在线阅读: https://bojieli.github.io/ai-agent-book

## 笔记

- Agent 的核心工作原理——LLM 通过 ReAct 循环，在上下文的辅助下使用工具完成任务

- Harness 的核心是原公式中的“上下文管理 + 工具接口”，再加上三层保障机制：约束（限定 Agent 能做什么、不能做什么）、验证（检查 Agent 做得对不对）和纠正（做错了怎么补救），其工程研究的正是这层“模型之外、Agent 边界之内” 的运行与治理代码

- 好的结构不是替 Agent 预演全部思考，而是守住边界，并把边界内的决策空间还给模型

- Harness 里那些给模型能力短板打补丁的部分，会随着模型变强被模型自己内化