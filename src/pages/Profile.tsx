
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Settings, BarChart3, Brain } from 'lucide-react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import Layout from '../components/Layout/Layout';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';
import AIAnalysis from '../components/AI/AIAnalysis';

const Profile: React.FC = () => {
  const { user } = useTypedSelector(state => state.auth);
  const { userThreads } = useTypedSelector(state => state.threads);
  const [activeTab, setActiveTab] = useState<'profile' | 'analytics' | 'ai'>('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai', label: 'AI Insights', icon: Brain },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 md:p-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={user?.name || 'User'}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/20"
              />
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{user?.name || 'User'}</h1>
                <p className="text-blue-100 text-sm md:text-base">{user?.email}</p>
                <p className="text-blue-200 text-sm mt-1">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm md:text-base">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
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
                    onClick={() => setActiveTab(tab.id as any)}
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

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Stats */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Threads Created</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">{userThreads.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Total Views</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Collaborations</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Likes Received</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">892</span>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
                  <div className="space-y-3">
                    <button className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Settings className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Account Settings</span>
                    </button>
                    <button className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Settings className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Privacy Settings</span>
                    </button>
                    <button className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Settings className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">Notification Settings</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Threads */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Recent Threads</h3>
                <div className="space-y-3">
                  {userThreads.slice(0, 5).map((thread) => (
                    <div key={thread.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm md:text-base line-clamp-1">
                        {thread.title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(thread.createdAt).toLocaleDateString()} • {thread.views} views
                      </p>
                    </div>
                  ))}
                  {userThreads.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No threads created yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <AIAnalysis
                content="Sample content for AI analysis demonstration. This would typically contain the user's recent threads and activity data for personalized insights."
                onSummaryGenerated={(summary) => console.log('Generated summary:', summary)}
              />
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  AI-Powered Recommendations
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      📚 Based on your interests in React and AI, you might enjoy exploring threads about "React + Machine Learning Integration"
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      🤝 Consider collaborating with users who share similar interests in web development and AI
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                      💡 Your threads receive high engagement - consider creating more content about JavaScript frameworks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
