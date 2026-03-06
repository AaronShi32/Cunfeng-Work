import React from 'react';
import { useNavigate } from 'react-router-dom';
import layout from '../styles/layout.module.css';
import btn from '../styles/button.module.css';
import anim from '../styles/animation.module.css';

export default function PageLayout({ title, subtitle, children, backTo }) {
  const navigate = useNavigate();

  return (
    <div className={layout.pageDark}>
      <div className={layout.container}>
        {backTo && (
          <div style={{ marginBottom: '30px' }} className={anim.animateFadeIn}>
            <button className={btn.backButton} onClick={() => navigate(backTo)}>
              ← 返回
            </button>
          </div>
        )}

        <h1 className={`${layout.heroTitle} ${anim.animateFadeIn}`}>{title}</h1>

        {subtitle && (
          <p className={`${layout.subtitle} ${anim.animateFadeIn}`}>{subtitle}</p>
        )}

        {children}
      </div>
    </div>
  );
}
