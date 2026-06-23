import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteTabs } from '../components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import interviewMd from './data/interview-zh.md?raw';
import k8sMd from './data/interview-k8s.md?raw';
import projectMd from './data/interview-project.md?raw';
import baguMd from './data/interview-bagu.md?raw';
import internationalMd from './data/interview-international.md?raw';
import tencentMd from './data/interview-tencent.md?raw';
import systemDesignMd from './data/interview-system-design.md?raw';
import styles from './templates/interview.module.css';

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

const MD_COMPONENTS = {
  code({ className, children }) {
    if (className === 'language-mermaid') {
      return <MermaidBlock code={String(children).trim()} />;
    }
    return <code className={className}>{children}</code>;
  },
};

const SYSTEM_DESIGN_META = [
  { title: '消息队列',     tags: ['Partition', 'Replication', 'ISR', 'Consumer Group'] },
  { title: '分布式配置中心', tags: ['Long Polling', 'DB 轮询', '无主集群', 'Outbox'] },
  { title: 'RPC 框架',    tags: ['动态代理', 'Netty', '负载均衡', '熔断'] },
  { title: '分布式限流',   tags: ['令牌桶', 'Redis Lua', '滑动窗口', '两层限流'] },
  { title: '任务调度',     tags: ['时间轮', '分布式锁', '任务分片', '失败重试'] },
  { title: '电影院票务',   tags: ['Redis SETNX', '状态机', '选座并发', '支付幂等'] },
  { title: 'PubSub 限流', tags: ['Token Bucket', 'Leaky Bucket', 'Ingress/Egress', '背压传播'] },
  { title: '节点监控系统', tags: ['100K QPS', 'Redis ZSet', 'Flink', '告警聚合'] },
];

function parseSystemDesignSections(md) {
  return md
    .split(/\n(?=## \d+\.)/)
    .filter(s => /^## \d+\./.test(s.trim()));
}

function parseDetailBlocks(sectionMd) {
  const blocks = [];
  const re = /<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g;
  let m;
  while ((m = re.exec(sectionMd)) !== null) {
    blocks.push({ summary: m[1].trim(), content: m[2].trim() });
  }
  return blocks;
}

function SystemDesignGrid({ md }) {
  const [openSection, setOpenSection] = useState(null);
  const sections = parseSystemDesignSections(md);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setOpenSection(null); };
    if (openSection) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [openSection]);

  const MODAL_COMPONENTS = {
    ...MD_COMPONENTS,
    details({ children }) {
      return <div className={styles.sdSection}>{children}</div>;
    },
    summary({ children }) {
      return <h3 className={styles.sdSectionTitle}>{children}</h3>;
    },
  };

  return (
    <>
      <div className={styles.sdGrid}>
        {sections.map((section, i) => {
          const titleMatch = section.match(/^## \d+\. (.+)/m);
          const title = titleMatch ? titleMatch[1] : `题目 ${i + 1}`;
          return (
            <div key={i} className={styles.sdCard} onClick={() => setOpenSection({ section, meta: SYSTEM_DESIGN_META[i] || { title: `题目 ${i + 1}`, tags: [] } })}>
              <div className={styles.sdCardNum}>{i + 1}</div>
              <h3 className={styles.sdCardTitle}>{(SYSTEM_DESIGN_META[i] || {}).title || title}</h3>
              <div className={styles.sdCardTags}>
                {(SYSTEM_DESIGN_META[i]?.tags || []).map(tag => (
                  <span key={tag} className={styles.sdTag}>{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {openSection && (
        <div className={styles.sdModal} onClick={() => setOpenSection(null)}>
          <div className={styles.sdModalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.sdModalHeader}>
              <span className={styles.sdModalTitle}>{openSection.meta.title}</span>
              <button className={styles.sdModalClose} onClick={() => setOpenSection(null)}>✕</button>
            </div>
            <div className={styles.sdStepsRow}>
              {parseDetailBlocks(openSection.section).map((block, i) => (
                <div key={i} className={styles.sdStepCol}>
                  <div className={styles.sdStepHeader}>
                    <span className={styles.sdStepNum}>{i + 1}</span>
                    <span className={styles.sdStepLabel}>{block.summary}</span>
                  </div>
                  <div className={styles.sdStepBody}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={MD_COMPONENTS}
                    >
                      {block.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
  const isSystemDesign = activeDoc === 'system-design';

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

      {isSystemDesign ? (
        <SystemDesignGrid md={currentMd} />
      ) : (
        <div className={styles.paper}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={MD_COMPONENTS}
          >
            {currentMd}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
