
import React from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-mobile';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';
import SidebarOverlay from './SidebarOverlay';

const Sidebar: React.FC = () => {
  const { sidebarOpen, sidebarCollapsed } = useTypedSelector(state => state.ui);
  const isMobile = useIsMobile();

  // On mobile and desktop, show/hide based on sidebarOpen only
  const shouldShow = sidebarOpen;

  // Properly typed animation variants
  const sidebarVariants: Variants = {
    hidden: { 
      x: -300, 
      opacity: 0 
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 40,
        mass: 0.8
      }
    },
    exit: { 
      x: -300, 
      opacity: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 40,
        mass: 0.8
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {shouldShow && (
        <>
          <SidebarOverlay isMobile={isMobile} sidebarOpen={sidebarOpen} />

          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'sticky top-16 h-[calc(100vh-4rem)]'}
              w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
              flex flex-col will-change-transform
            `}
            style={{
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
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
