# Kubernetes & 容器面试要点

> 覆盖 K8s 核心概念 + 结合个人项目经验（Microsoft Fabric / Azure HDInsight / 阿里云 ECS）的实战问答。

---

## 核心概念速查

### Pod 与工作负载

- **Pod** 是 K8s 最小调度单元，一个 Pod 内多个容器共享 Network Namespace 和 Volume。
- **Deployment**：无状态应用声明式管理，支持滚动更新（RollingUpdate）、回滚（`kubectl rollout undo`）。
- **StatefulSet**：有状态应用（如数据库），保证 Pod 名称有序、PVC 绑定稳定、启动 / 删除顺序可控。
- **DaemonSet**：每个节点运行一个 Pod，常用于日志采集（Fluentd）、监控 Agent（node-exporter）。
- **Job / CronJob**：一次性或定时批处理任务，通过 `completions` / `parallelism` 控制并发。

### Service 与网络

- **ClusterIP**：集群内部虚拟 IP，kube-proxy 通过 iptables / IPVS 实现负载均衡。
- **NodePort**：在每个节点上暴露固定端口（30000-32767）。
- **LoadBalancer**：云上自动关联 SLB / ALB，对外暴露服务。
- **Headless Service**（`clusterIP: None`）：直接返回 Pod IP 列表，StatefulSet 依赖此实现稳定 DNS。
- **Ingress**：七层路由（Host / Path），由 Ingress Controller（Nginx / Traefik / ALB）实现。
- **NetworkPolicy**：Pod 级别的网络 ACL，基于 Label Selector 控制 ingress / egress 流量。

### 调度机制

- **调度流程**：Predicate（过滤不满足的节点）→ Priority（打分排序）→ Bind。
- **nodeSelector / nodeAffinity**：将 Pod 约束到特定标签节点。
- **Taint & Toleration**：节点打 Taint 排斥 Pod，Pod 声明 Toleration 才能调度上去（用于 GPU 节点、专属资源池）。
- **PodAffinity / PodAntiAffinity**：控制 Pod 间的亲和 / 反亲和，实现高可用（跨 AZ 打散）或就近部署（同 Node 低延迟）。
- **TopologySpreadConstraints**：更精细的拓扑打散策略（zone / node 维度）。

### 存储

- **PV / PVC**：PV 是集群级存储资源，PVC 是 Pod 对存储的声明，通过 StorageClass 动态供给。
- **StorageClass**：抽象底层存储供应商（AWS EBS、Azure Disk、Ceph RBD），`reclaimPolicy` 控制 PV 回收策略（Delete / Retain）。
- **CSI（Container Storage Interface）**：标准化存储插件接口，解耦 K8s 核心与存储实现。
- **ephemeral volume / emptyDir**：Pod 生命周期内的临时存储，Pod 销毁即丢失。

### 安全

- **RBAC**：Role / ClusterRole 定义权限，RoleBinding / ClusterRoleBinding 绑定到用户 / ServiceAccount。
- **ServiceAccount**：Pod 的身份标识，自动挂载 token 到 `/var/run/secrets/kubernetes.io/serviceaccount/`。
- **Pod Security Standards**（替代 PodSecurityPolicy）：三种级别 Privileged / Baseline / Restricted，通过 namespace label 启用。
- **Secret**：存储敏感数据（token、证书），base64 编码（非加密），生产建议启用 etcd 加密或用外部 KMS。
- **NetworkPolicy**：限制 Pod 间通信，零信任网络的基础。

### 弹性伸缩

- **HPA（Horizontal Pod Autoscaler）**：基于 CPU / 内存 / 自定义指标自动调整副本数。
- **VPA（Vertical Pod Autoscaler）**：自动调整 Pod 的 resource requests / limits。
- **Cluster Autoscaler**：节点级弹性，当 Pod 因资源不足 Pending 时自动扩节点，闲置时缩容。
- **KEDA**：事件驱动弹性伸缩，支持基于 Kafka 队列深度、Prometheus 指标等外部信号。

### 容器运行时

- **CRI（Container Runtime Interface）**：K8s 与容器运行时的标准接口，kubelet 通过 gRPC 调用。
- **containerd**：当前主流运行时（Docker 底层也是 containerd），K8s 1.24 后移除 dockershim。
- **OCI（Open Container Initiative）**：容器镜像格式和运行时的开放标准（image-spec / runtime-spec）。
- **runc**：OCI 参考实现的低级运行时；**kata containers** / **gVisor** 提供沙箱隔离增强安全性。

---

## 项目实战问答

### AKS + ACI 选型与容器化降本 80%

**提问：** 为什么 Fabric / HDInsight 平台选择 AKS + ACI 组合，而不是纯 AKS？

**回答：**  
两者承载的工作负载特征不同。AKS 适合长驻服务（控制面、API Server），资源利用率高；ACI 适合突发性、短生命周期的计算任务（如 Spark 作业启停），按需创建、用完即销，不需要维护常驻节点池。  
这种混合架构的核心收益是：通过 AKS 管理控制面保证稳定性，通过 ACI 承载数据面实现弹性 + 降本。VM 迁移到容器后成本下降约 80%，这个数字来自两方面：一是资源利用率从 VM 的 10-20% 提升到容器的 60%+（多租户共享），二是 ACI 按秒计费避免了 VM 的闲置浪费。

---

### 控制面设计 / Workload 生命周期管理

**提问：** 在容器化平台中，控制面和数据面是如何拆分的？

**回答：**  
控制面负责工作负载的编排和生命周期管理——创建、更新、删除、状态同步，对外暴露 RESTful API。数据面负责实际的计算执行——容器启动、资源分配、网络配置。  
拆分的核心原则是：控制面要高可用但不需要高吞吐，数据面要弹性但可以容忍短暂不可用。在 K8s 语境下，控制面类似于 API Server + Controller Manager 的角色，数据面类似于 kubelet + 容器运行时。  
我在 Fabric 做的 FCS 就是这种分层：控制面在 AKS 上跑，通过自定义 Controller 管理 Workload CRD 的生命周期；数据面按需在 ACI 上启动容器实例。

---

### Autoscale 链路 / P90 延迟优化

**提问：** Autoscale 系统怎样在低延迟和可靠性之间取得平衡？

**回答：**  
Autoscale 的延迟来自整条链路：指标采集 → 决策 → 发起扩容请求 → 节点就绪 → Pod 调度 → 容器启动。每一环都可能是瓶颈。  
在 HDInsight Autoscale v2 中，目标是把 P90 scale latency 压到 12 分钟以内。关键优化包括：  
1. **消息链路优化**：从轮询改为事件驱动，扩容请求通过加密 Queue 投递，减少等待。  
2. **Workflow 阻塞点治理**：引入 Feature Flag 缩短 workflow 中的串行等待步骤。  
3. **节点预热**：在 K8s 场景下类似于 Cluster Autoscaler 的 warm pool，提前准备好节点避免冷启动。  
核心思路是端到端时延分析 + 逐段压缩，而不是只优化某一个 workflow。

---

### 容器网络 / ENI / 跨 AZ 迁移中的网络方案

**提问：** 容器环境下的网络和传统 VM 网络有什么关键差异？

**回答：**  
K8s 网络模型要求每个 Pod 有独立 IP，且 Pod 间直接可达（无 NAT）。这比 VM 的一机一 IP 复杂得多：  
- **CNI 插件**（如 Azure CNI、Calico、Cilium）负责给 Pod 分配 IP 和配置网络。  
- **Azure CNI** 直接从 VNet Subnet 分配 IP 给 Pod，Pod IP 与节点 IP 同网段，网络性能好但会消耗大量 IP。  
- **Overlay 模式**（如 Calico VXLAN）：Pod 使用独立网段，通过隧道封装通信，节省 IP 但增加少量延迟。  

在阿里云 ECS ENI 项目中，我做的工作直接关联容器网络底层：ENI 的多私网 IP 能力支撑了每个节点上多个 Pod 的 IP 分配，类似 Azure CNI 的模式。跨可用区迁移时保留私网 IP 不变的难点在于：IP 地址是与 Subnet 绑定的，跨 AZ 意味着跨 Subnet，需要在网络层面做 IP 地址的"逻辑保留 + 物理重绑定"。

---

### 容器化环境的稳定性治理 / On-call

**提问：** 容器化平台的稳定性治理和传统 VM 平台有什么不同？

**回答：**  
容器平台引入了更多动态性和复杂性：  
1. **故障域更细**：从"一台机器挂了"变成"一个 Pod 挂了"，故障数量多但影响面可能更小（如果做好了副本和调度）。  
2. **状态管理更难**：容器本身是 ephemeral 的，状态必须外置到 PV 或外部存储，否则 Pod 重建即丢失。  
3. **依赖链更长**：一个请求可能经过 Ingress → Service → Pod → Sidecar → 外部存储，任何一环出问题都影响可用性。  
4. **可观测性要求更高**：需要从容器、Pod、Node、Cluster 多层采集指标和日志。  

我的稳定性治理方法论是四层模型：On-call 流程标准化 → TSG / RCA 沉淀 → 可观测性建设 → 根因修复闭环。在容器场景下还额外关注：Pod 重启风暴的自动检测、Node 级别的 cordon + drain 策略、以及容器镜像版本与集群版本的兼容性矩阵。

---

## 高频面试题 Q&A

### 1. Pod 的生命周期和状态有哪些？

<details>
<summary>查看回答</summary>

Pod 的主要阶段（Phase）：
- **Pending**：已创建但容器尚未运行（等调度、拉镜像等）。
- **Running**：至少一个容器在运行。
- **Succeeded**：所有容器正常退出（exit 0），不会重启。
- **Failed**：至少一个容器以非零状态退出。
- **Unknown**：通常是 kubelet 与 API Server 通信异常。

容器级别还有 Waiting / Running / Terminated 三种状态，以及 Init Container 和 readinessProbe / livenessProbe / startupProbe 对生命周期的影响。

</details>

---

### 2. Deployment 的滚动更新策略是怎样的？

<details>
<summary>查看回答</summary>

Deployment 默认使用 `RollingUpdate` 策略，通过两个参数控制：
- **maxUnavailable**：更新过程中允许不可用的最大 Pod 数（默认 25%）。
- **maxSurge**：允许超出期望副本数的最大 Pod 数（默认 25%）。

流程：创建新 ReplicaSet → 逐步增加新 RS 副本 → 逐步减少旧 RS 副本。通过 `kubectl rollout status` 观察进度，`kubectl rollout undo` 回滚到上一版本。

生产建议：配合 readinessProbe 确保新 Pod 真正就绪后才接流量，避免短暂不可用。

</details>

---

### 3. Service 四种类型及适用场景？

<details>
<summary>查看回答</summary>

| 类型 | 分配的地址 | 可访问范围 | 典型场景 |
|------|-----------|-----------|---------|
| **ClusterIP** | 集群内虚拟 IP | 仅集群内部 | 微服务间调用（默认类型） |
| **NodePort** | ClusterIP + 每个节点的固定端口（30000-32767） | 集群外通过 `<NodeIP>:<NodePort>` 访问 | 开发测试、无云 LB 环境 |
| **LoadBalancer** | ClusterIP + NodePort + 云厂商 LB 的外部 IP | 公网 / VPC 外部 | 生产对外暴露服务（自动创建 ALB / SLB） |
| **ExternalName** | 无 IP，返回 CNAME DNS 记录 | DNS 级别转发 | 集群内访问外部服务（如 RDS 域名），做服务别名 |

**层层递进关系**：`ClusterIP` 是基础 → `NodePort` 在其上加节点端口 → `LoadBalancer` 在其上再加云负载均衡器。三者是包含关系，不是替代关系。`ExternalName` 则完全独立，不经过 kube-proxy，只做 DNS 映射。

**kube-proxy 实现机制**（ClusterIP / NodePort / LoadBalancer 共用）：
- **iptables 模式**（默认）：为每个 Service 创建 iptables 规则，随机选择后端 Pod。
- **IPVS 模式**：使用 Linux IPVS，支持更多调度算法（rr / lc / sh 等），大规模集群下性能更好。
- **userspace 模式**（已弃用）：kube-proxy 自身做代理转发。

**面试加分点**：
- Service 通过 Label Selector 匹配后端 Pod，Endpoints Controller 自动维护 Endpoints 对象；K8s 1.21+ 推荐 EndpointSlice 支持更大规模。
- `Headless Service`（`clusterIP: None`）不分配虚拟 IP，DNS 直接返回 Pod IP 列表，是 StatefulSet 实现稳定网络标识的基础。
- 生产中通常 LoadBalancer + Ingress 组合使用：LB 做 L4 入口，Ingress Controller 做 L7 路由（Host / Path），避免为每个服务都创建一个 LB。

</details>

---

### 4. Service 与 Ingress 的区别和协作关系？

<details>
<summary>查看回答</summary>

**核心定位不同**：Service 解决服务发现和四层负载均衡，Ingress 解决统一入口和七层路由。

| 对比项 | Service | Ingress |
|--------|---------|---------|
| 工作层级 | L4（传输层） | L7（应用层） |
| 关注内容 | IP、Port | Host、Path、Header |
| 负载均衡 | 有（kube-proxy） | 有（Ingress Controller） |
| 路由能力 | 无 | 有（基于域名和 URL 路径） |
| TCP 支持 | 支持 | 主要 HTTP/HTTPS |
| 是否直接对外 | 可选（ClusterIP 不对外，LB 对外） | 通常是（统一流量入口） |
| 主要作用 | 为 Pod 提供稳定访问入口 | 统一流量入口、域名管理、HTTPS 卸载 |

**生产环境典型流量路径**：

```
Client → Ingress（L7 路由）→ Service（L4 负载均衡）→ Pod
```

- **Ingress** 根据 Host / Path 规则把请求分发到对应的 Service。
- **Service** 通过 Label Selector 自动发现后端 Pod，做四层转发。
- **Ingress Controller**（如 Nginx Ingress、Traefik、ALB Ingress）是 Ingress 规则的实际执行者，本身也是一个 Deployment + Service（通常是 LoadBalancer 类型）。

**为什么需要两层？**
- Service 单独使用时，每个服务对外暴露都需要一个独立的 LoadBalancer（云上意味着独立的公网 IP 和费用）。
- Ingress 将多个 Service 收拢到一个入口，通过域名和路径区分，共享一个 LB，既省成本又方便管理 HTTPS 证书和灰度策略。

</details>

---

### 5. 如何排查 Pod 一直处于 Pending 状态？

<details>
<summary>查看回答</summary>

常见原因及排查步骤：

1. **资源不足**：`kubectl describe pod` 查看 Events 中是否有 `Insufficient cpu/memory`，用 `kubectl describe node` 查看节点可分配资源。
2. **调度约束不满足**：检查 nodeSelector / nodeAffinity / tolerations 是否匹配，`kubectl get nodes --show-labels` 核对标签。
3. **PVC 绑定失败**：`kubectl get pvc` 查看状态是否为 Bound，StorageClass 是否存在且可用。
4. **节点 Taint 阻止调度**：`kubectl describe node | grep Taint` 检查节点是否有 Pod 未 Tolerate 的 Taint。
5. **ResourceQuota / LimitRange 限制**：namespace 级别的资源配额已满。

核心方法论：**先 describe pod 看 Events → 再 describe node 看资源和 Taint → 再看 PVC / Quota**。

</details>

---

### 6. etcd 在 K8s 中的角色和运维要点？

<details>
<summary>查看回答</summary>

etcd 是 K8s 的唯一数据源（single source of truth），所有集群状态都存储在 etcd 中。

运维要点：
- **高可用**：至少 3 节点（奇数），跨 AZ 部署，Raft 协议保证一致性。
- **性能**：对磁盘 IOPS 敏感，建议使用 SSD，`WAL` 和 `data` 目录分盘。
- **备份**：定期执行 `etcdctl snapshot save`，备份到异地存储。
- **容量**：默认 2GB 上限（`--quota-backend-bytes`），需要监控并定期 compact + defrag。
- **安全**：启用 TLS 加密通信 + 客户端证书认证。

大规模集群中 etcd 性能是瓶颈之一，需要关注 leader 选举频率、Apply Duration 和存储大小。

</details>

---

### 7. K8s 网络模型的核心要求是什么？

<details>
<summary>查看回答</summary>

K8s 网络模型的三条规则（不允许违反）：
1. **Pod 内容器共享网络**：同一 Pod 内的容器通过 localhost 通信。
2. **Pod 间直接可达**：任意两个 Pod 可以直接用 Pod IP 通信，不需要 NAT。
3. **Node 与 Pod 可达**：Node 可以直接访问任何 Pod IP。

CNI 插件负责实现这些要求。常见方案：
- **Flannel**：简单的 Overlay 网络（VXLAN），适合小集群。
- **Calico**：支持 BGP 路由和 NetworkPolicy，适合大规模生产。
- **Cilium**：基于 eBPF，性能优秀，原生支持 L7 策略和可观测性。
- **Azure CNI**：直接从 VNet 分配 IP，Pod 与 Node 同网段。

</details>

---

### 8. RBAC 权限模型怎么理解？

<details>
<summary>查看回答</summary>

RBAC 的四个核心对象：
- **Role**：命名空间级权限定义（如：允许读 Pod、写 ConfigMap）。
- **ClusterRole**：集群级权限定义（可跨 namespace 或管理集群资源如 Node）。
- **RoleBinding**：将 Role 绑定到用户 / Group / ServiceAccount。
- **ClusterRoleBinding**：将 ClusterRole 绑定到全局。

权限是加法模型（只有允许，没有拒绝）。最小权限原则：每个 ServiceAccount 只绑定必需的 Role。

常见实践：
- 给 CI/CD pipeline 创建专用 ServiceAccount，只授权 deploy 相关操作。
- 使用 `kubectl auth can-i` 快速验证权限。
- 生产集群禁用默认 ServiceAccount 的 automountServiceAccountToken。

</details>

---

### 9. HPA 的工作原理和调优经验？

<details>
<summary>查看回答</summary>

HPA 工作流程：
1. Metrics Server 定期采集 Pod 的 CPU / 内存指标（默认 15s）。
2. HPA Controller 每 15s 查询指标，计算目标副本数：`期望副本 = ceil(当前副本 × 当前指标值 / 目标值)`。
3. 调整 Deployment 的 replicas 字段。

调优要点：
- **必须设置 resource requests**：HPA 基于 requests 的百分比计算，不设 requests 则无法工作。
- **冷却时间**：`--horizontal-pod-autoscaler-downscale-stabilization` 防止频繁缩容（默认 5min）。
- **自定义指标**：通过 Prometheus Adapter 或 KEDA 支持基于 QPS、队列深度等业务指标扩缩。
- **避免 HPA + VPA 冲突**：不要同时对同一 Deployment 的同一指标配置 HPA 和 VPA。

结合项目经验：HDInsight Autoscale v2 的思路类似，核心是端到端延迟拆解 + 逐段优化。

</details>

---

### 10. 如何设计容器化应用的健康检查？

<details>
<summary>查看回答</summary>

K8s 提供三种探针：
- **startupProbe**：容器启动期间检查，通过后才会启用其他探针。适合慢启动应用（如 Java 大型应用）。
- **livenessProbe**：检测容器是否存活，失败会重启容器。不要用来检查依赖（如 DB 连接），否则 DB 故障会导致所有 Pod 雪崩重启。
- **readinessProbe**：检测容器是否就绪，失败会从 Service Endpoints 摘除但不重启。适合检查"是否能接流量"。

探针类型：HTTP GET / TCP Socket / exec 命令 / gRPC（1.24+）。

生产建议：
- liveness 检查自身进程健康（如 `/healthz`），readiness 检查能否处理请求（如 `/ready` 包含依赖检查）。
- 合理设置 `initialDelaySeconds`、`periodSeconds`、`failureThreshold`，避免误杀或检测过慢。

</details>

---

### 11. Helm 和 Kustomize 各自的适用场景？

<details>
<summary>查看回答</summary>

**Helm**：
- 包管理器，Chart 是可参数化的 YAML 模板集合。
- 适合：需要发布到多个环境（dev / staging / prod）的应用、开源社区软件（nginx-ingress、prometheus）。
- 优势：版本管理（`helm rollback`）、依赖管理、生态丰富。
- 劣势：Go template 语法复杂，调试困难。

**Kustomize**：
- 基于 patch / overlay 的配置管理，不使用模板，直接操作原始 YAML。
- 适合：同一份 base 配置在不同环境做差异化（改 image tag、改副本数、加 label）。
- 优势：无模板，声明式，kubectl 原生支持（`kubectl apply -k`）。
- 劣势：不支持条件逻辑和复杂参数化。

实际项目中两者常结合使用：用 Helm 管理第三方依赖，用 Kustomize 管理自研服务的多环境配置。

</details>

---

### 12. ConfigMap 与 Secret 的区别？

<details>
<summary>查看回答</summary>

| 对比项 | ConfigMap | Secret |
|--------|-----------|--------|
| 用途 | 普通配置 | 敏感配置 |
| 数据类型 | 明文 | Base64 编码 |
| 默认存储 | etcd | etcd |
| 默认加密 | 否 | 否（仅编码） |
| 环境变量注入 | 支持 | 支持 |
| Volume 挂载 | 支持 | 支持 |
| TLS 证书 | 不适合 | 支持 |
| 数据库密码 | 不推荐 | 推荐 |

ConfigMap 用于存储非敏感配置，例如应用参数、日志级别和服务地址；Secret 用于存储敏感信息，例如密码、Token 和证书。两者都存储在 etcd 中，都可以通过环境变量或 Volume 挂载到 Pod。需要注意的是，Kubernetes Secret 默认只是 Base64 编码而非真正加密，生产环境通常会结合 etcd Encryption、KMS 或 Vault 等方案提升安全性。

</details>

---

### 13. Deployment、Job 与 CronJob 的区别？

<details>
<summary>查看回答</summary>

| 类型 | Deployment | Job | CronJob |
|------|-----------|-----|---------|
| 用途 | 长期运行 | 一次性任务 | 定时任务 |
| Pod 退出 | 重启 | 成功结束 | 成功结束 |
| 副本数 | replicas | completions | schedule |
| 自动调度 | 否 | 否 | 是 |
| 典型场景 | Web 服务 | 数据迁移 | 定时备份 |

Job 用于执行一次性批处理任务，保证任务成功完成指定次数。与 Deployment 不同，Job 中的 Pod 执行完成后状态会变为 Completed，而不会被持续重启。CronJob 则是在 Job 之上增加了定时调度能力，通过 Cron 表达式定期创建 Job，适用于数据库备份、报表生成、数据同步等周期性任务。面试中需要重点理解 completions、parallelism、backoffLimit 以及 CronJob 与 Linux Crontab 的对应关系。

</details>

---

### 14. K8s 控制器的设计思想和常见类型？

<details>
<summary>查看回答</summary>

**设计思想**：声明式 API + 控制循环（Reconcile Loop），也叫终态驱动。

```
Observe（观察当前状态）→ Diff（与期望状态对比）→ Act（执行调谐动作）
```

用户只声明"期望状态"，控制器持续将"实际状态"向期望状态收敛，实现自愈、幂等和解耦。

**工作负载控制器**：

| 控制器 | 核心职责 |
|---|---|
| **Deployment** | 无状态应用，管理 ReplicaSet，支持滚动更新、回滚、扩缩容 |
| **ReplicaSet** | 维持指定数量 Pod 副本（通常由 Deployment 管理，不直接使用） |
| **StatefulSet** | 有状态应用，提供稳定网络标识、持久存储、有序部署 |
| **DaemonSet** | 每个节点运行一个 Pod（日志采集、监控 Agent） |
| **Job / CronJob** | 一次性 / 定时批处理任务 |

**系统级控制器**（运行在 kube-controller-manager 中）：

| 控制器 | 职责 |
|---|---|
| **Node Controller** | 监控节点健康，失联后驱逐 Pod |
| **Endpoint Controller** | 维护 Service ↔ Pod 的映射关系 |
| **HPA** | 根据指标自动调整 Pod 副本数 |
| **GC Controller** | Owner 被删后级联清理子资源 |

</details>

---

### 15. CRD + Operator 模式是什么？解决什么问题？

<details>
<summary>查看回答</summary>

**问题**：K8s 内置控制器只覆盖通用场景，复杂中间件的领域运维逻辑（主从切换、备份恢复、证书续签等）无法用 Deployment + 脚本优雅实现。

**CRD（Custom Resource Definition）** 让用户定义新的资源类型，与 Pod、Service 平级：

```yaml
apiVersion: database.example.com/v1
kind: MySQLCluster
metadata:
  name: my-db
spec:
  replicas: 3
  version: "8.0"
```

CRD 只定义数据结构（"我要什么"），本身不执行任何操作。

**Operator = CRD + 自定义 Controller**，通过 Reconcile 循环驱动运维逻辑：

```
Informer Watch CR 变更 → WorkQueue 去重 → Reconcile 调谐
  ├─ 读取 CR 期望状态
  ├─ 查看实际状态
  ├─ Diff 对比
  └─ 执行操作（创建 Pod、配置主从、迁移数据等）
```

**本质**：把人类 SRE 的运维经验编码成持续运行的控制器。

**典型案例**：Prometheus Operator（声明 ServiceMonitor 自动配置采集）、Cert-Manager（自动申请/续签证书）、Strimzi（管理 Kafka 集群）。

**与 Helm 的区别**：Helm 是"安装时"的打包工具，装完就走；Operator 是"运行时"的管家，装完还持续管理全生命周期。

**开发框架**：主流选择 **Kubebuilder**（Go，官方推荐），也有 Operator SDK（Go/Ansible/Helm）、Kopf（Python）等。

</details>

---

### 16. Operator 的调谐循环是主动轮询还是被动监听？

<details>
<summary>查看回答</summary>

**以 Watch 被动触发为主，Resync 主动兜底为辅。**

**被动：Watch 事件驱动**（主要驱动力）

Informer 通过 HTTP 长连接（`?watch=true` + 分块传输）监听 API Server，有变更才推送事件，没事件零开销。注意这不是 API Server 反向调用你的服务——是你主动建连后不断开，API Server 在同一个连接上追加事件数据。所谓"回调"是进程内部的函数调用，不是网络请求。

```
你的服务 ──HTTP 长连接──→ API Server
         ←─事件流推送──  （同一个连接）
```

**主动兜底一：Resync 定时重同步**

定时把本地缓存中的所有对象重新放入 WorkQueue 强制 Reconcile，防止事件丢失或外部状态漂移。只遍历本地缓存，不请求 API Server，开销极小。

**主动兜底二：RequeueAfter**

Reconcile 函数返回 `RequeueAfter`，主动调度下一次执行。用于等待外部系统（云 RDS、DNS 生效等无 Watch 接口的场景）或失败重试。

**为什么长连接不会让 API Server 溢出？**
- 空闲连接资源极小（1 个 fd ≈ 几百字节），千级连接仅几十 MB。
- API Server 内置 Watch 超时（5-10 分钟随机断开），客户端用 `resourceVersion` 自动续接不丢事件。
- 有 Watch Cache、背压机制、Priority & Fairness 等多层防护。
- 反而轮询每次都要 TCP + TLS 握手 + etcd 查询，大规模下持续 QPS 压力远超长连接。

**对比轮询**：轮询是"每 5 秒打电话问有没有消息"，Watch 是"打一个电话不挂，有消息直接说"。线程没有结束，只是从"忙等"变成"阻塞等待"——挂起不占 CPU，有事件才被操作系统唤醒。

</details>

---

### 17. HTTP 长连接与短连接的区别和适用场景？

<details>
<summary>查看回答</summary>

"长连接"在面试中容易混淆，需要区分两个层面：

**层面一：TCP 连接复用（Keep-Alive）**——一个 TCP 连接上发多个 HTTP 请求，省掉重复握手。HTTP/1.1 默认开启。

**层面二：应用层持久连接**——连接长期不断开，服务端可以主动推数据。WebSocket、SSE、HTTP Chunked 都属于这类。

| 类型 | 连接生命周期 | 数据方向 | 典型场景 |
|---|---|---|---|
| **短连接** | 一次请求即断 | 请求-响应 | 低频 API、CDN、IoT 设备稀疏上报 |
| **Keep-Alive** | 多次请求复用 | 请求-响应 | 浏览器加载页面、微服务间通信、连接池 |
| **SSE** | 长期持有 | 服务端→客户端（单向） | AI Chat 流式输出、通知推送 |
| **WebSocket** | 长期持有 | 双向 | 即时通讯、在线游戏、实时协作 |
| **HTTP Chunked** | 长期持有 | 服务端→客户端 | K8s Watch |

**AI Chat（ChatGPT / Claude）用的是 SSE**。交互模式是"用户 POST 一个问题，模型逐 token 流式返回"，本质是单向推送，SSE 刚好够用。没有选 WebSocket 是因为：无状态架构更好扩展、POST 请求更好做负载均衡和重试、对 CDN / 网关天然兼容、AI 对话没有真正的双向实时需求。

**K8s Watch 用的是 HTTP 分块传输**（Chunked Transfer），思路类似 SSE 但更底层——客户端发一个带 `?watch=true` 的 GET 请求，服务端不关闭响应，在同一个连接上持续追加事件 JSON。

**面试建议回答**：短连接适合低频无状态场景；Keep-Alive 适合高频请求复用 TCP；SSE 和 WebSocket 是真正的持久连接，区别在于 SSE 单向推送、基于标准 HTTP，WebSocket 全双工、独立协议。AI Chat 选 SSE 因为交互模式是单向流式输出，比 WebSocket 更简单、对基础设施更友好。K8s Watch 用 HTTP Chunked，原理类似。

</details>

---

### 18. AI Chat 每次提问都要建立新连接吗？

<details>
<summary>查看回答</summary>

**每次提问是一个新的 SSE 流（新的 HTTP 请求），但底层 TCP 连接通过 Keep-Alive 复用，不需要重新握手。**

```
打开网页 → TCP + TLS 建连（一次）
  │
  ├─ 第 1 个问题：POST → 新 SSE 流 → 逐 token → [DONE] → 流结束，TCP 保持
  ├─ 第 2 个问题：POST → 新 SSE 流（复用 TCP）→ [DONE]
  ├─ 长时间不操作 → TCP 空闲超时断开（60-120s）
  ├─ 第 3 个问题 → 自动重新建连（浏览器透明处理）
  └─ 关闭网页 → TCP 断开
```

**为什么不在对话开始时建一个 SSE 流复用到底？** 因为 SSE 是单向的（服务端→客户端），客户端无法在 SSE 流上发送新问题。每次 POST 一个问题 + SSE 返回对应回答，请求-响应天然一一对应，更简单清晰。

**为什么不用 WebSocket 维持一个长连接？** WebSocket 能做到一个连接贯穿整个对话，但 AI Chat 厂商普遍不这么选：无状态 POST 更好做负载均衡（不需要 sticky session）；AI 推理耗时长（30 秒+），长时间占着 WebSocket 连接增加服务端压力；失败重试更简单（POST 重发即可）；用户提问频率极低（几十秒一次），不值得维护全双工通道。

**面试建议回答**：每次提问会新建一个 SSE 流（一个 HTTP 请求-响应对），但底层 TCP 连接通过 Keep-Alive 复用，用户完全无感知。没有选 WebSocket 全程保持一个连接，是因为每次独立 POST 的无状态模式更简单、更好扩展、更易重试，而 AI 对话也没有真正的双向实时通信需求。

</details>

---

### 19. Admission Controller 的使用场景？

<details>
<summary>查看回答</summary>

**定位**：在认证（Authentication）和鉴权（Authorization）之后、写入 etcd 之前拦截请求，是资源的"门卫"。

**两种类型**（先 Mutate 后 Validate）：

| 类型 | 能做什么 | 执行顺序 |
|---|---|---|
| **Mutating Webhook** | 修改请求内容 + 拒绝 | 先执行 |
| **Validating Webhook** | 只能拒绝或放行 | 后执行 |

**核心使用场景**：

| 场景 | 说明 | 类型 |
|---|---|---|
| **Sidecar 自动注入** | Istio 自动注入 envoy proxy，业务团队无感知 | Mutating |
| **安全策略强制执行** | 禁止特权容器、禁止 root 运行、限制镜像来源（OPA Gatekeeper / Kyverno） | Validating |
| **资源默认值填充** | 自动补充 requests/limits，防止 Pod 不受限抢占资源 | Mutating |
| **标签注解注入** | 自动添加 team、cost-center 标签，用于多租户成本追踪 | Mutating |
| **镜像策略管控** | 强制镜像签名验证、自动替换为内部 mirror、禁止 latest 标签 | Validating / Mutating |
| **命名空间约束** | 强制最少副本数、限制单 Pod 最大资源、禁止在 kube-system 部署业务 | Validating |

**与 Operator 的核心区别**：

| 对比项 | Admission Controller | Operator |
|---|---|---|
| 触发时机 | 资源写入 etcd **之前** | 资源写入 etcd **之后** |
| 能做什么 | 修改或拒绝当前请求 | 创建/更新/删除其他资源 |
| 通信方式 | Webhook（API Server → 你） | Watch（你 → API Server） |
| 角色比喻 | 门卫——进门前检查和改写 | 管家——进门后持续管理 |

**面试建议回答**：Admission Controller 在认证鉴权之后、写入 etcd 之前拦截请求，分为 Mutating（可修改）和 Validating（只校验）两类，先 Mutate 后 Validate。核心场景包括 Sidecar 自动注入（如 Istio）、安全策略强制执行（禁止特权容器、限制镜像来源）、资源默认值填充（自动补 requests/limits）、标签注入（多租户成本追踪）等。和 Operator 的区别是：Admission Controller 是门卫，资源进门前检查改写；Operator 是管家，资源进门后持续管理。

</details>

---

### 20. kubectl apply 之后发生了什么？

<details>
<summary>查看回答</summary>

整条链路由 6 个组件通过 Watch 机制接力完成，没有中心调度者：

```
kubectl → API Server → Controller Manager → Scheduler → kubelet → kube-proxy
```

| 步骤 | 组件 | 做了什么 |
|---|---|---|
| 1 | **kubectl** | 解析 YAML，构建 HTTP 请求发送到 API Server |
| 2 | **API Server** | 认证 → 鉴权 → Admission Controller（校验/改写）→ 写入 etcd |
| 3 | **Controller Manager** | Deployment Controller Watch 到新资源 → 创建 ReplicaSet → 创建 Pod |
| 4 | **Scheduler** | Watch 到未调度的 Pod → Predicate 过滤 → Priority 打分 → 绑定节点 |
| 5 | **kubelet** | Watch 到分配到本节点的 Pod → 拉镜像 → 创建容器 → 启动探针 → 上报状态 |
| 6 | **kube-proxy** | Watch 到 Endpoints 变化 → 更新 iptables/IPVS 规则 → Pod 可接收流量 |

**面试建议回答**：kubectl 把 YAML 发送到 API Server，经过认证、鉴权、Admission Controller 后写入 etcd。之后各组件通过 Watch 接力：Deployment Controller 创建 ReplicaSet 再创建 Pod；Scheduler 把 Pod 绑定到合适的节点；kubelet 拉镜像、启容器、跑健康检查；最后 kube-proxy 更新转发规则让 Pod 可接收流量。整条链路没有中心调度者，全靠声明式事件驱动协作。

</details>

---

## 存储高频面试题

### 21. PV、PVC、StorageClass 三者的关系？

<details>
<summary>查看回答</summary>

三者是 K8s 存储体系的核心抽象，分别对应供给、消费、自动化三层：

| 概念 | 角色 | 类比 |
|---|---|---|
| **PV（PersistentVolume）** | 集群级存储资源实体 | 一块硬盘 |
| **PVC（PersistentVolumeClaim）** | Pod 对存储的声明 | 申请单："我要 10Gi、ReadWriteOnce" |
| **StorageClass** | 定义存储供应商和参数 | 硬盘品牌目录（SSD / HDD / 云盘类型） |

**绑定流程**：

```
Pod 引用 PVC → PVC 声明需求（大小、访问模式）
  ├─ 静态供给：管理员预先创建 PV，PVC 自动匹配绑定
  └─ 动态供给：PVC 指定 StorageClass → SC 自动调用 Provisioner 创建 PV → 绑定
```

**面试建议回答**：PV 是实际的存储资源，PVC 是 Pod 对存储的声明，StorageClass 实现动态供给——PVC 指定 SC 后，Provisioner 自动创建 PV 并绑定，用户不需要手动管理存储资源。生产环境几乎都用动态供给。

</details>

---

### 22. PV 的访问模式和回收策略有哪些？

<details>
<summary>查看回答</summary>

**访问模式（AccessModes）**：

| 模式 | 简写 | 含义 | 典型存储 |
|---|---|---|---|
| ReadWriteOnce | RWO | 单节点读写 | AWS EBS、Azure Disk |
| ReadOnlyMany | ROX | 多节点只读 | NFS、CephFS |
| ReadWriteMany | RWX | 多节点读写 | NFS、CephFS、Azure Files |
| ReadWriteOncePod | RWOP | 单 Pod 独占读写（1.27+） | CSI 驱动支持 |

**回收策略（reclaimPolicy）**：

| 策略 | PVC 删除后 PV 的行为 | 场景 |
|---|---|---|
| **Retain** | PV 保留，数据不删，需手动清理 | 生产环境重要数据 |
| **Delete** | PV 和底层存储一起删除 | 临时/可重建的数据 |
| Recycle | 清空数据后复用（已弃用） | — |

**面试建议回答**：访问模式决定存储能被多少节点/Pod 同时挂载——RWO 单节点读写（块存储）、RWX 多节点读写（文件存储）。回收策略决定 PVC 删除后数据命运——Retain 保留需手动清理，Delete 自动删除。生产环境重要数据用 Retain，临时数据用 Delete。

</details>

---

### 23. CSI 是什么？为什么需要它？

<details>
<summary>查看回答</summary>

**CSI（Container Storage Interface）** 是容器存储的标准化插件接口。

**为什么需要**：早期存储驱动（in-tree）直接编译在 K8s 核心代码中，新增或更新存储驱动必须跟随 K8s 版本发布，耦合严重。CSI 将存储实现从 K8s 核心解耦为独立的外部插件。

**架构**：

```
kubelet ──gRPC──→ CSI Driver（独立 Pod 部署）──→ 底层存储（EBS / Ceph / NFS）
```

CSI Driver 以 DaemonSet + Deployment 形式部署在集群中，通过 gRPC 接口实现 CreateVolume / DeleteVolume / NodePublish 等操作。

**面试建议回答**：CSI 是容器存储的标准化接口，把存储驱动从 K8s 核心代码解耦为独立插件，存储厂商可以独立开发、发布和升级驱动，不用等 K8s 版本迭代。目前主流云存储（EBS、Azure Disk、Ceph）都通过 CSI 接入。

</details>

---

### 24. emptyDir、hostPath、PVC 分别适用什么场景？

<details>
<summary>查看回答</summary>

| 卷类型 | 生命周期 | 数据持久性 | 典型场景 |
|---|---|---|---|
| **emptyDir** | 随 Pod 销毁 | 不持久 | 同一 Pod 内多容器共享临时数据、缓存 |
| **hostPath** | 随节点存在 | 节点级持久 | 访问节点文件系统（日志采集、Docker socket） |
| **PVC** | 独立于 Pod | 持久 | 数据库、有状态应用、需跨 Pod 迁移的数据 |

**注意事项**：
- emptyDir 可指定 `medium: Memory` 使用内存做临时存储（tmpfs），速度快但占内存配额
- hostPath 有安全风险（容器可访问宿主机文件），生产环境慎用
- StatefulSet 使用 `volumeClaimTemplates` 为每个 Pod 自动创建独立 PVC

**面试建议回答**：emptyDir 是 Pod 级别的临时存储，Pod 删了数据就没了，适合缓存和容器间共享；hostPath 挂载节点目录，有安全风险，一般只给 DaemonSet（日志采集）用；PVC 才是真正的持久化存储，数据独立于 Pod 生命周期，数据库等有状态应用必须用 PVC。

</details>

---

### 25. StatefulSet 的存储和 Deployment 有什么区别？

<details>
<summary>查看回答</summary>

| 对比项 | Deployment | StatefulSet |
|---|---|---|
| PVC 方式 | 所有 Pod 共享同一个 PVC | 每个 Pod 有独立 PVC（volumeClaimTemplates） |
| Pod 名称 | 随机后缀（app-5d8f7b）| 有序固定（app-0, app-1, app-2） |
| 存储绑定 | Pod 重建后可能挂到不同 PV | Pod 重建后仍绑定原来的 PV |
| 删除行为 | 缩容时 PVC 不自动删除 | 缩容时 PVC 默认保留（防数据丢失） |

```yaml
# StatefulSet 的 volumeClaimTemplates
volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: ssd
      resources:
        requests:
          storage: 10Gi
# 自动为每个 Pod 创建 data-app-0、data-app-1、data-app-2
```

**面试建议回答**：Deployment 的 Pod 共享 PVC，适合无状态应用；StatefulSet 通过 volumeClaimTemplates 为每个 Pod 创建独立 PVC，Pod 名称有序固定，重建后仍绑定原来的 PV，保证有状态应用（数据库、消息队列）的数据不丢失。缩容时 PVC 默认保留，防止数据意外删除。

</details>

---

## 网络高频面试题

### 26. K8s 四层网络模型分别解决什么问题？

<details>
<summary>查看回答</summary>

| 层级 | 通信场景 | 实现方式 |
|---|---|---|
| **容器间** | 同一 Pod 内容器通信 | 共享 Network Namespace，通过 localhost |
| **Pod 间** | 不同 Pod 之间通信 | CNI 插件实现，每个 Pod 独立 IP，直接可达无 NAT |
| **Pod ↔ Service** | Pod 访问 Service | kube-proxy 通过 iptables / IPVS 做负载均衡 |
| **外部 ↔ 集群** | 集群外访问集群内服务 | NodePort / LoadBalancer / Ingress |

**面试建议回答**：K8s 网络分四层——容器间通过共享 Network Namespace 用 localhost 通信；Pod 间由 CNI 插件保证每个 Pod 有独立 IP 且直接可达；Pod 到 Service 由 kube-proxy 通过 iptables/IPVS 实现负载均衡；外部访问通过 NodePort、LoadBalancer 或 Ingress 进入集群。

</details>

---

### 27. CNI 插件有哪些，各有什么特点？

<details>
<summary>查看回答</summary>

| CNI 插件 | 网络模式 | 特点 | 适用场景 |
|---|---|---|---|
| **Flannel** | Overlay（VXLAN） | 简单易用，功能少 | 小集群、学习环境 |
| **Calico** | BGP 路由 / Overlay | 支持 NetworkPolicy，性能好 | 大规模生产集群 |
| **Cilium** | eBPF | 性能极优，原生 L7 策略、可观测性 | 高性能、安全要求高的场景 |
| **Azure CNI** | 直接分配 VNet IP | Pod 与 Node 同网段，性能好 | Azure AKS |
| **AWS VPC CNI** | 直接分配 ENI IP | Pod 使用 VPC 原生 IP | AWS EKS |

**Overlay vs 路由模式**：
- **Overlay**（VXLAN）：Pod 网段独立，封装隧道通信，跨节点有少量性能损耗，但不依赖底层网络配置
- **路由模式**（BGP）：Pod IP 直接路由可达，性能好，但需要底层网络支持 BGP

**面试建议回答**：主流 CNI 包括 Flannel（简单 Overlay）、Calico（BGP 路由 + NetworkPolicy）、Cilium（eBPF 高性能）和云厂商原生方案（Azure CNI / AWS VPC CNI）。选型看场景——小集群用 Flannel，生产用 Calico 或 Cilium，云上用厂商原生 CNI 以获得最佳网络性能。

</details>

---

### 28. NetworkPolicy 怎么实现 Pod 级别的网络隔离？

<details>
<summary>查看回答</summary>

NetworkPolicy 通过 Label Selector 控制 Pod 的 ingress（入站）和 egress（出站）流量，是 K8s 实现零信任网络的基础。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy
spec:
  podSelector:
    matchLabels:
      app: mysql            # 对哪些 Pod 生效
  policyTypes: ["Ingress"]
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: backend   # 只允许 backend Pod 访问
      ports:
        - port: 3306
```

**关键规则**：
- 默认无 NetworkPolicy 时，所有 Pod 互通
- 一旦对某 Pod 应用了 NetworkPolicy，未明确允许的流量全部拒绝（白名单模式）
- NetworkPolicy 由 CNI 插件执行（Flannel 不支持，Calico / Cilium 支持）

**面试建议回答**：NetworkPolicy 通过 Label Selector 选中目标 Pod，用白名单模式控制 ingress/egress 流量——一旦应用，未明确允许的流量全部拒绝。需要注意 CNI 插件必须支持（Calico、Cilium 支持，Flannel 不支持）。典型场景是数据库只允许后端 Pod 访问、禁止跨 Namespace 通信等。

</details>

---

### 29. iptables 和 IPVS 模式有什么区别？

<details>
<summary>查看回答</summary>

kube-proxy 通过 iptables 或 IPVS 实现 Service 到 Pod 的流量转发：

| 对比项 | iptables | IPVS |
|---|---|---|
| 数据结构 | 链式规则，线性匹配 | 哈希表，O(1) 查找 |
| 性能 | Service 数量多时性能下降明显 | 大规模下性能稳定 |
| 负载均衡算法 | 随机（probability） | rr / lc / wrr / sh 等多种 |
| 规则更新 | 全量刷新 iptables 规则 | 增量更新 |
| 适用规模 | < 1000 Service | 1000+ Service |
| 连接追踪 | conntrack | conntrack |

**性能拐点**：当 Service 数量超过 1000 时，iptables 的线性匹配和全量刷新会导致明显的延迟和 CPU 消耗，建议切换到 IPVS。

**面试建议回答**：iptables 用链式规则线性匹配，小规模够用但 Service 多了性能下降；IPVS 用哈希表 O(1) 查找，支持多种负载均衡算法，增量更新规则，适合大规模集群。一般 1000 个 Service 以上建议切换到 IPVS 模式。

</details>

---

### 30. DNS 在 K8s 中是怎么工作的？

<details>
<summary>查看回答</summary>

K8s 通过 CoreDNS 提供集群内 DNS 服务，每个 Service 和 Pod 都有可解析的 DNS 名称：

**DNS 记录格式**：

| 资源 | DNS 格式 | 示例 |
|---|---|---|
| Service | `<svc>.<ns>.svc.cluster.local` | `mysql.default.svc.cluster.local` |
| Headless Service 下的 Pod | `<pod-name>.<svc>.<ns>.svc.cluster.local` | `mysql-0.mysql.default.svc.cluster.local` |
| Pod | `<pod-ip-dashed>.<ns>.pod.cluster.local` | `10-244-1-5.default.pod.cluster.local` |

**解析流程**：

```
Pod 内进程 → /etc/resolv.conf 指向 CoreDNS → CoreDNS 查询 API Server → 返回 IP
```

**Headless Service 的特殊性**：普通 Service 解析返回 ClusterIP（虚拟 IP），Headless Service 解析直接返回所有 Pod IP 列表，这是 StatefulSet 实现稳定网络标识的基础。

**面试建议回答**：K8s 通过 CoreDNS 提供集群内服务发现，每个 Service 自动注册 DNS 记录（`svc.namespace.svc.cluster.local`）。Pod 的 /etc/resolv.conf 指向 CoreDNS，应用直接用 Service 名称访问。Headless Service 比较特殊，DNS 直接返回 Pod IP 列表而非虚拟 IP，是 StatefulSet 稳定网络标识的基础。

</details>

---

## 调度高频面试题

### 31. Scheduler 的调度流程是什么？

<details>
<summary>查看回答</summary>

Scheduler Watch 到未绑定节点的 Pod（`spec.nodeName` 为空），执行两阶段调度：

```
待调度 Pod → Predicate（过滤）→ Priority（打分）→ Bind（绑定）
```

| 阶段 | 作用 | 典型检查项 |
|---|---|---|
| **Predicate（过滤）** | 排除不满足条件的节点 | 资源是否充足、端口是否冲突、nodeSelector 是否匹配、Taint 是否能 Tolerate |
| **Priority（打分）** | 给候选节点打分排序 | 资源均衡度（LeastRequested）、Pod 亲和性、拓扑分布均匀度 |
| **Bind（绑定）** | 把 Pod 绑定到最高分节点 | 更新 Pod 的 `spec.nodeName`，写入 etcd |

**面试建议回答**：Scheduler 分两阶段——Predicate 过滤掉不满足条件的节点（资源不足、Taint 不匹配等），Priority 对剩余节点打分排序（资源均衡度、亲和性等），最终选最高分节点绑定 Pod。整个过程是 Watch 驱动的，Pod 创建后自动触发。

</details>

---

### 32. nodeSelector、nodeAffinity、Taint/Toleration 的区别？

<details>
<summary>查看回答</summary>

三者都是调度约束，但维度和表达力不同：

| 机制 | 方向 | 表达力 | 场景 |
|---|---|---|---|
| **nodeSelector** | Pod → 选节点 | 简单键值匹配 | "只调度到 SSD 节点" |
| **nodeAffinity** | Pod → 选节点 | 支持 In/NotIn/Exists/Gt/Lt，软硬两种 | "优先 GPU 节点，没有也行" |
| **Taint/Toleration** | 节点 → 排斥 Pod | 节点打 Taint 排斥，Pod 声明 Toleration 才能上 | "GPU 节点只给 AI 任务用" |

**关键区别**：
- nodeSelector / nodeAffinity 是 **Pod 主动选节点**（"我要去哪"）
- Taint/Toleration 是 **节点排斥 Pod**（"谁不能来"）
- nodeAffinity 有 `preferredDuringScheduling`（软约束）和 `requiredDuringScheduling`（硬约束）

**面试建议回答**：三者方向不同——nodeSelector 和 nodeAffinity 是 Pod 主动选节点（"我要去哪"），Taint/Toleration 是节点排斥 Pod（"谁不能来"）。nodeSelector 最简单，只支持精确匹配；nodeAffinity 更灵活，支持软硬约束；Taint/Toleration 用于专属资源隔离，比如 GPU 节点只给 AI 任务用。

</details>

---

### 33. PodAffinity 和 PodAntiAffinity 怎么用？

<details>
<summary>查看回答</summary>

控制 Pod 之间的亲和和反亲和关系，基于拓扑域（节点/可用区）生效：

| 类型 | 含义 | 场景 |
|---|---|---|
| **PodAffinity** | 和某些 Pod 调度到同一拓扑域 | 前端和后端就近部署降低延迟 |
| **PodAntiAffinity** | 和某些 Pod 分散到不同拓扑域 | 同一 Deployment 的 Pod 跨 AZ 打散保高可用 |

```yaml
# 高可用：同一应用的 Pod 不要放在同一个节点
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: web
        topologyKey: kubernetes.io/hostname    # 按节点打散
```

**topologyKey** 决定打散粒度：`kubernetes.io/hostname`（节点级）、`topology.kubernetes.io/zone`（可用区级）。

**面试建议回答**：PodAffinity 让 Pod 就近部署（降低延迟），PodAntiAffinity 让 Pod 分散部署（保高可用）。通过 topologyKey 控制打散粒度——按节点打散防止单节点故障，按可用区打散防止整个 AZ 故障。生产环境中反亲和用得更多，确保同一服务的副本分布在不同故障域。

</details>

---

### 34. TopologySpreadConstraints 和 PodAntiAffinity 有什么区别？

<details>
<summary>查看回答</summary>

两者都能实现 Pod 打散，但策略不同：

| 对比项 | PodAntiAffinity | TopologySpreadConstraints |
|---|---|---|
| 策略 | 互斥——同一拓扑域不能有同类 Pod | 均衡——各拓扑域的 Pod 数差值不超过 maxSkew |
| 效果 | 3 个 AZ、3 个 Pod → 每 AZ 最多 1 个 | 3 个 AZ、5 个 Pod → 2:2:1 均匀分布 |
| 副本数 > 拓扑域数 | Pod 会 Pending（无处可调度） | 允许，按比例均匀分布 |
| 灵活度 | 粗粒度，只有"不能共存" | 细粒度，可控制最大偏差值 |

```yaml
topologySpreadConstraints:
  - maxSkew: 1                              # 各 AZ 最多差 1 个
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: web
```

**面试建议回答**：PodAntiAffinity 是"互斥"策略——同一拓扑域不能有同类 Pod，副本数超过拓扑域数量时 Pod 会 Pending。TopologySpreadConstraints 是"均衡"策略——通过 maxSkew 控制各拓扑域的 Pod 数差值，允许副本数超过拓扑域数量并均匀分布。生产中推荐用 TopologySpreadConstraints，更灵活实用。

</details>

---

### 35. 如何实现 Pod 优先级和抢占调度？

<details>
<summary>查看回答</summary>

通过 **PriorityClass** 定义优先级，资源不足时高优先级 Pod 可以抢占低优先级 Pod：

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: critical
value: 1000000           # 值越大优先级越高
globalDefault: false
preemptionPolicy: PreemptLowerPriority
description: "关键业务 Pod"
```

**抢占流程**：

```
高优 Pod 无法调度 → Scheduler 尝试抢占
  → 找到一个节点，驱逐其上低优 Pod 后能放下高优 Pod
  → 驱逐低优 Pod（优雅终止）
  → 高优 Pod 调度到该节点
```

**注意事项**：
- 系统组件默认使用 `system-cluster-critical` 和 `system-node-critical`（最高优先级）
- 抢占会尊重 PodDisruptionBudget（PDB），不会导致服务完全不可用
- 不建议滥用，应该配合 ResourceQuota 做好配额管理

**面试建议回答**：通过 PriorityClass 定义优先级（value 越大越高），资源不足时 Scheduler 会驱逐低优先级 Pod 为高优先级 Pod 腾出空间。抢占过程会尊重 PDB 保证服务可用性。典型用法是给核心业务设高优先级，batch 任务设低优先级，资源紧张时优先保障核心业务。

</details>

---

## 最值得主打的 K8s 面试亮点

1. **AKS + ACI 混合架构决策**：体现对容器编排平台选型的深度思考，不是"会用 K8s"而是"知道何时不用 K8s"。
2. **控制面 / 数据面拆分设计**：对应 K8s 架构理念，能从原理讲到工程落地。
3. **容器网络与 ENI 底层能力**：从 CNI 讲到 VNet IP 分配，展示对网络栈的理解深度。
4. **Autoscale 全链路延迟优化**：HPA 的升级版，从指标采集到节点就绪的端到端治理。
5. **容器环境稳定性治理**：On-call + 可观测性 + 诊断闭环，不是只会 `kubectl get pods`。

## 使用建议

- 先讲**核心概念**建立技术广度印象，再结合**项目实战**展示深度。
- 每个问题的回答遵循：**背景 → 难点 → 方案 → 结果 → 复盘** 结构。
- 面试中可以主动引导到"我在实际项目中遇到过类似的场景"，自然切入项目经验。
