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
import systemDesignMd from './data/interview-system-design.md?raw';
import xiaomaMd from './data/interview-xiaoma.md?raw';
import companyMd from './data/interview-company.md?raw';
import shanganMd from './data/interview-shangan.md?raw';
import styles from './templates/interview.module.css';

mermaid.initialize({ startOnLoad: false, theme: 'neutral' });

// 把标题文本转成锚点 id（GitHub 风格，保留中文）
function baseSlug(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '');
}

// 去掉标题里的 markdown 行内语法，使其与渲染后的纯文本一致
function cleanHeadingText(raw) {
  return String(raw)
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_]/g, '')
    .trim();
}

// 生成带去重后缀的 slugger（与 rehype 插件保持同样的处理顺序）
function createSlugger() {
  const seen = new Map();
  return (text) => {
    const slug = baseSlug(text) || 'section';
    if (seen.has(slug)) {
      const n = seen.get(slug) + 1;
      seen.set(slug, n);
      return `${slug}-${n}`;
    }
    seen.set(slug, 0);
    return slug;
  };
}

function hastText(node) {
  if (node.type === 'text') return node.value || '';
  if (node.children) return node.children.map(hastText).join('');
  return '';
}

// 内联 rehype 插件：给每个标题加上与目录一致的 id
function rehypeHeadingIds() {
  return (tree) => {
    const slug = createSlugger();
    const walk = (node) => {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        const id = slug(hastText(node));
        node.properties = node.properties || {};
        if (!node.properties.id) node.properties.id = id;
      }
      if (node.children) node.children.forEach(walk);
    };
    walk(tree);
  };
}

// 从 markdown 解析出 h2 / h3 标题，生成目录条目
function buildToc(md) {
  const slug = createSlugger();
  const items = [];
  md.split('\n').forEach((line) => {
    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (!m) return;
    const level = m[1].length;
    const text = cleanHeadingText(m[2]);
    // 标题 id 必须按文档顺序对所有标题取 slug，才能与正文一致
    const id = slug(text);
    if (level === 2 || level === 3) {
      if (text === '目录') return;
      items.push({ level, text, id });
    }
  });
  return items;
}

function DocToc({ md }) {
  const items = buildToc(md);
  if (items.length === 0) return null;

  // 构建二级目录：h2 作为分组标题，h3 中以数字开头的作为问题条目
  const sections = [];
  let current = null;
  items.forEach((item) => {
    if (item.level === 2) {
      current = { ...item, children: [] };
      sections.push(current);
    } else if (item.level === 3 && current && /^\d+\./.test(item.text)) {
      current.children.push(item);
    }
  });

  // 如果没有任何 h3 问题条目，回退展示所有 h2
  const hasQuestions = sections.some((s) => s.children.length > 0);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.history?.replaceState) {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  return (
    <nav className={styles.toc} aria-label="目录">
      <div className={styles.tocTitle}>目录</div>
      <ul className={styles.tocList}>
        {hasQuestions
          ? sections.map((section) => (
              <li key={section.id} className={styles.tocItem}>
                <a href={`#${section.id}`} onClick={(e) => handleClick(e, section.id)}>
                  {section.text}
                </a>
                {section.children.length > 0 && (
                  <ul className={styles.tocSubList}>
                    {section.children.map((q) => (
                      <li key={q.id} className={styles.tocItemSub}>
                        <a href={`#${q.id}`} onClick={(e) => handleClick(e, q.id)}>
                          {q.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          : sections.map((item, idx) => (
              <li key={item.id} className={styles.tocItem}>
                <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                  {idx + 1}. {item.text}
                </a>
              </li>
            ))}
      </ul>
    </nav>
  );
}

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
            <div className={styles.sdStepsCol}>
              {parseDetailBlocks(openSection.section).map((block, i) => (
                <div key={i} className={styles.sdStepRow}>
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
  { key: 'xiaoma', label: '面经', md: xiaomaMd },
  { key: 'bagu', label: '八股文', md: baguMd },
  { key: 'international', label: '竞品分析', md: internationalMd },
  { key: 'system-design', label: '系统设计', md: systemDesignMd },
  { key: 'company', label: '公司调研', md: companyMd },
];

// 自然资源部信息中心专属 tab（后续可继续在此扩展）
export const SHANGAN_TABS = [
  { key: 'shangan', label: '自然资源部信息中心', md: shanganMd },
];

export default function InterviewPage({ tabs = DOC_TABS }) {
  const navigate = useNavigate();
  const [activeDoc, setActiveDoc] = useState(tabs[0]?.key ?? 'general');

  const currentMd = tabs.find((t) => t.key === activeDoc)?.md ?? tabs[0]?.md;
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
          {tabs.map((tab) => (
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
        <div className={styles.docBody}>
          <DocToc key={activeDoc} md={currentMd} />
          <div className={styles.paper}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHeadingIds]}
              components={MD_COMPONENTS}
            >
              {currentMd}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
