import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteTabs } from '../components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import interviewMd from './data/interview-zh.md?raw';
import k8sMd from './data/interview-k8s.md?raw';
import styles from './templates/interview.module.css';

const DOC_TABS = [
  { key: 'general', label: '综合面试', md: interviewMd },
  { key: 'k8s', label: 'K8s / 容器', md: k8sMd },
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
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {currentMd}
        </ReactMarkdown>
      </div>
    </div>
  );
}
