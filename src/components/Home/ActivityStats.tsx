
import React from 'react';
import { motion } from 'framer-motion';

interface ActivityStatsProps {
  userThreadsCount: number;
  delay?: number;
}

const ActivityStats: React.FC<ActivityStatsProps> = ({ 
  userThreadsCount, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Your Activity
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Threads Created
          </span>
          <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
            {userThreadsCount}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Collaborations
          </span>
          <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
            12
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Total Views
          </span>
          <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
            1,234
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityStats;
