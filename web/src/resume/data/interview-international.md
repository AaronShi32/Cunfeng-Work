# 数据产品出海 — 业界分析与技术背景

> 📅 更新时间：2026年6月 | 作者：石存沣 | 用途：面试准备 & 行业认知

---

## 目录

1. [Azure HDInsight — 我在做的产品](#一azure-hdinsight--我在做的产品)
2. [Microsoft Fabric — 微软的战略方向](#二microsoft-fabric--微软的战略方向)
3. [竞品全景：Databricks / Snowflake / 云厂商](#三竞品全景)
4. [数据产品出海：技术挑战与架构模式](#四数据产品出海技术挑战与架构模式)
5. [中国数据产品出海现状](#五中国数据产品出海现状)
6. [我的经验映射](#六我的经验映射)

---

## 一、Azure HDInsight — 我在做的产品

### 1.1 产品定位

HDInsight 是 Azure 的 **托管大数据开源分析服务**，对标业界 **Amazon EMR / Google Dataproc**。本质是"云上的 Hadoop/Spark 集群托管"。

```
┌─────────────────────────────────────────────────────────┐
│                  Azure HDInsight 集群类型                 │
├──────────────┬──────────────────┬───────────────────────┤
│ Apache Spark │ Apache Kafka     │ Apache HBase          │
│ 批处理/ML    │ 流数据管道        │ 大规模 NoSQL          │
├──────────────┼──────────────────┼───────────────────────┤
│ Hive LLAP    │ Apache Hadoop    │                       │
│ 交互式 SQL   │ 传统批处理        │                       │
└──────────────┴──────────────────┴───────────────────────┘
          ↓ 底层基建：Azure VMs / AKS+ACI (已退役)
```

### 1.2 版本状态（2026年6月）

| 版本 | 状态 | 关键信息 |
|------|------|---------|
| HDInsight 5.1 | ✅ 唯一存活 | Spark 3.3.1, Kafka 3.2, Hadoop 3.3.4 |
| HDInsight 5.0 / 4.0 | ❌ 2025.3.31 退役 | 不再支持 |
| **HDInsight on AKS** | ❌ 2025.1.31 退役 | **我做的产品，从未达到 GA** |

> ⚠️ **关键叙事**：HDInsight on AKS 退役 = 微软放弃用 K8s 现代化 HDInsight，全面转向 Fabric。我做的容器管控平台是这个产品的核心基建，虽然产品退役了，但积累的多 Region 部署、控制面设计经验是通用的。

### 1.3 HDInsight on AKS 架构（我做的部分）

```
┌─────────────────────────────────────────────────────────┐
│                HDInsight on AKS 架构                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Cluster Pool (集群池)                │    │
│  │         映射到一个 AKS 集群 + 共享 VNet           │    │
│  │                                                   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │    │
│  │  │ Spark    │ │ Flink    │ │ Trino    │         │    │
│  │  │ Cluster  │ │ Cluster  │ │ Cluster  │         │    │
│  │  │(namespace)│ │(namespace)│ │(namespace)│        │    │
│  │  └──────────┘ └──────────┘ └──────────┘         │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  特点：容器化部署 · 快速创建 · 命名空间隔离              │
│  支持：Spark 3.4 / Flink 1.17 / Trino 440              │
└─────────────────────────────────────────────────────────┘
```

### 1.4 与竞品对比

| 维度 | HDInsight 5.1 | Amazon EMR | Dataproc | Databricks |
|------|--------------|------------|----------|------------|
| 架构 | VM 集群 | VM + Serverless + EKS | VM + Serverless | 统一 Lakehouse |
| Spark 版本 | 3.3.1 ⚠️ | 3.4.1 | 3.5.x | 优化 Runtime + Photon |
| Serverless | ❌ | ✅ | ✅ | ✅ |
| K8s 部署 | ❌ (退役) | ✅ EMR on EKS | ✅ GKE 原生 | ✅ |
| 集群创建速度 | ~15-20 分钟 | ~5-10 分钟 | **~90 秒** | 秒级 (Serverless) |
| 计费粒度 | 按分钟 | **按秒** | **按秒** | DBU 按需 |
| 原生 Kafka | ✅ 独立集群类型 | ❌ (用 MSK) | ❌ | ❌ |
| 战略走向 | 📉 维护模式 | 稳定 | 稳定 | 📈 最活跃 |

---

## 二、Microsoft Fabric — 微软的战略方向

### 2.1 一句话定位

> **Fabric = 微软的"统一 SaaS 分析平台"**，把数据集成、数据工程、数据仓库、实时分析、BI、数据科学合并为一个产品，底座是统一数据湖 OneLake。

### 2.2 时间线

| 时间 | 事件 |
|------|------|
| 2023.05 Build | 公开发布，进入 Public Preview |
| 2023.11 Ignite | **正式 GA** |
| 2024.11 Ignite | SQL Database in Fabric、Mirroring 扩展、Synapse 退役公告 |
| 2025.05 Build | Fabric IQ (ontology)、Data Agent GA、Runtime 2.0 (Spark 4.0) Preview |
| 2025.11 | Fabric SQL Database GA、AI Functions GA、Cosmos DB 集成 GA |
| 2026.06 | Fabric Graph GA、Data Agent 进入 M365 Copilot、OneLake 安全角色 GA |

### 2.3 核心架构

```
┌────────────────────────────────────────────────────────────────┐
│                      Microsoft Fabric                          │
│                                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐   │
│  │  Data     │ │  Data    │ │  Data    │ │  Real-Time     │   │
│  │ Factory   │ │ Engineer │ │Warehouse │ │  Intelligence  │   │
│  │ 170+连接器│ │ Spark    │ │ T-SQL    │ │  KQL/Kusto     │   │
│  │ ETL/ELT  │ │ Notebook │ │ ACID事务 │ │  Eventstream   │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬─────────┘   │
│       │            │             │               │             │
│  ┌────┴────┐ ┌─────┴────┐ ┌─────┴─────┐ ┌──────┴──────┐     │
│  │  Data   │ │ Power BI │ │ Databases │ │ Fabric IQ   │     │
│  │ Science │ │ Direct   │ │ SQL DB    │ │ Ontology    │     │
│  │ MLflow  │ │  Lake    │ │ OLTP      │ │ Data Agent  │     │
│  │ AI Func │ │  Mode    │ │ 自动Mirror│ │ Graph       │     │
│  └────┬────┘ └─────┬────┘ └─────┬─────┘ └──────┬──────┘     │
│       │            │             │               │             │
│  ═════╧════════════╧═════════════╧═══════════════╧═══════════  │
│                     OneLake 统一数据湖                          │
│           Delta Parquet · Shortcuts · Iceberg 互操作            │
│                     Purview 治理 · 行列级安全                   │
└────────────────────────────────────────────────────────────────┘
```

### 2.4 Fabric 对标竞品映射（面试必背）

| Fabric 组件 | Databricks | Snowflake | AWS | 阿里云 |
|-------------|-----------|-----------|-----|--------|
| **OneLake** | Unity Catalog + Delta Lake | 内部存储 | S3 + Lake Formation | OSS + 数据湖 |
| **Data Factory** | Workflows | Snowpipe | Glue + Step Functions | DataWorks |
| **Data Engineering** | Notebooks / Jobs | Snowpark | EMR / Glue Spark | E-MapReduce |
| **Data Warehouse** | SQL Warehouse + Photon | **Snowflake Core** ✨ | Redshift | MaxCompute |
| **Real-Time Intel** | Structured Streaming | Dynamic Tables | Kinesis + MSK | Flink + Hologres |
| **Power BI** | SQL Dashboards | Snowsight | QuickSight | Quick BI |
| **Data Science** | MLflow + Mosaic AI | Cortex AI | SageMaker | PAI |
| **Mirroring** | — | — | DMS | DTS |
| **Data Agent** | Genie | — | Q | — |

### 2.5 OneLake vs 传统数据湖

```
传统模式：                          OneLake 模式：

┌──────┐ ┌──────┐ ┌──────┐         ┌─────────────────────┐
│ADLS 1│ │ADLS 2│ │ADLS 3│         │     OneLake         │
│团队 A│ │团队 B│ │团队 C│         │  (一个组织一个湖)    │
└──┬───┘ └──┬───┘ └──┬───┘         │                     │
   │  ETL   │  ETL   │             │  Workspace A ─┐     │
   ▼  复制  ▼  复制  ▼             │  Workspace B ─┤     │
 数据孤岛 · 格式混杂                │  Workspace C ─┘     │
 各自治理 · 重复存储                │  统一 Delta Parquet  │
                                   │  Shortcuts 零拷贝    │
                                   └─────────────────────┘
```

| 维度 | 传统 ADLS/S3 | OneLake |
|------|-------------|---------|
| 数量 | 几十上百个 | **一个租户一个** |
| 格式 | CSV/JSON/Parquet 混杂 | **强制 Delta Parquet** |
| 引擎共享 | 每个引擎单独配 | Spark / T-SQL / KQL / AS 原生共享 |
| 跨云 | 需 ETL | **Shortcuts** 零拷贝引用 S3/GCS |
| 格式互操作 | 手动转换 | Delta ↔ Iceberg **元数据虚拟化** |
| 治理 | 各管各的 | Purview 统一 + 敏感标签 + RLS/CLS |

### 2.6 Mirroring（数据库镜像）

Fabric 的一个杀手级特性：**近实时复制外部数据库到 OneLake**，无需 ETL。

| 来源 | 状态 | 类型 |
|------|------|------|
| Azure SQL Database | GA | 数据库镜像 |
| Azure Cosmos DB | GA | 数据库镜像 |
| Snowflake | GA | 数据库镜像 |
| Oracle | GA | 数据库镜像 |
| SAP | GA | 数据库镜像 |
| SQL Server (含本地) | GA | 数据库镜像 |
| Azure Databricks | GA | **元数据镜像**（数据不动）|
| Google BigQuery | Preview | 数据库镜像 |
| MySQL | Preview | 数据库镜像 |
| **Open Mirroring** | GA | 任何来源通过 API |

### 2.7 定价模型

采用 **Capacity Units (CU)** 统一计费：

```
所有工作负载共享一个 CU 池：
  2 CU = 1 Spark VCore
  2 CU = 1 Data Warehouse Core
  8 CU = 1 Power BI v-core
```

| SKU | CU | 旧 P SKU | 约价格 (East US) |
|-----|-----|---------|-----------------|
| F2 | 2 | — | ~$0.36/hr |
| F64 | 64 | P1 | ~$11.52/hr |
| F256 | 256 | P3 | ~$46/hr |
| F1024 | 1024 | P5 | ~$184/hr |

> **F64 是分水岭**：≥F64 Free 用户可查看 Power BI 内容；Reserved 可省 30-60%。

### 2.8 Fabric 替代了谁

| 旧服务 | 退役时间 | Fabric 替代 |
|--------|---------|------------|
| Azure Synapse Analytics | **2027.3.31** | Data Warehouse + Engineering |
| Power BI Premium P SKU | **不再允许新购** | F SKU |
| HDInsight on AKS | 2025.1.31 | Data Engineering |
| Azure Data Factory | 仍存在但非战略重点 | Fabric Data Factory |

> 📊 **采用数据**：21,000+ 付费客户（截至 2024.11 Ignite），是微软历史上增长最快的产品之一。

---

## 三、竞品全景

### 3.1 Databricks

```
定位：统一 Lakehouse 平台（数据工程 + 数仓 + ML + AI）
估值：$134B（2025.12 Series L）
ARR ：$5.4B（2026.02），增速 >65% YoY
多云：AWS / Azure / GCP（17+ Region）
```

**核心架构**：Control Plane（Databricks 托管）+ Data Plane（客户云账号）

```
┌───────────────────────────────┐
│    Databricks Control Plane   │  ← Databricks 托管
│  Notebook · 集群管理 · Job 调度 │
│  REST API · Unity Catalog      │
└──────────┬────────────────────┘
           │ Secure Tunnel (HTTPS/443)
           │ 不走公网，走云骨干网
┌──────────▼────────────────────┐
│    Customer Data Plane        │  ← 客户自己的云账号
│  Spark 集群 · 存储 · VPC      │
│  数据不出客户账号              │
└───────────────────────────────┘
```

**关键产品**：
- **Unity Catalog**：跨 Workspace/Cloud 统一治理（类比 Fabric OneLake Catalog）
- **Delta Lake**：开源 Lakehouse 表格式（ACID、Time Travel、Schema Evolution）
- **Delta Sharing**：跨组织零拷贝数据共享（开放协议）
- **Mosaic AI**：端到端 AI/ML 平台（MLflow + 模型服务）
- **Photon**：C++ 向量化查询引擎，比开源 Spark 快 2-5x

### 3.2 Snowflake

```
定位：云原生数据仓库 + Data Cloud
收入：$4.68B（FY2026）
多云：AWS / Azure / GCP（60+ Region）
```

**三层架构**：

```
┌─────────────────────────────┐
│   Cloud Services Layer      │  ← 查询解析、优化、元数据、权限
│   （每个 Region 一套）        │
├─────────────────────────────┤
│   Compute Layer             │  ← Virtual Warehouses
│   （独立扩缩，互不影响）      │     按需启停，按秒计费
├─────────────────────────────┤
│   Storage Layer             │  ← Micro-partitions
│   （Region 内集中存储）       │     自动压缩、加密
└─────────────────────────────┘
```

**跨 Region 能力**：
- Replication Groups：跨 Region/Cloud 异步复制数据库
- Data Clean Rooms：隐私保护的跨组织数据协作
- Tri-Secret Secure：客户密钥 + Snowflake 密钥 = 复合主密钥

### 3.3 Databricks vs Snowflake vs Fabric 三方对比

| 维度 | Databricks | Snowflake | Microsoft Fabric |
|------|-----------|-----------|-----------------|
| **交付模式** | PaaS（客户云） | Multi-cloud SaaS | SaaS (Azure Only) |
| **核心优势** | 开源生态 + ML/AI | 数据共享 + 易用 | Power BI 用户基座 + 一体化 |
| **数据格式** | Delta Lake (开源) | 私有格式 + Iceberg | Delta Parquet |
| **多云** | ✅ 三朵云 | ✅ 三朵云 | ❌ Azure Only |
| **SQL 能力** | SQL Warehouse | **核心优势** ✨ | T-SQL (SQL Server 引擎) |
| **ML/AI** | **最强**（Mosaic AI） | Cortex AI（追赶中） | Copilot + AI Functions |
| **实时能力** | Structured Streaming | Dynamic Tables | **Eventhouse (KQL)** |
| **BI 集成** | 需第三方 | Snowsight（基础） | **Power BI (原生集成)** |
| **治理** | Unity Catalog | Horizon | Purview + OneLake Catalog |
| **定价** | DBU（按工作负载） | Credits（按计算时间） | CU（统一池） |
| **收入/规模** | $5.4B ARR | $4.68B 收入 | 21K+ 付费客户 |

### 3.4 云厂商大数据服务对比

| 维度 | AWS | Azure | GCP | 阿里云 |
|------|-----|-------|-----|--------|
| **托管 Hadoop/Spark** | EMR | HDInsight 📉 | Dataproc | E-MapReduce |
| **数仓** | Redshift | Synapse 📉 → Fabric | BigQuery | MaxCompute |
| **流处理** | Kinesis + MSK | Event Hubs + Fabric RTI | Pub/Sub + Dataflow | Flink 实时计算 |
| **数据集成** | Glue | ADF → Fabric DF | Dataflow | DataWorks |
| **数据湖** | S3 + Lake Formation | OneLake | Cloud Storage + BigLake | OSS + 数据湖 |
| **ML** | SageMaker | Fabric DS + Azure AI | Vertex AI | PAI |
| **BI** | QuickSight | Power BI ✨ | Looker | Quick BI |
| **统一平台** | ❌ 各自独立 | ✅ Fabric | ❌ 各自独立 | 部分整合 |

---

## 四、数据产品出海：技术挑战与架构模式

### 4.1 出海三层模型

```
Layer 3  ┌─────────────────────────────────────┐
产品全球化 │ 打造全球竞争力的数据产品              │  ← Databricks/Snowflake
         │ 多云 · 多Region · 多合规 · 多语言     │
         └─────────────────────────────────────┘
Layer 2  ┌─────────────────────────────────────┐
本地化服务 │ 争取目标市场本地企业客户              │  ← 阿里云服务 GCash
         │ 本地 Region · 本地合规 · 本地支持     │
         └─────────────────────────────────────┘
Layer 1  ┌─────────────────────────────────────┐
随船出海   │ 服务出海的中国企业                    │  ← 阿里云服务东南亚电商
         │ 中文支持 · 熟悉的技术栈               │
         └─────────────────────────────────────┘
```

### 4.2 全球管控面架构

#### 方案 A：全局管控面 + 区域数据面（Databricks / Fabric 模式）

```
                ┌──────────────────────┐
                │  Global Control Plane │
                │  ┌────────────────┐  │
                │  │ API Gateway    │  │
                │  │ 元数据服务      │  │
                │  │ IAM / 认证     │  │
                │  │ Job 调度器     │  │
                │  │ 计费 & 计量    │  │
                │  └────────────────┘  │
                └──────────┬───────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ Data Plane  │ │ Data Plane  │ │ Data Plane  │
    │ 新加坡      │ │ 法兰克福    │ │ 弗吉尼亚    │
    │             │ │             │ │             │
    │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │
    │ │ 计算集群 │ │ │ │ 计算集群 │ │ │ │ 计算集群 │ │
    │ │ 对象存储 │ │ │ │ 对象存储 │ │ │ │ 对象存储 │ │
    │ │ 本地缓存 │ │ │ │ 本地缓存 │ │ │ │ 本地缓存 │ │
    │ │ KMS 密钥 │ │ │ │ KMS 密钥 │ │ │ │ KMS 密钥 │ │
    │ │ 审计日志 │ │ │ │ 审计日志 │ │ │ │ 审计日志 │ │
    │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │
    └─────────────┘ └─────────────┘ └─────────────┘
    客户数据不出 Region    GDPR 合规     美国合规
```

#### 方案 B：完全独立部署（Snowflake 模式）

```
 ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
 │ 完整服务实例  │  │ 完整服务实例  │  │ 完整服务实例  │
 │ Region: SG   │  │ Region: EU   │  │ Region: US   │
 │ 独立管控面   │  │ 独立管控面   │  │ 独立管控面   │
 │ 独立数据面   │  │ 独立数据面   │  │ 独立数据面   │
 └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
        │                 │                 │
        └────── 异步复制 (Replication Groups) ──┘
```

### 4.3 跨境数据合规矩阵

| 法规 | 地域 | 核心要求 | 对数据平台的影响 |
|------|------|---------|-----------------|
| **PIPL + 数据安全法** | 🇨🇳 中国 | 100万+ PI 出境需安全评估 | 内建数据分类 + 出境审批流 |
| **GDPR** | 🇪🇺 欧盟 | 被遗忘权 · DPA · DPIA · SCC | 支持数据删除 · 处理记录 · 影响评估 |
| **PDPA** | 🇸🇬 新加坡 | 跨境需等效保护 | 相对灵活，可做数据枢纽 |
| **PDPL** | 🇸🇦 沙特 | 政府数据必须本地驻留 | 必须建本地 Region |
| **PDP Law** | 🇮🇩 印尼 | 政府/金融数据本地化 | 需雅加达 Region |
| **Decree 13** | 🇻🇳 越南 | "重要数据"需本地存副本 | 数据镜像 + 本地代表 |
| **PDPA** | 🇹🇭 泰国 | 跨境需等效保护或 SCC | 需等待适当性清单 |

> **2024.03 中国放松**：普通 PI 出境门槛从 10万→100万，敏感 PI 从 1万→10万；合同履行、HR 等场景免评估。自贸区可制定"负面清单"。

### 4.4 跨 Region 数据同步模式

```
模式 1：CDC 异步复制（最常用）
  源数据库 → Debezium/Flink CDC → Kafka → MirrorMaker → 目标 Region → Apply
  一致性：最终一致 | 延迟：秒~分钟级

模式 2：Event Sourcing + CQRS（多活场景）
  写入 → 不可变事件流 → 复制到所有 Region → 各 Region 物化自己的读视图
  一致性：最终一致 | 天然适合事件溯源

模式 3：Compute-to-Data（数据主权最严格场景）
  数据不动 → 计算下推到数据所在 Region → 只返回聚合/脱敏结果
  一致性：N/A | 最合规但架构最复杂

模式 4：联邦查询（数据虚拟化）
  全局引擎 → 将查询分发到各 Region → 本地执行 → 汇总返回
  代表：Athena Federated / Trino / Fabric Shortcuts
```

### 4.5 多租户合规架构

```
┌────────────────────────────────────────────────┐
│              全局合规策略引擎                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 数据分类  │ │ 驻留规则  │ │ 传输控制  │       │
│  │ 自动标签  │ │ 按租户配  │ │ 按法规配  │       │
│  └──────────┘ └──────────┘ └──────────┘       │
└───────────────────┬────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│租户 A   │   │租户 B   │   │租户 C   │
│驻留:EU  │   │驻留:SG  │   │驻留:全球│
│GDPR 模板│   │PDPA 模板│   │标准模板 │
│EU KMS   │   │SG KMS   │   │默认 KMS │
│计算隔离 │   │计算隔离 │   │共享计算 │
└─────────┘   └─────────┘   └─────────┘
```

---

## 五、中国数据产品出海现状

### 5.1 主要玩家

| 公司 | 全球 Region | 核心数据产品 | 出海策略 | 量级 |
|------|------------|-------------|---------|------|
| **阿里云** | 32R / 104AZ | MaxCompute · Hologres · DataWorks · Quick BI | 东南亚+中东为主，价格低 30-50% | 国际增速 17-20% |
| **火山引擎** | 跟随 TikTok | ByteHouse · DataLeap · Doubao AI | 跟随 TikTok 消费端流量 | 起步阶段 |
| **腾讯云** | 22R / 64AZ | CDWPG · WeData · Oceanus (Flink) | 游戏/社交垂直，跟随投资组合 | 全球份额 ~2% |
| **华为云** | 中东/非洲为主 | FusionInsight · GaussDB | 利用电信设备客户关系 | 政府导向 |

### 5.2 阿里云国际数据产品矩阵

```
┌──────────────────────────────────────────────────────┐
│                阿里云国际 · 数据产品矩阵               │
│                                                      │
│  数据集成    DataWorks (170+ 连接器)                   │
│  数据仓库    MaxCompute (Serverless, EB 级)           │
│  实时分析    Hologres (PG 兼容, 亿级秒查)             │
│  流处理      Flink 实时计算                           │
│  日志分析    Log Service (SLS)                        │
│  BI 报表     Quick BI (50+ 数据源)                    │
│  ML 平台     PAI                                     │
│  AI 模型     Qwen Cloud (2026.05 全球上线)            │
│                                                      │
│  重点客户: GCash(菲) · Mekari(印尼) · TNG(马来)       │
│  投入: RMB 3800亿 / 3年 云+AI 基建                    │
└──────────────────────────────────────────────────────┘
```

### 5.3 目标市场优先级

```
Tier 1 ★★★  东南亚（新加坡 · 印尼 · 马来 · 泰 · 菲 · 越）
            ← 增长最快 · 文化接近 · 华人商业网络
            ← 阿里云 6 Region 16 AZ · 所有中国厂商布局

Tier 2 ★★☆  中东（沙特 · UAE）
            ← Vision 2030 · 数字化预算充裕 · 愿与中国合作
            ← 主权云需求 · 必须本地 Region

Tier 3 ★★   非洲
            ← 华为建了 70% 的 4G · 基建最深
            ← 海底光缆: PEACE (中巴-东非-欧洲)

Tier 4 ★☆   拉美（墨西哥 · 巴西）
            ← 阿里云 2025 开墨西哥 Region · 腾讯有圣保罗
            ← 跨境电商 (Shein/Temu) 驱动

Tier 5 ★    欧洲
            ← GDPR 最严 · 竞争最激烈 · 但客户价值最高
            ← 阿里云 法兰克福/伦敦/巴黎
```

### 5.4 中国厂商 vs Databricks/Snowflake

| 维度 | 中国厂商 (阿里云为代表) | Databricks / Snowflake |
|------|----------------------|----------------------|
| 定价 | **低 30-50%**（东南亚市场） | 高端定价 |
| 全栈能力 | IaaS + PaaS + 数据 + AI 打包 | 数据平台层，需搭配 IaaS |
| 多云 | ❌ 单云 | ✅ 三朵云 |
| AI/ML | Qwen (Apache 2.0 开源) | Mosaic AI / Cortex AI |
| 开源 | Qwen · Flink · Doris · StarRocks | Delta Lake · MLflow · Spark |
| 地缘风险 | ⚠️ 西方市场受限 | ✅ 低 |
| 增速 | 17-20% (国际) | Databricks >65% / Snowflake ~30% |
| 优势市场 | 东南亚 · 中东 | 美国 · 欧洲 |

---

## 六、我的经验映射

### 6.1 经验对照表

| 我在微软/阿里的经验 | 出海场景的对应 | 面试话术 |
|-------------------|--------------|---------|
| AKS+ACI 容器管控，多 Region 部署 | 全球数据平台区域化部署 | "我做的管控面服务 30+ Azure Region" |
| Control Plane / Data Plane 分离 | 全局管控面 + 区域数据面 | "和 Databricks 同一架构模式" |
| FCS Telemetry 统一可观测性 | 全球 SLA/SLO 监控体系 | "控制面 + ACI 层 统一 Telemetry" |
| Autoscale 优化，成本降 80% | 多 Region 弹性 & 成本治理 | "CU 池化 + 按需伸缩" |
| ENI 网络虚拟化，跨 AZ 迁移 | 跨 Region 网络 & 数据主权 | "IP 保持的跨 AZ 迁移" |
| 600K ECS 灰度迁移 | 大规模全球化灰度发布 | "百万级实例的分批灰度" |
| Scout 智能诊断 Agent | 全球化 AIOps | "5 层架构的诊断 Agent" |
| On-call 稳定性治理 | Follow-the-Sun 全球运维 | "SLA/SLO/SLI 体系化治理" |

### 6.2 面试话术模板

**自我介绍衔接**：

> "我在微软 Cloud+AI 做 HDInsight/Fabric 的容器管控平台，服务全球 30+ Region 的 Azure 客户。核心工作是控制面的多 Region 部署、容器生命周期管理、以及全球化场景下的稳定性治理。虽然我做的是 PaaS 层基建，但架构思路——全局管控面+区域数据面、跨 Region 一致性、灰度发布策略——和数据产品出海的技术挑战高度一致。"

**被问 Fabric**：

> "Fabric 本质上是微软把 Synapse + ADF + Power BI Premium + Data Explorer 整合成一个 SaaS 平台，底座是 OneLake 统一数据湖。对标 Databricks Lakehouse + Unity Catalog。我做的容器管控层为 Fabric Data Engineering 提供 Spark 运行时基建。"

**被问为什么转出海**：

> "两个原因：第一，我在微软做全球化 PaaS 积累了多 Region 架构经验，但想更贴近数据产品本身；第二，我在阿里做过 ECS 管控平台，了解中国云厂商的技术栈和工程文化。两段经历结合，正好适合做中国数据产品的全球化架构。"

---

## 附录：关键数字速查

| 指标 | 数值 |
|------|------|
| Databricks 估值 | $134B (2025.12) |
| Databricks ARR | $5.4B (2026.02), >65% YoY |
| Snowflake 年收入 | $4.68B (FY2026) |
| Fabric 付费客户 | 21,000+ (2024.11) |
| Azure 年收入 | >$75B (FY2025) |
| 阿里云国际 Region | 32 Region, 104 AZ |
| 腾讯云 Region | 22 Region, 64 AZ |
| 全球公有云支出 | $723B (2025, Gartner) |
| 全球云基建支出 | $400B (2025), 预计 2026 >$500B |
| 中国 PIPL 出境门槛 | 100万普通 PI / 10万敏感 PI (2024.03) |

---