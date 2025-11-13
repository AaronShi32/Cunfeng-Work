import React from 'react';
import { fcsConfig, fcsTheme } from '../data/fcsData';
import PageHeader from './FCS/PageHeader';
import ImageSection from './FCS/ImageSection';
import TableSection from './FCS/TableSection';
import NavigationButton from './FCS/NavigationButton';

export default function FCS({ onBack }) {
  const { title, sections } = fcsConfig;

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

        {sections.map(renderSection)}

        <NavigationButton onClick={onBack || (() => window.history.back())}>
          ← 返回上一页
        </NavigationButton>
      </div>
    </div>
  );
}