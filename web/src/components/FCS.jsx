import React from 'react';
import { fcsConfig, fcsTheme } from '../data/fcsData';
import PageHeader from './FCS/PageHeader';
import ImageSection from './FCS/ImageSection';
import TableSection from './FCS/TableSection';
import NavigationButton from './FCS/NavigationButton';
import fabricDEWorkflow from '../../img/FCS/Fabric-DE-Workflow.jpg';
import fcsComponent from '../../img/FCS/FCS Component.png';
import controlPlaneWorkflow from '../../img/FCS/PYNB-ControlPlane-Workflow.png';
import dataPlaneWorkflow from '../../img/FCS/PYNB-DataPlane-Workflow.png';

export default function FCS({ onBack }) {
  const { title, sections } = fcsConfig;

  // 分离前两个章节和后两个章节
  const mainSections = sections.slice(0, 2); // FCS架构图 和 容器生命周期管理
  const workflowSections = sections.slice(2); // ControlPlane 和 DataPlane

  // 根据类型渲染不同的组件
  const renderSection = (section, index) => {
    switch (section.type) {
      case 'image':
        return (
          <ImageSection
            key={section.id}
            title={section.title}
            src={section.content.src}
            alt={section.content.alt}
            link={section.content.link}
            linkText={section.content.linkText}
            fallback={section.content.fallback}
          />
        );
      case 'table':
        return (
          <TableSection
            key={section.id}
            title={section.title}
            tableTitle={section.content.tableTitle}
            subtitle={section.content.subtitle}
            columns={section.content.columns}
            data={section.content.data}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: fcsTheme.colors.background,
      padding: fcsTheme.spacing.containerPadding
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <PageHeader 
          title={title.main} 
          subtitle={title.subtitle} 
        />

        {/* 渲染前两个主要章节 */}
        {mainSections.map((section, index) => renderSection(section, index))}

        {/* 从上到下渲染工作流章节 */}
        <div style={{
          margin: '48px 0 32px 0'
        }}>
          {workflowSections.map((section, index) => (
            <div key={section.id} style={{ 
              marginBottom: index < workflowSections.length - 1 ? '32px' : '0'
            }}>
              {renderSection(section, index)}
            </div>
          ))}
        </div>

        <NavigationButton onClick={onBack || (() => window.history.back())}>
          ← 返回上一页
        </NavigationButton>
      </div>
    </div>
  );
}