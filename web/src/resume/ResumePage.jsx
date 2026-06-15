import React, { useState, useEffect } from 'react';
import ClassicTemplate from './templates/ClassicTemplate';
import { parseResumeMd } from './utils/parseResume';
import resumeOriginal from './data/resume-zh.md?raw';
import resumeStar from './data/resume-zh-star.md?raw';
import { SiteTabs } from '../components';
import styles from './templates/classic.module.css';

export default function ResumePage() {
  const [resumeData, setResumeData] = useState(null);
  const [isStar, setIsStar] = useState(false);

  useEffect(() => {
    const md = isStar ? resumeStar : resumeOriginal;
    const data = parseResumeMd(md);
    setResumeData(data);
  }, [isStar]);

  return (
    <div className={styles.resumeWrapper}>
      <div className={styles.topNav}>
        <SiteTabs />
      </div>

      <div className={styles.toolbar}>
        <button
          className={`${styles.backButton} ${isStar ? styles.backButtonActive : ''}`}
          onClick={() => setIsStar(!isStar)}
        >
          {isStar ? '✦ STAR 版' : '○ 原始版'}
        </button>
      </div>

      {resumeData && (
        <ClassicTemplate resumeData={resumeData} />
      )}
    </div>
  );
}
