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

### 4. 如何排查 Pod 一直处于 Pending 状态？

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

### 5. etcd 在 K8s 中的角色和运维要点？

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

### 6. K8s 网络模型的核心要求是什么？

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

### 7. RBAC 权限模型怎么理解？

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

### 8. HPA 的工作原理和调优经验？

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

### 9. 如何设计容器化应用的健康检查？

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

### 10. Helm 和 Kustomize 各自的适用场景？

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
