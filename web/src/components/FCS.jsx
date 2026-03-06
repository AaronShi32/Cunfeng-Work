import React from 'react';
import { useNavigate } from 'react-router-dom';
import ZoomableImageModal from './ZoomableImageModal';
import fcsImage from '../../img/FCS/FCS-2026-01-20-1331.png';

export default function FCS() {
  const navigate = useNavigate();

  return (
    <ZoomableImageModal
      imageSrc={fcsImage}
      imageAlt="FCS Architecture"
      isOpen
      onClose={() => navigate(-1)}
    />
  );
}