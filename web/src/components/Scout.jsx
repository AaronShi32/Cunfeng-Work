import React from 'react';
import { scoutConfig, scoutTheme } from '../data/scoutData';
import PageHeader from './Scout/PageHeader';
import ImageSection from './Scout/ImageSection';
import NavigationButton from './Scout/NavigationButton';

export default function Scout({ onBack }) {
  const { title, sections } = scoutConfig;

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
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: scoutTheme.colors.background,
      padding: scoutTheme.spacing.containerPadding
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