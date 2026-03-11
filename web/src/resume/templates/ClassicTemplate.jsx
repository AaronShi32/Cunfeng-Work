import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './classic.module.css';

/**
 * 经典简洁简历模板
 * 接收解析后的结构化简历数据并渲染为 A4 布局
 */
export default function ClassicTemplate({ resumeData, innerRef }) {
  if (!resumeData) return null;

  const { header, sections } = resumeData;

  return (
    <div className={styles.a4Paper} ref={innerRef}>
      <div className={styles.resumeContent}>
        {/* 头部 */}
        <h1 className={styles.headerName}>{header.name}</h1>
        {header.contacts && (
          <div className={styles.headerContacts}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {header.contacts}
            </ReactMarkdown>
          </div>
        )}
        <hr className={styles.divider} />

        {/* 各分区 */}
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <div className={styles.sectionBody}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
