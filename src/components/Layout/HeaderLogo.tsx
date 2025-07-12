
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Menu } from 'lucide-react';
import { toggleSidebar } from '../../store/slices/uiSlice';

const HeaderLogo: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center">
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu className="h-6 w-6" />
      </button>
      <Link to="/" className="flex items-center ml-2">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🧠</span>
          </div>
          <span className="ml-2 text-lg md:text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
            NeuroShare
          </span>
        </div>
      </Link>
    </div>
  );
};

export default HeaderLogo;
