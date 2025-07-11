
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
  const { sidebarOpen } = useTypedSelector(state => state.ui);
  const isMobile = useIsMobile();

  return (
    <AnimatePresence>
      {(sidebarOpen || !isMobile) && (
        <>
          <SidebarOverlay isMobile={isMobile} sidebarOpen={sidebarOpen} />

          {/* Sidebar */}
          <motion.div
            initial={isMobile ? { x: -300 } : { opacity: 0 }}
            animate={isMobile ? { x: 0 } : { opacity: 1 }}
            exit={isMobile ? { x: -300 } : { opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'sticky top-16 h-[calc(100vh-4rem)]'}
              w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
              flex flex-col
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
