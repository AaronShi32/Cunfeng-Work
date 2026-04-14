import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageLayout } from '../components';
import styles from '../styles/learn.module.css';
import aiContent from './data/learn-ai.md?raw';

const CATEGORIES = [
  { key: 'ai', label: 'AI', content: aiContent },
];

export default function Learn() {
  const [active, setActive] = useState('ai');
  const current = CATEGORIES.find((c) => c.key === active);

  return (
    <PageLayout>
      <div className={styles.layout}>
        <nav className={styles.sidebar}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`${styles.sideTab} ${active === cat.key ? styles.sideTabActive : ''}`}
              onClick={() => setActive(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <section className={styles.mainContent}>
          {current && (
            <div className={styles.mdContent}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {current.content}
              </ReactMarkdown>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
