import React, { useState, useEffect } from 'react';
import ClassicTemplate from './templates/ClassicTemplate';
import { parseResumeMd } from './utils/parseResume';
import resumeMdUrl from './data/resume-zh.md?raw';
import { SiteTabs } from '../components';
import styles from './templates/classic.module.css';

export default function ResumePage() {
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const data = parseResumeMd(resumeMdUrl);
    setResumeData(data);
  }, []);

  return (
    <div className={styles.resumeWrapper}>
      <div className={styles.topNav}>
        <SiteTabs />
      </div>

      {resumeData && (
        <ClassicTemplate resumeData={resumeData} />
      )}
    </div>
  );
}
