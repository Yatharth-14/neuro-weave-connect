
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Home, 
  Plus, 
  Search, 
  BarChart3, 
  Users, 
  Settings,
  X
} from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-mobile';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarOpen } = useTypedSelector(state => state.ui);
  const isMobile = useIsMobile();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Create Thread', href: '/create', icon: Plus },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Knowledge Graph', href: '/graph', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <AnimatePresence>
      {(sidebarOpen || !isMobile) && (
        <>
          {/* Overlay for mobile */}
          {isMobile && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
              onClick={() => dispatch(toggleSidebar())}
            />
          )}

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
            {/* Mobile header */}
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
                <button
                  onClick={() => dispatch(toggleSidebar())}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => isMobile && dispatch(toggleSidebar())}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive(item.href)
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                NeuroShare v1.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
