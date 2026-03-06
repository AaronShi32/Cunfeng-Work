import React from 'react';
import { useNavigate } from 'react-router-dom';
import ZoomableImageModal from './ZoomableImageModal';
import asiImage from '../../img/ASI/ASI-2026-01-20-1022.png';

export default function ASI() {
  const navigate = useNavigate();

  return (
    <ZoomableImageModal
      imageSrc={asiImage}
      imageAlt="ASI Architecture"
      isOpen
      onClose={() => navigate(-1)}
    />
  );
}
