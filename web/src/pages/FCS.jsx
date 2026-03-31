import React, { useState } from 'react';
import { PageLayout, ZoomableImageModal } from '../components';
import layout from '../styles/layout.module.css';
import anim from '../styles/animation.module.css';
import fcsImage from '../../img/FCS/FCS-2026-01-20-1331.png';

export default function FCS() {
  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout title="FCS" subtitle="Microsoft Fabric 容器服务管理平台" backTo="/microsoft">
      <div className={layout.contentGrid}>
        <div className={`${layout.section} ${anim.animateSection}`}>
          <div className={layout.sectionHeader}>
            <div className={layout.sectionIcon}>🐳</div>
            <h2 className={layout.sectionTitle}>架构图</h2>
          </div>
          <img
            src={fcsImage}
            alt="FCS Architecture"
            className={layout.archImage}
            onClick={() => setShowModal(true)}
          />
          <p className={layout.archHint}>点击图片查看大图</p>
        </div>
      </div>

      {showModal && (
        <ZoomableImageModal
          imageSrc={fcsImage}
          imageAlt="FCS Architecture"
          isOpen
          onClose={() => setShowModal(false)}
        />
      )}
    </PageLayout>
  );
}
