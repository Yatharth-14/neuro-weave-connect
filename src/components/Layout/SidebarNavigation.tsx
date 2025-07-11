
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Home, 
  Plus, 
  Search, 
  BarChart3, 
  Users, 
  Settings 
} from 'lucide-react';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { useIsMobile } from '../../hooks/use-mobile';

const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Create Thread', href: '/create', icon: Plus },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Knowledge Graph', href: '/graph', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex-1 px-4 py-6 overflow-y-auto">
      <ul className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.name}>
              <Link
                to={item.href}
                onClick={() => isMobile && dispatch(toggleSidebar())}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
