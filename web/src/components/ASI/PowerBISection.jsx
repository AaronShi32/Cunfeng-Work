import React from 'react';
import { asiTheme } from '../../data/asiData';

const PowerBISection = ({ title, content }) => {
  const { title: reportTitle, width, height, src, description, fallbackText } = content;

  return (
    <div style={{
      background: asiTheme.colors.cardBackground,
      borderRadius: '16px',
      padding: asiTheme.spacing.cardPadding,
      boxShadow: asiTheme.shadows.card,
      border: `1px solid ${asiTheme.colors.border}`
    }}>
      <h2 style={{
        fontSize: asiTheme.typography.sectionTitle.fontSize,
        fontWeight: asiTheme.typography.sectionTitle.fontWeight,
        color: asiTheme.colors.textPrimary,
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
            boxShadow: asiTheme.shadows.image,
            border: `1px solid ${asiTheme.colors.border}`,
            maxWidth: '100%'
          }}
        />
      </div>
      
      {/* 报告说明 */}
      <div style={{
        marginTop: '24px',
        padding: asiTheme.spacing.smallPadding,
        background: asiTheme.colors.imagePlaceholder,
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: asiTheme.typography.body.fontSize,
          color: asiTheme.colors.textMuted,
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