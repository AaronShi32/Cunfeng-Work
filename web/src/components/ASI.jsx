import React from 'react';
import { asiConfig, asiTheme } from '../data/asiData';
import PageHeader from './ASI/PageHeader';
import ImageSection from './ASI/ImageSection';
import PowerBISection from './ASI/PowerBISection';
import NavigationButton from './ASI/NavigationButton';

export default function ASI({ onBack }) {
  const { title, sections } = asiConfig;

  // 根据类型渲染不同的组件
  const renderSection = (section) => {
    switch (section.type) {
      case 'image':
        return (
          <ImageSection
            key={section.id}
            title={section.title}
            src={section.content.src}
            alt={section.content.alt}
            fallback={section.content.fallback}
          />
        );
      case 'powerbi':
        return (
          <PowerBISection
            key={section.id}
            title={section.title}
            content={section.content}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: asiTheme.colors.background,
      padding: asiTheme.spacing.containerPadding
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <PageHeader 
          title={title.main} 
          subtitle={title.subtitle} 
        />

        {sections.map(renderSection)}

        <NavigationButton onClick={onBack || (() => window.history.back())}>
          ← 返回上一页
        </NavigationButton>
      </div>
    </div>
  );
}
