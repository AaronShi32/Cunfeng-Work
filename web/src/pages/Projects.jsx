import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout, ProjectCard, Footer } from '../components';
import layout from '../styles/layout.module.css';
import styles from '../styles/projects.module.css';

const GROUPS = [
  {
    company: 'Microsoft',
    period: 'Platform & Service Engineering',
    summary: '聚焦平台能力、服务可观测性与分布式系统的工程落地。',
    to: '/microsoft',
    items: [
      { key: 'hdi', icon: '🐘', title: 'HDInsight', description: '大数据分析平台<br/>服务与平台能力建设', to: '/hdinsight' },
      { key: 'asi', icon: '📊', title: 'ASI', description: '服务监控与分析报告<br/>可观测性实践', to: '/asi' },
      { key: 'scout', icon: '🔍', title: 'Scout', description: '智能分析引擎<br/>数据洞察与效率提升', to: '/scout' },
      { key: 'fcs', icon: '🐳', title: 'FCS', description: 'Fabric Container Service<br/>平台基础设施能力', to: '/fcs' },
      { key: 'notebook', icon: '📓', title: 'Fabric Notebook', description: 'Notebook 服务<br/>任务与会话能力', to: '/fabric-notebook' },
    ],
  },
  {
    company: 'Alibaba Cloud',
    period: 'Cloud Networking & Migration',
    summary: '关注云网络资源编排、实例迁移与高可用场景下的能力建设。',
    to: '/alibaba',
    items: [
      { key: 'eni', icon: '🌐', title: 'ENI', description: '弹性网络接口<br/>网络资源管理', to: '/samples' },
      { key: 'migration', icon: '🏗️', title: '跨可用区迁移', description: '实例迁移方案<br/>灾难恢复设计', to: '/instance-migration' },
    ],
  },
];

export default function Projects() {
  return (
    <PageLayout title="Projects" subtitle="代表项目与工程实践">
      <section className={styles.introPanel}>
        <p className={styles.introLead}>
          这里汇总了我在云基础设施、平台工程、分布式系统与 AI 相关方向的代表性项目。
        </p>
        <div className={styles.tagRow}>
          <span className={styles.tag}>Azure</span>
          <span className={styles.tag}>Alibaba Cloud</span>
          <span className={styles.tag}>Distributed Systems</span>
          <span className={styles.tag}>Observability</span>
        </div>
      </section>

      {GROUPS.map((group) => (
        <section key={group.company} className={styles.group}>
          <div className={styles.groupHeader}>
            <div>
              <p className={styles.groupPeriod}>{group.period}</p>
              <h2 className={styles.groupTitle}>{group.company}</h2>
              <p className={styles.groupSummary}>{group.summary}</p>
            </div>
            <Link to={group.to} className={styles.groupLink}>
              查看板块
            </Link>
          </div>

          <div className={layout.cardGrid}>
            {group.items.map((item) => (
              <ProjectCard
                key={item.key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                to={item.to}
              />
            ))}
          </div>
        </section>
      ))}

      <Footer />
    </PageLayout>
  );
}
