import React from 'react';
import { fcsTheme } from '../../data/fcsData';

const ImageSection = ({ title, src, alt, fallback, link, linkText }) => {
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
      
      {/* 显示链接（如果存在） */}
      {link && (
        <div style={{ marginBottom: '20px' }}>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: fcsTheme.colors.buttonPrimary,
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              padding: '8px 16px',
              border: `1px solid ${fcsTheme.colors.buttonPrimary}`,
              borderRadius: '8px',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = fcsTheme.colors.buttonPrimary;
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = fcsTheme.colors.buttonPrimary;
            }}
          >
            📖 {linkText || '查看详情'}
          </a>
        </div>
      )}
      
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