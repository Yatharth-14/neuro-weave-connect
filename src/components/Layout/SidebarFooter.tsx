
import React from 'react';
import { useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { toggleSidebar } from '../../store/slices/uiSlice';

const SidebarFooter: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useTypedSelector(state => state.ui);

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          NeuroShare v1.0
        </p>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SidebarFooter;
