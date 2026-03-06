import React from 'react';
import btn from '../styles/button.module.css';
import anim from '../styles/animation.module.css';

export default function TechStackBar({ title, techs }) {
  return (
    <div className={`${btn.techBar} ${anim.animateSectionDelay2}`}>
      <h3 className={btn.techBarTitle}>{title || '技术栈'}</h3>
      <div className={btn.techTags}>
        {techs.map(tech => (
          <div key={tech.name} className={btn.techTag}>
            <span className={btn.techTagIcon}>{tech.icon}</span>
            {tech.name}
          </div>
        ))}
      </div>
    </div>
  );
}
