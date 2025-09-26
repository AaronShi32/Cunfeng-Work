import React from 'react';
import { scoutTheme } from '../../data/scoutData';

const ImageSection = ({ title, src, alt, fallback }) => {
  return (
    <div style={{
      background: scoutTheme.colors.cardBackground,
      borderRadius: '16px',
      padding: scoutTheme.spacing.cardPadding,
      marginBottom: scoutTheme.spacing.sectionMargin,
      boxShadow: scoutTheme.shadows.card,
      border: `1px solid ${scoutTheme.colors.border}`,
      textAlign: 'center'
    }}>
      <h2 style={{
        fontSize: scoutTheme.typography.sectionTitle.fontSize,
        fontWeight: scoutTheme.typography.sectionTitle.fontWeight,
        color: scoutTheme.colors.textPrimary,
        margin: '0 0 24px 0'
      }}>
        {title}
      </h2>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        background: scoutTheme.colors.imagePlaceholder,
        borderRadius: '8px',
        border: `2px dashed ${scoutTheme.colors.imageBorder}`
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
          color: scoutTheme.colors.textMuted,
          fontSize: '16px',
          padding: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {fallback.icon}
          </div>
          <p>{fallback.text}</p>
          <p style={{ fontSize: scoutTheme.typography.body.fontSize, marginTop: '8px' }}>
            {fallback.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageSection;