import React from 'react';
import { PageLayout } from '../components';
import styles from '../styles/learn.module.css';

export default function Learn() {
  return (
    <PageLayout>
      <section className={styles.topicSection}>
        <h2 className={styles.topicHeading}>AI</h2>
        <p className={styles.topicPlaceholder}>待补充...</p>
      </section>
    </PageLayout>
  );
}
