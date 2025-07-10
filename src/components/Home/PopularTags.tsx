
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PopularTagsProps {
  delay?: number;
}

const PopularTags: React.FC<PopularTagsProps> = ({ delay = 0 }) => {
  const tags = ['react', 'javascript', 'ai', 'machine-learning', 'web-development', 'python'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Popular Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
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
  );
};

export default PopularTags;
