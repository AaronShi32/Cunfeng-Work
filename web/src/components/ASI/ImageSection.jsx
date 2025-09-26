import React from 'react';
import { asiTheme } from '../../data/asiData';

const ImageSection = ({ title, src, alt, fallback }) => {
  return (
    <div style={{
      background: asiTheme.colors.cardBackground,
      borderRadius: '16px',
      padding: asiTheme.spacing.cardPadding,
      marginBottom: asiTheme.spacing.sectionMargin,
      boxShadow: asiTheme.shadows.card,
      border: `1px solid ${asiTheme.colors.border}`,
      textAlign: 'center'
    }}>
      <h2 style={{
        fontSize: asiTheme.typography.sectionTitle.fontSize,
        fontWeight: asiTheme.typography.sectionTitle.fontWeight,
        color: asiTheme.colors.textPrimary,
        margin: '0 0 24px 0'
      }}>
        {title}
      </h2>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        background: asiTheme.colors.imagePlaceholder,
        borderRadius: '8px',
        border: `2px dashed ${asiTheme.colors.imageBorder}`
      }}>
        <img 
          src={src} 
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: '500px',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div style={{
          display: 'none',
          color: asiTheme.colors.textMuted,
          fontSize: '16px',
          padding: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {fallback.icon}
          </div>
          <p>{fallback.text}</p>
          <p style={{ fontSize: asiTheme.typography.body.fontSize, marginTop: '8px' }}>
            {fallback.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageSection;