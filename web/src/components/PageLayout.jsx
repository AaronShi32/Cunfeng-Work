import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteTabs from './SiteTabs';
import layout from '../styles/layout.module.css';
import btn from '../styles/button.module.css';
import anim from '../styles/animation.module.css';

export default function PageLayout({ children, backTo }) {
  const navigate = useNavigate();

  return (
    <div className={layout.pageDark}>
      <div className={layout.container}>
        <SiteTabs />

        {backTo && (
          <div style={{ marginBottom: '30px' }} className={anim.animateFadeIn}>
            <button className={btn.backButton} onClick={() => navigate(backTo)}>
              ← 返回
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
