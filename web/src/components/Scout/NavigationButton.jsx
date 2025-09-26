import React from 'react';
import { scoutTheme } from '../../data/scoutData';

const NavigationButton = ({ onClick, children }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: '40px'
    }}>
      <button
        onClick={onClick}
        style={{
          background: scoutTheme.colors.buttonPrimary,
          color: '#ffffff',
          border: 'none',
          padding: '12px 32px',
          borderRadius: '8px',
          fontSize: scoutTheme.typography.body.fontSize,
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: scoutTheme.shadows.button
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = scoutTheme.colors.buttonPrimaryHover;
          e.currentTarget.style.boxShadow = scoutTheme.shadows.buttonHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = scoutTheme.colors.buttonPrimary;
          e.currentTarget.style.boxShadow = scoutTheme.shadows.button;
        }}
      >
        {children}
      </button>
    </div>
  );
};

export default NavigationButton;