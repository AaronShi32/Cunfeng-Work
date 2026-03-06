import React from 'react';
import PageLayout from './PageLayout';
import ProjectCard from './ProjectCard';
import TechStackBar from './TechStackBar';
import layout from '../styles/layout.module.css';

const TECHS = [
  { name: 'Java/C#/Python', icon: '⚛️' },
  { name: 'Distributed System', icon: '⚡' },
  { name: 'AI Agent/MCP', icon: '🗺️' },
  { name: 'Azure/Alibaba Cloud', icon: '☁️' },
];

export default function Alibaba() {
  return (
    <PageLayout title="阿里云工作经历" subtitle="在阿里云参与的核心项目与技术实现" backTo="/">
      <div className={layout.cardGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <ProjectCard icon="🌐" title="ENI" description="弹性网络接口<br/>网络资源管理" to="/samples" />
        <ProjectCard icon="🏗️" title="跨可用区迁移" description="跨网络类型实例迁移<br/>灾难恢复解决方案" to="/instance-migration" />
      </div>
      <TechStackBar techs={TECHS} />
    </PageLayout>
  );
}