import React, { useState } from 'react';
import { PageLayout, ZoomableImageModal } from '../components';
import layout from '../styles/layout.module.css';
import anim from '../styles/animation.module.css';
import scoutImage from '../../img/Scout/Scout-2026-01-20-1022.png';

export default function Scout() {
  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout title="Scout" subtitle="AI-AzureData 智能分析引擎" backTo="/microsoft">
      <div className={layout.contentGrid}>
        <div className={`${layout.section} ${anim.animateSection}`}>
          <div className={layout.sectionHeader}>
            <div className={layout.sectionIcon}>🔍</div>
            <h2 className={layout.sectionTitle}>架构图</h2>
          </div>
          <img
            src={scoutImage}
            alt="Scout Architecture"
            className={layout.archImage}
            onClick={() => setShowModal(true)}
          />
          <p className={layout.archHint}>点击图片查看大图</p>
        </div>
      </div>

      {showModal && (
        <ZoomableImageModal
          imageSrc={scoutImage}
          imageAlt="Scout Architecture"
          isOpen
          onClose={() => setShowModal(false)}
        />
      )}
    </PageLayout>
  );
}
