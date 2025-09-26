import React from 'react';
import { fcsTheme } from '../../data/fcsData';

const ImageSection = ({ title, src, alt, fallback }) => {
  return (
    <div style={{
      background: fcsTheme.colors.cardBackground,
      borderRadius: '16px',
      padding: fcsTheme.spacing.cardPadding,
      marginBottom: fcsTheme.spacing.sectionMargin,
      boxShadow: fcsTheme.shadows.card,
      border: `1px solid ${fcsTheme.colors.border}`,
      textAlign: 'center'
    }}>
      <h2 style={{
        fontSize: fcsTheme.typography.sectionTitle.fontSize,
        fontWeight: fcsTheme.typography.sectionTitle.fontWeight,
        color: fcsTheme.colors.textPrimary,
        margin: '0 0 24px 0'
      }}>
        {title}
      </h2>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        background: fcsTheme.colors.imagePlaceholder,
        borderRadius: '8px',
        border: `2px dashed ${fcsTheme.colors.imageBorder}`
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
          color: fcsTheme.colors.textMuted,
          fontSize: '16px',
          padding: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {fallback.icon}
          </div>
          <p>{fallback.text}</p>
          <p style={{ fontSize: fcsTheme.typography.body.fontSize, marginTop: '8px' }}>
            {fallback.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageSection;