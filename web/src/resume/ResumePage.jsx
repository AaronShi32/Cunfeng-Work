import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassicTemplate from './templates/ClassicTemplate';
import { parseResumeMd } from './utils/parseResume';
import { exportToPdf } from './utils/exportPdf';
import resumeMdUrl from './data/resume-zh.md?raw';
import styles from './templates/classic.module.css';

export default function ResumePage() {
  const navigate = useNavigate();
  const resumeRef = useRef(null);
  const [resumeData, setResumeData] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const data = parseResumeMd(resumeMdUrl);
    setResumeData(data);
  }, []);

  const handleDownload = async () => {
    if (!resumeRef.current || exporting) return;
    setExporting(true);
    try {
      await exportToPdf(resumeRef.current, `${resumeData?.header?.name || '简历'}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={styles.resumeWrapper}>
      {/* 工具栏 */}
      <div className={styles.toolbar}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← 返回
        </button>
        <button
          className={styles.downloadButton}
          onClick={handleDownload}
          disabled={exporting}
        >
          {exporting ? '导出中...' : '📄 下载 PDF'}
        </button>
      </div>

      {/* 简历预览 */}
      {resumeData && (
        <ClassicTemplate resumeData={resumeData} innerRef={resumeRef} />
      )}
    </div>
  );
}
