import React from 'react';
import alibabaLogo from '../../img/Others/Alibaba.png';
import microsoftLogo from '../../img/Others/Microsoft.svg';
import PageLayout from './PageLayout';
import ProjectCard from './ProjectCard';
import TechStackBar from './TechStackBar';
import Footer from './Footer';
import layout from '../styles/layout.module.css';

const TECHS = [
  { name: 'Java/C#/Python', icon: '⚛️' },
  { name: 'Distributed System', icon: '⚡' },
  { name: 'AI Agent/MCP', icon: '🗺️' },
  { name: 'Azure/Alibaba Cloud', icon: '☁️' },
];

export default function Home() {
  return (
    <PageLayout title="Cunfeng Shi" subtitle="工作项目经历">
      <div className={layout.cardGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <ProjectCard logo={alibabaLogo} logoAlt="Alibaba" logoSize={64} title="Alibaba" to="/alibaba" />
        <ProjectCard logo={microsoftLogo} logoAlt="Microsoft" logoSize={48} title="Microsoft" to="/microsoft" />
      </div>
      <TechStackBar techs={TECHS} />
      <Footer />
    </PageLayout>
  );
}
