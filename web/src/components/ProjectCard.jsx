import React from 'react';
import { Link } from 'react-router-dom';
import card from '../styles/card.module.css';
import anim from '../styles/animation.module.css';

export default function ProjectCard({ icon, logo, logoAlt, logoSize, title, description, to, onClick }) {
  const content = (
    <>
      {logo ? (
        <img
          src={logo}
          alt={logoAlt || title}
          className={card.cardLogo}
          style={{ width: logoSize || 48, height: logoSize || 48 }}
        />
      ) : (
        <div className={card.cardIcon}>{icon}</div>
      )}
      <h3 className={card.cardTitle}>{title}</h3>
      {description && <p className={card.cardDesc} dangerouslySetInnerHTML={{ __html: description }} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${card.card} ${anim.animateCard}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`${card.card} ${anim.animateCard}`} onClick={onClick}>
      {content}
    </div>
  );
}
