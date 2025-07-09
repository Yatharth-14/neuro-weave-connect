
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Clock, Eye, Heart, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { setThreads, setTrendingThreads, setUserThreads } from '../store/slices/threadsSlice';
import { mockThreads } from '../services/mockData';
import Layout from '../components/Layout/Layout';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { threads, trendingThreads, userThreads } = useTypedSelector(state => state.threads);
  const { user } = useTypedSelector(state => state.auth);

  useEffect(() => {
    // Load mock data
    dispatch(setThreads(mockThreads));
    dispatch(setTrendingThreads(mockThreads.slice(0, 2)));
    dispatch(setUserThreads(mockThreads.filter(t => t.author.id === user?.id)));
  }, [dispatch, user?.id]);

  const ThreadCard: React.FC<{ thread: any; index: number }> = ({ thread, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 md:p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={thread.author.avatar}
            alt={thread.author.name}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">{thread.author.name}</h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              {new Date(thread.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {thread.contributors.length > 0 && (
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              +{thread.contributors.length}
            </span>
          </div>
        )}
      </div>

      <Link to={`/thread/${thread.id}`} className="block group">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {thread.title}
        </h2>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {thread.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {thread.aiSummary && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-3 md:p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
              <span className="text-xs md:text-sm font-medium text-purple-700 dark:text-purple-300">AI Summary</span>
            </div>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{thread.aiSummary}</p>
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>
            {thread.content.substring(0, 200) + '...'}
          </ReactMarkdown>
        </div>
      </Link>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm">{thread.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm">{thread.likes}</span>
          </div>
        </div>
        <Link
          to={`/thread/${thread.id}`}
          className="text-blue-600 hover:text-blue-500 text-xs md:text-sm font-medium"
        >
          Read more →
        </Link>
      </div>
    </motion.div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 md:p-8 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base">
              Discover and share knowledge through collaborative threads
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Create New Thread
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Trending Threads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 md:mb-8"
            >
              <div className="flex items-center mb-4 md:mb-6">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-orange-500 mr-2" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Trending Threads</h2>
              </div>
              <div className="space-y-4 md:space-y-6">
                {trendingThreads.map((thread, index) => (
                  <ThreadCard key={thread.id} thread={thread} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Recent Threads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center mb-4 md:mb-6">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-500 mr-2" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Recent Threads</h2>
              </div>
              <div className="space-y-4 md:space-y-6">
                {threads.map((thread, index) => (
                  <ThreadCard key={thread.id} thread={thread} index={index + 2} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Threads Created</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">{userThreads.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Collaborations</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Total Views</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">1,234</span>
                </div>
              </div>
            </motion.div>

            {/* Popular Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['react', 'javascript', 'ai', 'machine-learning', 'web-development', 'python'].map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?tag=${tag}`}
                    className="px-2 md:px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
