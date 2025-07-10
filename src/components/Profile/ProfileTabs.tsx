
import React from 'react';
import { motion } from 'framer-motion';
import { User, BarChart3, Brain } from 'lucide-react';

interface ProfileTabsProps {
  activeTab: 'profile' | 'analytics' | 'ai';
  onTabChange: (tab: 'profile' | 'analytics' | 'ai') => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai', label: 'AI Insights', icon: Brain },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6 md:mb-8"
    >
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4 md:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default ProfileTabs;
