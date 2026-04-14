import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components';
import home from '../styles/home.module.css';
import anim from '../styles/animation.module.css';
import homeMd from './data/home.md?raw';

function parseHomeMd(md) {
  const lines = md.split('\n');
  const paragraphs = [];

  for (const line of lines) {
    if (/^#/.test(line) || /^---\s*$/.test(line)) continue;
    const trimmed = line.trim();
    if (trimmed) paragraphs.push(trimmed);
  }
  return { paragraphs };
}

const TAP_THRESHOLD = 5;
const TAP_TIMEOUT_MS = 2000;
const MENU_AUTO_HIDE_MS = 6000;

const overlayStyle = { position: 'fixed', inset: 0, zIndex: 999, background: 'transparent' };
const menuStyle = {
  position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  zIndex: 1000, background: 'rgba(34, 34, 59, 0.95)', backdropFilter: 'blur(12px)',
  borderRadius: '16px', padding: '28px 36px', boxShadow: '0 20px 60px rgba(34, 34, 59, 0.4)',
  border: '1px solid rgba(154, 140, 152, 0.3)', display: 'flex', flexDirection: 'column',
  gap: '16px', animation: 'fadeIn 0.25s ease-out',
};
const menuItemStyle = {
  display: 'block', padding: '14px 32px', borderRadius: '10px',
  background: 'rgba(201, 173, 167, 0.15)', color: '#f2e9e4', fontSize: '15px',
  textDecoration: 'none', textAlign: 'center', transition: 'background 0.2s',
  cursor: 'pointer', border: 'none', fontFamily: 'inherit',
};

function HiddenMenu({ onClose }) {
  const navigate = useNavigate();
  const go = (path) => { onClose(); navigate(path); };
  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={menuStyle}>
        <button style={menuItemStyle} onClick={() => go('/interview')}
          onMouseEnter={(e) => (e.target.style.background = 'rgba(201, 173, 167, 0.3)')}
          onMouseLeave={(e) => (e.target.style.background = 'rgba(201, 173, 167, 0.15)')}>
          Interview
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
  const { paragraphs } = parseHomeMd(homeMd);

  const handleTitleClick = useCallback(() => {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, TAP_TIMEOUT_MS);
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
    <PageLayout>
      <div className={home.content}>
        {paragraphs.map((p, i) => (
          <p key={i} className={home.paragraph}>{p}</p>
        ))}
      </div>

      {menuVisible && <HiddenMenu onClose={closeMenu} />}
    </PageLayout>
  );
}
