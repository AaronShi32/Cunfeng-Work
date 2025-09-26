import React from 'react';
import { asiTheme } from '../../data/asiData';

const NavigationButton = ({ onClick, children }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: '40px'
    }}>
      <button
        onClick={onClick}
        style={{
          background: asiTheme.colors.buttonPrimary,
          color: '#ffffff',
          border: 'none',
          padding: '12px 32px',
          borderRadius: '8px',
          fontSize: asiTheme.typography.body.fontSize,
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: asiTheme.shadows.button
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = asiTheme.colors.buttonPrimaryHover;
          e.currentTarget.style.boxShadow = asiTheme.shadows.buttonHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = asiTheme.colors.buttonPrimary;
          e.currentTarget.style.boxShadow = asiTheme.shadows.button;
        }}
      >
        {children}
      </button>
    </div>
  );
};

export default NavigationButton;