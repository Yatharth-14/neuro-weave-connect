
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Search, User, Moon, Sun, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { toggleDarkMode, toggleSidebar } from '../../store/slices/uiSlice';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-mobile';
import NotificationDropdown from '../Notifications/NotificationDropdown';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { darkMode } = useTypedSelector(state => state.ui);
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Menu */}
          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center ml-2 md:ml-0">
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

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 md:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isMobile ? "Search..." : "Search knowledge threads..."}
                className="block w-full pl-8 md:pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
              />
            </form>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            </button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* User menu */}
            <div className="relative group">
              <button className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={user?.name || 'User'}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                />
                {!isMobile && (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block truncate max-w-24">
                    {user?.name}
                  </span>
                )}
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
