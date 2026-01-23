import React, { useState, useRef } from 'react';
import fcsImage from '../../img/FCS/FCS-2026-01-20-1331.png';

export default function FCS({ onBack }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(1, Math.min(5, zoom * delta));
    setZoom(newZoom);
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
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
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          maxWidth: '800px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
        }}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
          }}
        >
          <img
            src={fcsImage}
            alt="FCS Architecture"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '600px',
              borderRadius: '8px',
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
              draggable: false
            }}
          />
        </div>

        {/* 重置缩放按钮 */}
        {zoom > 1 && (
          <button
            onClick={resetZoom}
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1d4ed8';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            重置 ({Math.round(zoom * 100)}%)
          </button>
        )}

        {/* 缩放提示信息 */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            background: 'rgba(0, 0, 0, 0.6)',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            zIndex: 10,
            textAlign: 'left'
          }}
        >
          <div>鼠标滚轮: 缩放</div>
          {zoom > 1 && <div>拖动: 移动图片</div>}
        </div>
      </div>
    </div>
  );
}