
import React, { useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useIsMobile } from '../../hooks/use-mobile';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode, sidebarCollapsed } = useTypedSelector(state => state.ui);
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
    if (isMobile) {
      return 'flex-1 p-6 transition-all duration-200 ease-in-out'; // Mobile: sidebar is overlay, no margin needed
    }
    
    if (sidebarCollapsed) {
      return 'flex-1 p-6 ml-16 transition-all duration-200 ease-in-out'; // Desktop collapsed: small margin
    }
    
    return 'flex-1 p-6 transition-all duration-200 ease-in-out'; // Desktop expanded: sidebar takes space in flex
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={getMainContentClasses()}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
