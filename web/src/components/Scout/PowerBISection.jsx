import React from 'react';
import { scoutTheme } from '../../data/scoutData';

const PowerBISection = ({ title, content }) => {
  const { title: reportTitle, width, height, src, description, fallbackText } = content;

  return (
    <div style={{
      background: scoutTheme.colors.cardBackground,
      borderRadius: '16px',
      padding: scoutTheme.spacing.cardPadding,
      boxShadow: scoutTheme.shadows.card,
      border: `1px solid ${scoutTheme.colors.border}`
    }}>
      <h2 style={{
        fontSize: scoutTheme.typography.sectionTitle.fontSize,
        fontWeight: scoutTheme.typography.sectionTitle.fontWeight,
        color: scoutTheme.colors.textPrimary,
        margin: '0 0 24px 0',
        textAlign: 'center'
      }}>
        {title}
      </h2>
      
      {/* PowerBI iframe 容器 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minHeight: '550px'
      }}>
        <iframe 
          title={reportTitle}
          width={width}
          height={height}
          src={src}
          frameBorder="0" 
          allowFullScreen={true}
          style={{
            borderRadius: '8px',
            boxShadow: scoutTheme.shadows.image,
            border: `1px solid ${scoutTheme.colors.border}`,
            maxWidth: '100%'
          }}
        />
      </div>
      
      {/* 报告说明 */}
      <div style={{
        marginTop: '24px',
        padding: scoutTheme.spacing.smallPadding,
        background: scoutTheme.colors.imagePlaceholder,
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: scoutTheme.typography.body.fontSize,
          color: scoutTheme.colors.textMuted,
          margin: 0,
          lineHeight: '1.5'
        }}>
          {description}
          <br />
          {fallbackText}
        </p>
      </div>
    </div>
  );
};

export default PowerBISection;