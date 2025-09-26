import React from 'react';
import { fcsTheme } from '../../data/fcsData';

const NavigationButton = ({ onClick, children }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: '40px'
    }}>
      <button
        onClick={onClick}
        style={{
          background: fcsTheme.colors.buttonPrimary,
          color: '#ffffff',
          border: 'none',
          padding: '12px 32px',
          borderRadius: '8px',
          fontSize: fcsTheme.typography.body.fontSize,
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: fcsTheme.shadows.button
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = fcsTheme.colors.buttonPrimaryHover;
          e.currentTarget.style.boxShadow = fcsTheme.shadows.buttonHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = fcsTheme.colors.buttonPrimary;
          e.currentTarget.style.boxShadow = fcsTheme.shadows.button;
        }}
      >
        {children}
      </button>
    </div>
  );
};

export default NavigationButton;