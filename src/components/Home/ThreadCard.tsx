
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Eye, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Thread } from '../../store/slices/threadsSlice';
import LikeButton from '../Thread/LikeButton';

interface ThreadCardProps {
  thread: Thread;
  index: number;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, index }) => (
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
        <LikeButton
          threadId={thread.id}
          likes={thread.likes}
          likedBy={thread.likedBy || []}
          size="sm"
        />
        <div className="flex items-center space-x-1">
          <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
          <span className="text-xs md:text-sm">{thread.comments?.length || 0}</span>
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

export default ThreadCard;
