import React, { useState } from 'react';
import { ZoomableImageModal, PageLayout, ProjectCard, TechStackBar } from '../components';
import layout from '../styles/layout.module.css';

import hdiImage from '../../img/HDI/HDI-2025-09-04-1233.png';
import fcsImage from '../../img/FCS/FCS-2026-01-20-1331.png';
import asiImage from '../../img/ASI/ASI-2026-01-20-1022.png';
import scoutImage from '../../img/Scout/Scout-2026-01-20-1022.png';
import ongoingImage from '../../img/Fabric/Notebook-RetriableSession-2025-09-04-1233.png';

const PROJECTS = [
  { key: 'hdi', icon: '🐘', title: 'HDInsight', description: 'Azure HDInsight<br/>大数据分析平台', image: hdiImage, alt: 'HDInsight Architecture' },
  { key: 'asi', icon: '📊', title: 'ASI', description: 'Azure Service Insights<br/>服务监控与分析报告', image: asiImage, alt: 'ASI Architecture' },
  { key: 'scout', icon: '🔍', title: 'Scout', description: 'AI-AzureData<br/>智能分析引擎', image: scoutImage, alt: 'Scout Architecture' },
  { key: 'fcs', icon: '🐳', title: 'FCS', description: 'Microsoft Fabric<br/>容器服务管理平台', image: fcsImage, alt: 'FCS Architecture' },
  { key: 'retry', icon: '🚀', title: 'Retry Session', description: 'Microsoft Fabric<br/>重试作业', image: ongoingImage, alt: 'Ongoing Project' },
];

const TECHS = [
  { name: 'C#/.NET', icon: '⚡' },
  { name: 'Azure/AKS/ACI', icon: '☁️' },
  { name: 'Service Fabric', icon: '🔧' },
  { name: 'Kusto/PowerBI', icon: '📊' },
];

export default function Microsoft() {
  const [modal, setModal] = useState(null);

  return (
    <PageLayout title="微软工作经历" subtitle="在微软参与的核心项目与技术实现" backTo="/">
      <div className={layout.cardGrid}>
        {PROJECTS.map(p => (
          <ProjectCard key={p.key} icon={p.icon} title={p.title} description={p.description} onClick={() => setModal(p)} />
        ))}
      </div>

      <TechStackBar techs={TECHS} />

      {modal && (
        <ZoomableImageModal
          imageSrc={modal.image}
          imageAlt={modal.alt}
          isOpen
          onClose={() => setModal(null)}
        />
      )}
    </PageLayout>
  );
}
