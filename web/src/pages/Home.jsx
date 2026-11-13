import React, { useState } from 'react';
import { PageLayout } from '../components';
import home from '../styles/home.module.css';
import homeMd from './data/home.md?raw';

function parseHomeMd(md) {
  const lines = md.split('\n');
  const parts = []; // { type: 'text' | 'divider', text?: string }

  for (const line of lines) {
    if (/^#/.test(line)) continue;
    if (/^---\s*$/.test(line)) {
      parts.push({ type: 'divider' });
      continue;
    }
    const trimmed = line.trim();
    if (trimmed) parts.push({ type: 'text', text: trimmed });
  }
  return { parts };
}

export default function Home() {
  const [language, setLanguage] = useState('zh');
  const sections = homeMd.split(/^---\s*$/m);
  const { parts } = parseHomeMd(sections[language === 'zh' ? 0 : 1] ?? '');

  return (
    <PageLayout>
      <div className={home.content}>
        {parts.map((part, i) =>
          part.type === 'divider'
            ? <hr key={i} className={home.divider} />
            : <p key={i} className={home.paragraph}>{part.text}</p>
        )}
      </div>

      <div className={home.languageToggle} role="group" aria-label="Language">
        <button type="button" className={language === 'zh' ? home.languageActive : ''} aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
        <button type="button" className={language === 'en' ? home.languageActive : ''} aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
      </div>
    </PageLayout>
  );
}
