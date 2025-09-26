import React from 'react';
import { asiTheme } from '../../data/asiData';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '40px'
    }}>
      <h1 style={{
        fontSize: asiTheme.typography.title.fontSize,
        fontWeight: asiTheme.typography.title.fontWeight,
        color: asiTheme.colors.textPrimary,
        margin: '0 0 16px 0',
        textShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: asiTheme.typography.subtitle.fontSize,
        color: asiTheme.colors.textSecondary,
        opacity: 1,
        margin: 0
      }}>
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;