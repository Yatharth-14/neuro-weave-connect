
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useIsMobile } from '../../hooks/use-mobile';

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <img
          src={
            user?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          }
          alt={user?.name || "User"}
          className="w-6 h-6 md:w-8 md:h-8 rounded-full"
        />
        {!isMobile && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block truncate w-full max-w-24">
            {user?.name}
          </span>
        )}
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <Link
          to="/profile"
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
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
  );
};

export default UserMenu;
