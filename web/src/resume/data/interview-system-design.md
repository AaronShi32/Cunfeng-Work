# 系统设计

## 1. 设计一个分布式消息队列（类 Kafka）

<details>
<summary>概述用例和约束</summary>

- 核心用例：生产者发消息、消费者订阅消费、消息持久化、消息回放
- 约束：高吞吐（百万 TPS）、低延迟、消息不丢失（至少一次投递）、水平扩展
- 不需要：复杂查询、事务消息（简化版）

</details>

<details>
<summary>High-Level 设计</summary>

- Topic → Partition 分片，每个 Partition 是一个有序日志文件
- Producer → Broker 集群 → Consumer Group
- ZooKeeper / KRaft 负责元数据和 Leader 选举

</details>

<details>
<summary>设计核心组件</summary>

- **Broker**：顺序写磁盘（Page Cache + sendfile 零拷贝）保证吞吐
- **Partition**：每条消息有 Offset，消费者自己维护消费位点
- **Replication**：Leader + ISR 副本，Leader 宕机从 ISR 选新 Leader
- **Producer**：批量发送 + 压缩；acks=all 保证不丢
- **Consumer Group**：同组内 Partition 1:1 分配，不同组独立消费

</details>

<details>
<summary>扩展这个设计</summary>

- 增加 Partition 数量实现水平扩展
- 多机房部署 + MirrorMaker 跨集群同步
- 消息堆积：扩 Consumer 或增加 Partition
- 延迟消息：单独时间轮 Topic + 定时投递

</details>

---

## 2. 设计一个分布式配置中心（类 Nacos/Apollo）

<details>
<summary>概述用例和约束</summary>

- 核心用例：发布配置、客户端实时拉取/推送、灰度发布、版本回滚
- 约束：高可用、配置变更秒级生效、支持千万级客户端长连接
- 不需要：强事务、复杂权限（简化版）

</details>

<details>
<summary>High-Level 设计</summary>

- 客户端 Long Polling 拉取配置变更（hold 30s）
- 配置存 MySQL，变更事件推给各 Server 节点，节点再通知客户端
- Server 集群无状态，前置 Nginx 负载均衡

</details>

<details>
<summary>设计核心组件</summary>

- **Config DB**：MySQL 存配置快照 + 变更历史，支持版本回溯
- **通知机制**：Server 间用 DB 轮询或消息队列广播变更事件
- **Long Polling**：客户端挂起请求，Server 有变更立即返回，超时再返回 304
- **本地缓存**：客户端本地文件缓存，Server 不可用时降级读本地

</details>

<details>
<summary>扩展这个设计</summary>

- 灰度：按 IP / 标签下发不同配置版本
- 多环境：Namespace 隔离 dev/staging/prod
- 高可用：Server 多副本 + DB 主从；客户端本地缓存兜底
- 审计：每次变更记录操作人 + diff，支持一键回滚

</details>

---

## 3. 设计一个 RPC 框架（类 Dubbo）

<details>
<summary>概述用例和约束</summary>

- 核心用例：服务注册/发现、远程方法调用、负载均衡、熔断降级
- 约束：调用透明（像本地调用）、低延迟、高可用
- 不需要：跨语言（Java only 简化版）

</details>

<details>
<summary>High-Level 设计</summary>

- Consumer 通过动态代理拦截调用 → 序列化 → 网络传输 → Provider 反射调用
- 注册中心（ZooKeeper/Nacos）存储服务地址列表
- Consumer 本地缓存地址列表，注册中心变更时推送更新

</details>

<details>
<summary>设计核心组件</summary>

- **代理层**：JDK/CGLIB 动态代理，屏蔽网络细节
- **序列化**：Hessian / Protobuf，兼顾性能和跨版本兼容
- **传输层**：Netty NIO 长连接，心跳保活
- **负载均衡**：随机、轮询、一致性哈希、最少活跃数
- **容错**：Failover（重试其他节点）/ Failfast / Fallback

</details>

<details>
<summary>扩展这个设计</summary>

- 熔断：滑动窗口统计错误率，超阈值快速失败（Hystrix 模型）
- 限流：Provider 端信号量 / 线程池隔离
- 链路追踪：透传 TraceId（MDC + Filter）
- 泛化调用：无接口 jar 也能发起调用，适合网关场景

</details>

---

## 4. 设计一个分布式限流系统

<details>
<summary>概述用例和约束</summary>

- 核心用例：对接口/用户/IP 按 QPS 限流，超限返回 429
- 约束：低延迟（限流判断 < 1ms）、集群限流总量准确、高可用
- 不需要：复杂业务规则、按流量大小限流

</details>

<details>
<summary>High-Level 设计</summary>

- 单机：令牌桶（Guava RateLimiter）
- 集群：Redis + Lua 脚本原子计数，滑动窗口或令牌桶
- 限流规则动态下发（配置中心），无需重启

</details>

<details>
<summary>设计核心组件</summary>

- **令牌桶**：Redis Hash 存 tokens + last_refill_time，Lua 原子补桶 + 取桶
- **滑动窗口**：Redis ZSet 存请求时间戳，每次 zremrangebyscore 清过期再 zcard 计数
- **规则引擎**：限流维度（接口/用户/IP）+ 阈值 + 窗口大小，存配置中心
- **降级策略**：Redis 不可用时降级为本地限流，避免全放行

</details>

<details>
<summary>扩展这个设计</summary>

- 多级限流：接口级 + 用户级 + 全局级叠加
- 预热：令牌桶冷启动时缓慢增加速率，防止突发打垮
- 流量整形：漏桶平滑输出，避免下游抖动
- 监控：限流命中率打点，阈值自动告警

</details>

---

## 5. 设计一个分布式任务调度系统（类 XXL-Job）

<details>
<summary>概述用例和约束</summary>

- 核心用例：定时触发任务、任务分片、失败重试、执行日志查看
- 约束：调度精度秒级、任务不重复执行、执行器水平扩展
- 不需要：实时流任务、DAG 依赖（简化版）

</details>

<details>
<summary>High-Level 设计</summary>

- 调度中心（Scheduler）：扫描 DB 中到期任务，下发给执行器
- 执行器（Executor）：注册到调度中心，接收任务并执行，回报结果
- DB 做分布式锁，防止多 Scheduler 重复触发同一任务

</details>

<details>
<summary>设计核心组件</summary>

- **调度线程**：提前 5s 扫描未来一段时间到期的任务，批量加载到内存时间轮
- **分布式锁**：DB 乐观锁 / Redis SETNX，确保同一任务只被一台 Scheduler 触发
- **执行器注册**：心跳上报存活，调度中心维护在线执行器列表
- **任务分片**：将数据范围按执行器数量切片，每台执行器处理一段
- **失败重试**：记录执行日志，失败后按策略重试，超次数告警

</details>

<details>
<summary>扩展这个设计</summary>

- 调度中心高可用：多实例竞争 DB 锁，主备自动切换
- 任务优先级队列：紧急任务插队执行
- 超时控制：执行器超时强制中断 + 回调失败
- 可观测性：任务执行耗时、失败率、积压量实时监控

</details>
