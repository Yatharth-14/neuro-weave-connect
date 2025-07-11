
import React from 'react';
import { useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { toggleSidebar, toggleSidebarCollapse } from '../../store/slices/uiSlice';
import { useIsMobile } from '../../hooks/use-mobile';

const SidebarFooter: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useTypedSelector(state => state.ui);
  const isMobile = useIsMobile();

  const isCollapsed = sidebarCollapsed && !isMobile;

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            NeuroShare v1.0
          </p>
        )}
        
        <div className="flex items-center gap-2">
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Close Sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Desktop collapse/expand button */}
          {!isMobile && (
            <button
              onClick={() => dispatch(toggleSidebarCollapse())}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
