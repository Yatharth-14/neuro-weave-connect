
import React from 'react';
import { useDispatch } from 'react-redux';
import { Moon, Sun } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import NotificationDropdown from '../Notifications/NotificationDropdown';
import UserMenu from './UserMenu';

const HeaderActions: React.FC = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTypedSelector((state) => state.ui);

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      <button
        onClick={() => dispatch(toggleDarkMode())}
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {darkMode ? (
          <Sun className="h-4 w-4 md:h-5 md:w-5" />
        ) : (
          <Moon className="h-4 w-4 md:h-5 md:w-5" />
        )}
      </button>

      <NotificationDropdown />
      <UserMenu />
    </div>
  );
};

export default HeaderActions;
