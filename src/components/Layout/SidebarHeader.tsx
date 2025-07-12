
import React from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useIsMobile } from '../../hooks/use-mobile';

const SidebarHeader: React.FC = () => {
  const isMobile = useIsMobile();
  const { sidebarCollapsed } = useTypedSelector(state => state.ui);

  const isCollapsed = sidebarCollapsed && !isMobile;

  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out">
          <span className="text-white font-bold text-sm">N</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ease-in-out">
          <span className="text-white font-bold text-sm">N</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
