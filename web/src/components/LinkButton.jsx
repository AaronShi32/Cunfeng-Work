import React from 'react';
import btn from '../styles/button.module.css';

export default function LinkButton({ href, icon, children, variant = 'microsoft' }) {
  const className = variant === 'alibaba' ? btn.linkButtonAlibaba : btn.linkButtonMicrosoft;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {icon && <span className={btn.linkButtonIcon}>{icon}</span>}
      {children}
    </a>
  );
}
