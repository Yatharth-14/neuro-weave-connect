
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

  // Smooth animation variants
  const sidebarVariants = {
    mobile: {
      hidden: { x: -300, opacity: 0 },
      visible: { 
        x: 0, 
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 40,
          mass: 0.8
        }
      },
      exit: { 
        x: -300, 
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 40,
          mass: 0.8
        }
      }
    },
    desktop: {
      collapsed: { 
        width: 64,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }
      },
      expanded: { 
        width: 256,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }
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
            initial={isMobile ? "hidden" : (sidebarCollapsed ? "collapsed" : "expanded")}
            animate={isMobile ? "visible" : (sidebarCollapsed ? "collapsed" : "expanded")}
            exit={isMobile ? "exit" : undefined}
            variants={isMobile ? sidebarVariants.mobile : sidebarVariants.desktop}
            className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'sticky top-16 h-[calc(100vh-4rem)]'}
              ${sidebarWidth} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
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
