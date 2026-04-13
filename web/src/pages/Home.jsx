import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import alibabaLogo from '../../img/Others/Alibaba.png';
import microsoftLogo from '../../img/Others/Microsoft.svg';
import { PageLayout, ProjectCard, TechStackBar, Footer } from '../components';
import layout from '../styles/layout.module.css';
import home from '../styles/home.module.css';

const TECHS = [
  { name: 'Cloud Infrastructure', icon: '☁️' },
  { name: 'Distributed Systems', icon: '⚡' },
  { name: 'AI Agent / MCP', icon: '🗺️' },
  { name: 'Platform Engineering', icon: '🧭' },
];

const FOCUS_AREAS = [
  {
    title: '云平台与基础设施',
    description: '围绕 Azure / Alibaba Cloud 的平台能力、服务治理与稳定性建设。',
  },
  {
    title: '分布式系统',
    description: '关注服务架构、任务调度、可观测性与复杂系统的工程落地。',
  },
  {
    title: 'AI 工程实践',
    description: '结合 AI Agent、MCP 与开发流程，探索更高效的工程协作方式。',
  },
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
  background: 'rgba(34, 34, 59, 0.95)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  padding: '28px 36px',
  boxShadow: '0 20px 60px rgba(34, 34, 59, 0.4)',
  border: '1px solid rgba(154, 140, 152, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  animation: 'fadeIn 0.25s ease-out',
};

const menuItemStyle = {
  display: 'block',
  padding: '14px 32px',
  borderRadius: '10px',
  background: 'rgba(201, 173, 167, 0.15)',
  color: '#f2e9e4',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center',
  transition: 'background 0.2s',
  cursor: 'pointer',
  border: 'none',
  fontFamily: "'Roboto Mono', monospace",
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
          onMouseEnter={(e) => (e.target.style.background = 'rgba(201, 173, 167, 0.3)')}
          onMouseLeave={(e) => (e.target.style.background = 'rgba(201, 173, 167, 0.15)')}
        >
          📄 Resume
        </button>
        <button
          style={menuItemStyle}
          onClick={() => go('/interview')}
          onMouseEnter={(e) => (e.target.style.background = 'rgba(201, 173, 167, 0.3)')}
          onMouseLeave={(e) => (e.target.style.background = 'rgba(201, 173, 167, 0.15)')}
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
      subtitle="平台工程 / 分布式系统 / AI 工程实践"
    >
      <section className={home.heroPanel}>
        <p className={home.heroIntro}>
          这是一个以内容为中心的个人站点，主要整理我的项目经历、简历信息，以及持续学习中的一些技术沉淀。
        </p>
        <div className={home.ctaRow}>
          <Link to="/resume" className={`${home.ctaButton} ${home.ctaPrimary}`}>
            Resume
          </Link>
          <Link to="/projects" className={`${home.ctaButton} ${home.ctaSecondary}`}>
            Projects
          </Link>
          <Link to="/learn" className={`${home.ctaButton} ${home.ctaSecondary}`}>
            Learn
          </Link>
        </div>
      </section>

      <div className={home.focusGrid}>
        {FOCUS_AREAS.map((item) => (
          <div key={item.title} className={home.focusCard}>
            <h3 className={home.focusTitle}>{item.title}</h3>
            <p className={home.focusDescription}>{item.description}</p>
          </div>
        ))}
      </div>

      <div className={layout.cardGrid}>
        <ProjectCard logo={microsoftLogo} logoAlt="Microsoft" logoSize={48} title="Microsoft" description="代表性平台与服务工程实践" to="/microsoft" />
        <ProjectCard logo={alibabaLogo} logoAlt="Alibaba" logoSize={64} title="Alibaba" description="云网络与实例迁移相关项目经验" to="/alibaba" />
      </div>

      <TechStackBar techs={TECHS} title="核心方向" />
      <Footer />
      {menuVisible && <HiddenMenu onClose={closeMenu} />}
    </PageLayout>
  );
}
