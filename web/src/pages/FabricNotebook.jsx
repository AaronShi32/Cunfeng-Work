import React, { useState } from 'react';
import { PageLayout, ZoomableImageModal } from '../components';
import layout from '../styles/layout.module.css';
import anim from '../styles/animation.module.css';
import notebookImage from '../../img/Fabric/Notebook-RetriableSession-2025-09-04-1233.png';

export default function FabricNotebook() {
  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout title="Fabric Notebook" subtitle="Microsoft Fabric Notebook 服务" backTo="/microsoft">
      <div className={layout.contentGrid}>
        <div className={`${layout.section} ${anim.animateSection}`}>
          <div className={layout.sectionHeader}>
            <div className={layout.sectionIcon}>📓</div>
            <h2 className={layout.sectionTitle}>架构图</h2>
          </div>
          <img
            src={notebookImage}
            alt="Fabric Notebook Architecture"
            className={layout.archImage}
            onClick={() => setShowModal(true)}
          />
          <p className={layout.archHint}>点击图片查看大图</p>
        </div>
      </div>

      {showModal && (
        <ZoomableImageModal
          imageSrc={notebookImage}
          imageAlt="Fabric Notebook Architecture"
          isOpen
          onClose={() => setShowModal(false)}
        />
      )}
    </PageLayout>
  );
}
