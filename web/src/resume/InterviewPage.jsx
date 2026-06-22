import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteTabs } from '../components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'neutral' });

function MermaidBlock({ code }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      mermaid.render(id, code).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      });
    }
  }, [code]);
  return <div ref={ref} style={{ overflowX: 'auto', margin: '1rem 0' }} />;
}
import interviewMd from './data/interview-zh.md?raw';
import k8sMd from './data/interview-k8s.md?raw';
import projectMd from './data/interview-project.md?raw';
import baguMd from './data/interview-bagu.md?raw';
import internationalMd from './data/interview-international.md?raw';
import tencentMd from './data/interview-tencent.md?raw';
import systemDesignMd from './data/interview-system-design.md?raw';
import styles from './templates/interview.module.css';

const DOC_TABS = [
  { key: 'general', label: '技术难点', md: interviewMd },
  { key: 'k8s', label: 'K8s', md: k8sMd },
  { key: 'project', label: '项目专题', md: projectMd },
  { key: 'bagu', label: '八股文', md: baguMd },
  { key: 'international', label: '竞品分析', md: internationalMd },
  { key: 'tencent', label: '腾讯总监面', md: tencentMd },
  { key: 'system-design', label: '系统设计', md: systemDesignMd },
];

export default function InterviewPage() {
  const navigate = useNavigate();
  const [activeDoc, setActiveDoc] = useState('general');

  const currentMd = DOC_TABS.find((t) => t.key === activeDoc)?.md ?? interviewMd;

  return (
    <div className={styles.wrapper}>
      <div className={styles.topNav}>
        <SiteTabs />
      </div>

      <div className={styles.toolbar}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← 返回
        </button>
        <div className={styles.docTabs}>
          {DOC_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.docTab} ${activeDoc === tab.key ? styles.docTabActive : ''}`}
              onClick={() => setActiveDoc(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.paper}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ className, children }) {
              if (className === 'language-mermaid') {
                return <MermaidBlock code={String(children).trim()} />;
              }
              return <code className={className}>{children}</code>;
            },
          }}
        >
          {currentMd}
        </ReactMarkdown>
      </div>
    </div>
  );
}
