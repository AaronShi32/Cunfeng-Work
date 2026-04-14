import React, { useState } from 'react';
import { PageLayout, ZoomableImageModal } from '../components';
import layout from '../styles/layout.module.css';
import anim from '../styles/animation.module.css';
import exp from '../styles/experience.module.css';

import hdiImage from '../../img/HDI/HDI-2025-09-04-1233.png';
import asiImage from '../../img/ASI/ASI-2026-01-20-1022.png';
import scoutImage from '../../img/Scout/Scout-2026-01-20-1022.png';
import fcsImage from '../../img/FCS/FCS-2026-01-20-1331.png';
import notebookImage from '../../img/Fabric/Notebook-RetriableSession-2025-09-04-1233.png';

/* ── SVG Icons (monochrome, currentColor) ── */
const IconDatabase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const IconBarChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IconFileText = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconNetwork = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="6" height="6" rx="1" /><rect x="16" y="2" width="6" height="6" rx="1" /><rect x="9" y="16" width="6" height="6" rx="1" /><path d="M5 8v3a1 1 0 001 1h12a1 1 0 001-1V8" /><line x1="12" y1="12" x2="12" y2="16" />
  </svg>
);
const IconShuffle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

const MS_PROJECTS = [
  { key: 'hdi', icon: <IconDatabase />, title: 'HDInsight', desc: 'Azure HDInsight 大数据分析平台', image: hdiImage },
  { key: 'asi', icon: <IconBarChart />, title: 'ASI', desc: 'Azure Service Insights 服务监控与分析报告', image: asiImage },
  { key: 'scout', icon: <IconSearch />, title: 'Scout', desc: 'AI-AzureData 智能分析引擎', image: scoutImage },
  { key: 'fcs', icon: <IconBox />, title: 'Fabric Container Service', desc: 'Microsoft Fabric 容器服务管理平台', image: fcsImage },
  { key: 'notebook', icon: <IconFileText />, title: 'Fabric Notebook', desc: 'Microsoft Fabric Notebook 服务', image: notebookImage },
];

const ALI_PROJECTS = [
  {
    key: 'eni',
    icon: <IconNetwork />,
    title: 'ENI (弹性网卡)',
    desc: '阿里云 VPC 弹性网络接口，负责网络接口创建、绑定、解绑、RDMA 等核心功能。',
    links: [
      { href: 'https://help.aliyun.com/zh/ecs/user-guide/eni-overview', label: 'ENI 产品介绍' },
      { href: 'https://help.aliyun.com/zh/ecs/user-guide/attach-an-eni', label: 'ENI 绑定与管理指南' },
    ],
  },
  {
    key: 'migration',
    icon: <IconShuffle />,
    title: '跨可用区实例迁移',
    desc: '跨可用区 ECS 实例迁移方案，负责迁移策略设计、数据一致性保障与网络类型转换。',
    links: [
      { href: 'https://help.aliyun.com/zh/ecs/user-guide/migrate-an-ecs-instance', label: 'ECS 实例迁移指南' },
      { href: 'https://help.aliyun.com/zh/ecs/user-guide/migrate-ecs-instances-from-the-classic-network-to-a-vpc', label: '经典网络迁移到 VPC' },
    ],
  },
];

export default function Experience() {
  const [modalImage, setModalImage] = useState(null);

  return (
    <PageLayout>
      {/* Microsoft */}
      <section className={exp.companySection}>
        <div className={exp.companyHeader}>
          <svg className={exp.companyLogo} width="24" height="24" viewBox="0 0 23 23"><rect width="11" height="11" fill="currentColor"/><rect x="12" width="11" height="11" fill="currentColor"/><rect y="12" width="11" height="11" fill="currentColor"/><rect x="12" y="12" width="11" height="11" fill="currentColor"/></svg>
          <h2 className={exp.companyName}>Microsoft</h2>
        </div>

        <div className={exp.projectGrid}>
          {MS_PROJECTS.map((p) => (
            <div key={p.key} className={`${exp.projectCard} ${anim.animateCard}`}>
              <div className={exp.cardHeader}>
                <span className={exp.cardIcon}>{p.icon}</span>
                <h3 className={exp.cardTitle}>{p.title}</h3>
              </div>
              <p className={exp.cardDesc}>{p.desc}</p>
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className={exp.cardImage}
                  onClick={() => setModalImage({ src: p.image, alt: p.title })}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Alibaba */}
      <section className={exp.companySection}>
        <div className={exp.companyHeader}>
          <svg className={exp.companyLogo} width="24" height="24" viewBox="0 0 1024 1024"><path d="M258.8 330.5c-48.5 20.3-82.6 68-82.6 123.5v116c0 55.5 34.1 103.2 82.6 123.5l120.4-50.4c-30.8-12.9-52.5-43.2-52.5-78.5V459.4c0-35.3 21.7-65.6 52.5-78.5L258.8 330.5z" fill="currentColor"/><path d="M765.2 330.5c48.5 20.3 82.6 68 82.6 123.5v116c0 55.5-34.1 103.2-82.6 123.5l-120.4-50.4c30.8-12.9 52.5-43.2 52.5-78.5V459.4c0-35.3-21.7-65.6-52.5-78.5l120.4-50.4z" fill="currentColor"/><path d="M512 410.7l-131.5 55v92.6L512 613.3l131.5-55v-92.6L512 410.7z" fill="currentColor"/></svg>
          <h2 className={exp.companyName}>Alibaba Cloud</h2>
        </div>

        <div className={exp.projectGrid}>
          {ALI_PROJECTS.map((p) => (
            <div key={p.key} className={`${exp.projectCard} ${anim.animateCard}`}>
              <div className={exp.cardHeader}>
                <span className={exp.cardIcon}>{p.icon}</span>
                <h3 className={exp.cardTitle}>{p.title}</h3>
              </div>
              <p className={exp.cardDesc}>{p.desc}</p>
              {p.links && (
                <div className={exp.linkRow}>
                  {p.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={exp.docLink}
                    >
                      {link.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {modalImage && (
        <ZoomableImageModal
          imageSrc={modalImage.src}
          imageAlt={modalImage.alt}
          isOpen
          onClose={() => setModalImage(null)}
        />
      )}

    </PageLayout>
  );
}
