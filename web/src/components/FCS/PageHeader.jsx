import React from 'react';
import { fcsTheme } from '../../data/fcsData';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '40px'
    }}>
      <h1 style={{
        fontSize: fcsTheme.typography.title.fontSize,
        fontWeight: fcsTheme.typography.title.fontWeight,
        color: fcsTheme.colors.textPrimary,
        margin: '0 0 16px 0',
        textShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: fcsTheme.typography.subtitle.fontSize,
        color: fcsTheme.colors.textSecondary,
        opacity: 1,
        margin: 0
      }}>
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;