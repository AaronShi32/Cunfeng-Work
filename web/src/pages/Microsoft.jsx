import React from 'react';
import { PageLayout, ProjectCard, TechStackBar } from '../components';
import layout from '../styles/layout.module.css';

const PROJECTS = [
  { key: 'hdi', icon: '🐘', title: 'HDInsight', description: 'Azure HDInsight<br/>大数据分析平台', to: '/hdinsight' },
  { key: 'asi', icon: '📊', title: 'ASI', description: 'Azure Service Insights<br/>服务监控与分析报告', to: '/asi' },
  { key: 'scout', icon: '🔍', title: 'Scout', description: 'AI-AzureData<br/>智能分析引擎', to: '/scout' },
  { key: 'fcs', icon: '🐳', title: 'FCS', description: 'Microsoft Fabric<br/>容器服务管理平台', to: '/fcs' },
  { key: 'notebook', icon: '📓', title: 'Fabric Notebook', description: 'Microsoft Fabric<br/>Notebook 服务', to: '/fabric-notebook' },
];

const TECHS = [
  { name: 'C#/.NET', icon: '⚡' },
  { name: 'Azure/AKS/ACI', icon: '☁️' },
  { name: 'Service Fabric', icon: '🔧' },
  { name: 'Kusto/PowerBI', icon: '📊' },
];

export default function Microsoft() {
  return (
    <PageLayout title="微软工作经历" subtitle="在微软参与的核心项目与技术实现" backTo="/">
      <div className={layout.cardGrid}>
        {PROJECTS.map(p => (
          <ProjectCard key={p.key} icon={p.icon} title={p.title} description={p.description} to={p.to} />
        ))}
      </div>

      <TechStackBar techs={TECHS} />
    </PageLayout>
  );
}
