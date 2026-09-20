import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageLayout } from '../components';
import styles from '../styles/learn.module.css';
import aiAgentNotes from './data/learn-ai.md?raw';

const NOTES = [
  {
    id: 'ai-agent',
    title: 'AI Agent 架构与开发',
    category: 'AI Engineering',
    summary: '从 Agent Skill、MCP 和 RAG，到模型微调与本地推理的学习记录。',
    detail: '持续更新',
    content: aiAgentNotes,
  },
];

export default function Learn() {
  const [activeId, setActiveId] = useState(NOTES[0].id);
  const activeNote = NOTES.find((note) => note.id === activeId) ?? NOTES[0];

  return (
    <PageLayout>
      <div className={styles.workspace}>
        <aside className={styles.library} aria-label="学习笔记列表">
          <div className={styles.libraryHeader}>
            <span>笔记库</span>
            <span className={styles.noteCount}>{NOTES.length}</span>
          </div>

          <div className={styles.noteList}>
            {NOTES.map((note) => (
              <button
                key={note.id}
                type="button"
                className={`${styles.noteButton} ${activeId === note.id ? styles.noteButtonActive : ''}`}
                aria-pressed={activeId === note.id}
                onClick={() => setActiveId(note.id)}
              >
                <span className={styles.noteCategory}>{note.category}</span>
                <strong>{note.title}</strong>
                <span className={styles.noteDetail}>{note.detail}</span>
              </button>
            ))}
          </div>
        </aside>

        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <span>{activeNote.category}</span>
            <h2>{activeNote.title}</h2>
            <p>{activeNote.summary}</p>
          </header>

          <div className={styles.markdown}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeNote.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </PageLayout>
  );
}
