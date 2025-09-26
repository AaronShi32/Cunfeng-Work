import React from 'react';
import { scoutTheme } from '../../data/scoutData';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '40px'
    }}>
      <h1 style={{
        fontSize: scoutTheme.typography.title.fontSize,
        fontWeight: scoutTheme.typography.title.fontWeight,
        color: scoutTheme.colors.textPrimary,
        margin: '0 0 16px 0',
        textShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: scoutTheme.typography.subtitle.fontSize,
        color: scoutTheme.colors.textSecondary,
        opacity: 1,
        margin: 0
      }}>
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;