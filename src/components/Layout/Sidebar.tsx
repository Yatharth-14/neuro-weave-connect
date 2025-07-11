
import React from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-mobile';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';
import SidebarOverlay from './SidebarOverlay';

const Sidebar: React.FC = () => {
  const { sidebarOpen, sidebarCollapsed } = useTypedSelector(state => state.ui);
  const isMobile = useIsMobile();

  // On mobile, show/hide based on sidebarOpen
  // On desktop, always show but collapse/expand based on sidebarCollapsed
  const shouldShow = isMobile ? sidebarOpen : true;
  const sidebarWidth = sidebarCollapsed && !isMobile ? 'w-16' : 'w-64';

  return (
    <AnimatePresence>
      {shouldShow && (
        <>
          <SidebarOverlay isMobile={isMobile} sidebarOpen={sidebarOpen} />

          {/* Sidebar */}
          <motion.div
            initial={isMobile ? { x: -300 } : { width: sidebarCollapsed ? 64 : 256 }}
            animate={isMobile ? { x: 0 } : { width: sidebarCollapsed ? 64 : 256 }}
            exit={isMobile ? { x: -300 } : { width: 64 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'sticky top-16 h-[calc(100vh-4rem)]'}
              ${sidebarWidth} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
              flex flex-col transition-all duration-300 ease-in-out
            `}
          >
            <SidebarHeader />
            <SidebarNavigation />
            <SidebarFooter />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
