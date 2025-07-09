
import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  BookOpen, 
  Users, 
  Eye, 
  Heart,
  Settings,
  Edit3,
  Award,
  TrendingUp
} from 'lucide-react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { mockThreads } from '../services/mockData';
import Layout from '../components/Layout/Layout';

const Profile: React.FC = () => {
  const { user } = useTypedSelector(state => state.auth);
  const userThreads = mockThreads.filter(thread => thread.author.id === user?.id);
  
  const stats = {
    threadsCreated: userThreads.length,
    totalViews: userThreads.reduce((sum, thread) => sum + thread.views, 0),
    totalLikes: userThreads.reduce((sum, thread) => sum + thread.likes, 0),
    collaborations: 12,
    joinedDate: user?.joinedDate || '2024-01-15',
  };

  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ 
    icon, 
    label, 
    value, 
    color 
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );

  const ThreadCard: React.FC<{ thread: any; index: number }> = ({ thread, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
          {thread.title}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(thread.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {thread.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{thread.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>{thread.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{thread.contributors.length}</span>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-500 font-medium">
          View →
        </button>
      </div>
    </motion.div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white mb-8"
        >
          <div className="flex items-start space-x-6">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                  <p className="text-blue-100 mb-2">{user?.email}</p>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(stats.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            icon={<BookOpen className="h-6 w-6 text-white" />}
            label="Threads Created"
            value={stats.threadsCreated}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Eye className="h-6 w-6 text-white" />}
            label="Total Views"
            value={stats.totalViews.toLocaleString()}
            color="bg-green-500"
          />
          <StatCard
            icon={<Heart className="h-6 w-6 text-white" />}
            label="Total Likes"
            value={stats.totalLikes}
            color="bg-red-500"
          />
          <StatCard
            icon={<Users className="h-6 w-6 text-white" />}
            label="Collaborations"
            value={stats.collaborations}
            color="bg-purple-500"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Threads */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Threads</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {userThreads.length} threads
                </span>
              </div>
              
              <div className="space-y-6">
                {userThreads.length > 0 ? (
                  userThreads.map((thread, index) => (
                    <ThreadCard key={thread.id} thread={thread} index={index} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No threads yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start sharing your knowledge by creating your first thread.
                    </p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Create Your First Thread
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Award className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Knowledge Sharer</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created your first thread</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Collaborator</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Collaborated on 10+ threads</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Activity Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">This Week</span>
                  <span className="font-medium text-gray-900 dark:text-white">2 threads created</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">This Month</span>
                  <span className="font-medium text-gray-900 dark:text-white">8 collaborations</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Views Gained</span>
                  <span className="font-medium text-gray-900 dark:text-white">+156 this week</span>
                </div>
              </div>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Settings</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Notification Preferences
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Privacy Settings
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Account Settings
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
