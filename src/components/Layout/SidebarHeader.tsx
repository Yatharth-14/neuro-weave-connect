
import React from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { useIsMobile } from '../../hooks/use-mobile';

const SidebarHeader: React.FC = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SidebarHeader;
