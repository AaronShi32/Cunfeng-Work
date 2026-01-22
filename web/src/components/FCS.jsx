import React from 'react';
import fcsImage from '../../img/FCS/FCS-2026-01-20-1331.png';

export default function FCS({ onBack }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #999db3ff 0%, #030303ff 100%)',
      padding: '60px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* 返回按钮 */}
      <button
        onClick={onBack || (() => window.history.back())}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255,255,255,0.2)',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '12px 32px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
        }}
      >
        ← 返回
      </button>

      {/* 图片容器 */}
      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <img
          src={fcsImage}
          alt="FCS Architecture"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '600px',
            borderRadius: '8px',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
}