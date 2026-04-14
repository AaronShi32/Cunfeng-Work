import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteTabs } from '../components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import interviewMd from './data/interview-zh.md?raw';
import styles from './templates/interview.module.css';

export default function InterviewPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.topNav}>
        <SiteTabs />
      </div>

      <div className={styles.toolbar}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← 返回
        </button>
      </div>

      <div className={styles.paper}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {interviewMd}
        </ReactMarkdown>
      </div>
    </div>
  );
}
