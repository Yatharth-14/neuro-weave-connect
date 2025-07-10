
import React from 'react';
import { useDispatch } from 'react-redux';
import { Moon, Sun } from 'lucide-react';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const DarkModeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTypedSelector((state) => state.ui);

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => dispatch(toggleDarkMode())}
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default DarkModeToggle;
