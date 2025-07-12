
import React, { useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useIsMobile } from '../../hooks/use-mobile';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode, sidebarOpen } = useTypedSelector(state => state.ui);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Calculate main content margin based on sidebar state
  const getMainContentClasses = () => {
    if (isMobile || !sidebarOpen) {
      return 'flex-1 p-6 transition-all duration-200 ease-in-out w-full'; // Full width when sidebar is hidden or on mobile
    }
    
    return 'flex-1 p-6 transition-all duration-200 ease-in-out w-full'; // Full width desktop with sidebar open
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Header />
      <div className="flex w-full">
        <Sidebar />
        <main className={getMainContentClasses()}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
