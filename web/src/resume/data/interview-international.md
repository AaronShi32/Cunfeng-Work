# 数据产品出海 — 业界分析与技术背景

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

| Fabric 组件 | Databricks | Snowflake | AWS | 阿里云 | 腾讯云 |
|-------------|-----------|-----------|-----|--------|--------|
| **OneLake** | Unity Catalog + Delta Lake | 内部存储 | S3 + Lake Formation | OSS + 数据湖 | COS + 数据湖 |
| **Data Factory** | Workflows | Snowpipe | Glue + Step Functions | DataWorks | **WeData** |
| **Data Engineering** | Notebooks / Jobs | Snowpark | EMR / Glue Spark | E-MapReduce | EMR |
| **Data Warehouse** | SQL Warehouse + Photon | **Snowflake Core** ✨ | Redshift | MaxCompute | CDWPG / TCHouse |
| **Real-Time Intel** | Structured Streaming | Dynamic Tables | Kinesis + MSK | Flink + Hologres | Oceanus (Flink) |
| **Power BI** | SQL Dashboards | Snowsight | QuickSight | Quick BI | DataInsight |
| **Data Science** | MLflow + Mosaic AI | Cortex AI | SageMaker | PAI | TI Platform |
| **Mirroring** | — | — | DMS | DTS | DTS |
| **Data Agent** | Genie | — | Q | — | — |

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

## 三、竞品全景：EMR / Fabric / Databricks

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

### 3.2 Amazon EMR

```
定位：AWS 托管大数据开源分析服务（Hadoop / Spark / Hive / Presto / Flink）
对标：Azure HDInsight / Google Dataproc
模式：EC2 集群 / EKS 容器化 / Serverless（按查询计费）
```

**核心架构**：

```
┌───────────────────────────────────────┐
│         EMR Control Plane             │  ← AWS 托管
│  集群生命周期 · 调度 · 监控 · 安全     │
└──────────────────┬────────────────────┘
                   │
   ┌───────────────┼───────────────┐
   ▼               ▼               ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│ EMR on   │ │ EMR on   │ │    EMR       │
│   EC2    │ │   EKS    │ │ Serverless   │
│ 经典集群 │ │ K8s 部署 │ │ 按查询计费   │
└──────────┘ └──────────┘ └──────────────┘
```

**关键能力**：
- **EMR on EKS**：将 Spark 作业提交到 EKS，与其他容器工作负载混部，资源利用率更高
- **EMR Serverless**：无需管理集群，按任务计费，自动弹性
- **EMR Studio**：托管 Notebook 开发环境（对标 Fabric Notebook）
- **EMRFS**：直接读写 S3，支持一致性视图
- **Lake Formation 集成**：统一数据湖权限管理

### 3.3 EMR vs Fabric vs Databricks 三方对比

| 维度 | Amazon EMR | Microsoft Fabric | Databricks |
|------|-----------|-----------------|------------|
| **定位** | 托管开源大数据集群 | 统一 SaaS 分析平台 | 统一 Lakehouse 平台 |
| **交付模式** | IaaS/PaaS（AWS Only） | SaaS（Azure Only） | PaaS（多云） |
| **核心引擎** | Spark / Hive / Presto / Flink | Spark + T-SQL + KQL | 优化 Spark + Photon |
| **Serverless** | ✅ EMR Serverless | ✅ 默认 Serverless | ✅ Serverless SQL/Jobs |
| **数据格式** | 开放（Parquet/ORC/Delta/Iceberg） | Delta Parquet（强制） | Delta Lake（开源） |
| **数据湖** | S3 + Lake Formation | OneLake（统一湖） | Unity Catalog + DBFS |
| **ML/AI** | SageMaker（独立服务） | Copilot + AI Functions | **Mosaic AI（最强）** |
| **BI** | QuickSight（独立） | **Power BI（原生集成）** | 需第三方 |
| **实时** | Flink / Spark Streaming | **Eventhouse (KQL)** | Structured Streaming |
| **治理** | Lake Formation + Glue Catalog | Purview + OneLake Catalog | Unity Catalog |
| **定价** | 按实例时间 + EC2 | CU（统一池） | DBU（按工作负载） |
| **多云** | ❌ AWS Only | ❌ Azure Only | ✅ AWS/Azure/GCP |
| **集群管理** | 用户自管（或 Serverless） | 全托管 | 全托管 |
| **战略走向** | 稳定，持续迭代 | 📈 微软战略重心 | 📈 最活跃，$134B 估值 |

---

## 四、数据仓库 → 数据湖 → 湖仓一体

### 演进脉络

```
1990s 数据仓库 ──→ 2010s 数据湖 ──→ 2020s 湖仓一体
结构化 + SQL 分析    所有数据 + 存下再说    两者融合 + 既要又要
```

### 三者对比

| 对比项 | 数据仓库 | 数据湖 | 湖仓一体 |
|---|---|---|---|
| 数据类型 | 结构化 | 所有类型 | 所有类型 |
| Schema | Write 时定义 | Read 时定义 | 灵活（支持 Schema Evolution） |
| ACID 事务 | ✅ | ❌ | ✅ |
| 查询性能 | 高 | 低 | 中高（索引+统计加速） |
| 存储成本 | 高（专有格式） | 低（对象存储） | 低（对象存储） |
| UPDATE/DELETE | ✅ | ❌ | ✅ |
| 适合场景 | BI 报表、SQL 分析 | ML、原始数据归档 | 统一分析 + ML + 流批一体 |
| 代表产品 | Teradata、Redshift、Synapse | HDFS、S3、ADLS | **Databricks**、**Microsoft Fabric** |

### 核心思路

- **数据仓库**的痛点：只能存结构化数据、建模周期长、存储计算耦合扩展贵
- **数据湖**的痛点：缺乏 ACID 事务、无索引查询慢、数据质量失控变成"数据沼泽"
- **湖仓一体**的解法：在数据湖的廉价对象存储之上，加一层 **开放表格式**（Delta Lake / Iceberg / Hudi），补齐事务、Schema 管理和查询加速

### 开放表格式对比

| 技术 | 主导方 | 特点 |
|---|---|---|
| **Delta Lake** | Databricks | Spark 生态深度集成，**Microsoft Fabric 底层即 Delta** |
| **Apache Iceberg** | Netflix → Apache | 引擎无关（Spark / Flink / Trino），社区增长最快 |
| **Apache Hudi** | Uber → Apache | 擅长增量更新和流式入湖 |

### 与 FCS 项目的关联

Microsoft Fabric 是微软的湖仓一体产品，底层用 OneLake（基于 ADLS）+ Delta Lake 格式，上层统一 Spark / SQL / Power BI。FCS 容器管控平台承载的正是 Fabric 里 Notebook（Spark）工作负载的调度和生命周期管理——是湖仓一体架构中 **计算层的基础设施**。

### 面试建议回答

> 数据仓库解决结构化数据分析，Schema on Write，查询快但只能存结构化数据。数据湖解决海量多类型数据存储，Schema on Read，灵活低成本但缺事务和管理，容易变成数据沼泽。湖仓一体融合两者——在数据湖的廉价存储上通过 Delta Lake / Iceberg 等开放表格式补齐 ACID 事务和查询加速。Microsoft Fabric 就是典型的湖仓一体产品，我做的 FCS 平台是其计算层基础设施，负责 Spark Notebook 工作负载的容器化调度和生命周期管理。

---