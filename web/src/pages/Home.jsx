import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import alibabaLogo from '../../img/Others/Alibaba.png';
import microsoftLogo from '../../img/Others/Microsoft.svg';
import { PageLayout, ProjectCard, TechStackBar, Footer } from '../components';
import layout from '../styles/layout.module.css';

const TECHS = [
  { name: 'Java/C#/Python', icon: '⚛️' },
  { name: 'Distributed System', icon: '⚡' },
  { name: 'AI Agent/MCP', icon: '🗺️' },
  { name: 'Azure/Alibaba Cloud', icon: '☁️' },
];

const TAP_THRESHOLD = 5;
const TAP_TIMEOUT_MS = 2000;
const MENU_AUTO_HIDE_MS = 6000;

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 999,
  background: 'transparent',
};

const menuStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  background: 'rgba(15, 23, 42, 0.95)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  padding: '28px 36px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  border: '1px solid rgba(255,255,255,0.15)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  animation: 'fadeIn 0.25s ease-out',
};

const menuItemStyle = {
  display: 'block',
  padding: '14px 32px',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.08)',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center',
  transition: 'background 0.2s',
  cursor: 'pointer',
  border: 'none',
  fontFamily: 'inherit',
};

function HiddenMenu({ onClose }) {
  const navigate = useNavigate();

  const go = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={menuStyle}>
        <button
          style={menuItemStyle}
          onClick={() => go('/resume')}
          onMouseEnter={(e) => (e.target.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={(e) => (e.target.style.background = 'rgba(255,255,255,0.08)')}
        >
          📄 Resume
        </button>
        <button
          style={menuItemStyle}
          onClick={() => go('/interview')}
          onMouseEnter={(e) => (e.target.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={(e) => (e.target.style.background = 'rgba(255,255,255,0.08)')}
        >
          💬 Interview
        </button>
      </div>
    </>
  );
}

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);
  const hideTimer = useRef(null);

  const handleTitleClick = useCallback(() => {
    tapCount.current += 1;

    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, TAP_TIMEOUT_MS);

    if (tapCount.current >= TAP_THRESHOLD) {
      tapCount.current = 0;
      clearTimeout(tapTimer.current);
      setMenuVisible(true);

      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setMenuVisible(false), MENU_AUTO_HIDE_MS);
    }
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
    clearTimeout(hideTimer.current);
  }, []);

  return (
    <PageLayout
      title={<span onClick={handleTitleClick} style={{ cursor: 'default', userSelect: 'none' }}>Cunfeng Shi</span>}
      subtitle="工作项目经历"
    >
      <div className={layout.cardGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <ProjectCard logo={alibabaLogo} logoAlt="Alibaba" logoSize={64} title="Alibaba" to="/alibaba" />
        <ProjectCard logo={microsoftLogo} logoAlt="Microsoft" logoSize={48} title="Microsoft" to="/microsoft" />
      </div>
      <TechStackBar techs={TECHS} />
      <Footer />
      {menuVisible && <HiddenMenu onClose={closeMenu} />}
    </PageLayout>
  );
}
