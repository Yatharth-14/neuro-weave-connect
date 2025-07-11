
import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleSidebar } from '../../store/slices/uiSlice';

interface SidebarOverlayProps {
  isMobile: boolean;
  sidebarOpen: boolean;
}

const SidebarOverlay: React.FC<SidebarOverlayProps> = ({ isMobile, sidebarOpen }) => {
  const dispatch = useDispatch();

  if (!isMobile || !sidebarOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut'
      }}
      className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 will-change-transform"
      onClick={() => dispatch(toggleSidebar())}
      style={{
        transform: 'translateZ(0)', // Force hardware acceleration
      }}
    />
  );
};

export default SidebarOverlay;
