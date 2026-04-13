import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/siteTabs.module.css';

const TAB_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Resume', path: '/resume' },
  { label: 'Learn', path: '/learn' },
];

const PROJECT_PATHS = [
  '/projects',
  '/microsoft',
  '/alibaba',
  '/samples',
  '/instance-migration',
  '/asi',
  '/hdinsight',
  '/scout',
  '/fcs',
  '/fabric-notebook',
];

function getActiveTab(pathname) {
  if (pathname === '/') {
    return '/';
  }

  if (pathname.startsWith('/resume') || pathname.startsWith('/interview')) {
    return '/resume';
  }

  if (PROJECT_PATHS.some((path) => pathname.startsWith(path))) {
    return '/projects';
  }

  if (pathname.startsWith('/learn') || pathname.startsWith('/blog')) {
    return '/learn';
  }

  return '';
}

export default function SiteTabs() {
  const { pathname } = useLocation();
  const activeTab = getActiveTab(pathname);

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        <span className={styles.brandMark}>CF</span>
        <span className={styles.brandText}>Cunfeng Shi</span>
      </Link>

      <div className={styles.tabs}>
        {TAB_ITEMS.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`${styles.tab} ${activeTab === tab.path ? styles.tabActive : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
