
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock } from 'lucide-react';
import { Thread } from '../../store/slices/threadsSlice';
import ThreadCard from './ThreadCard';

interface ThreadSectionProps {
  title: string;
  threads: Thread[];
  icon: 'trending' | 'recent';
  delay?: number;
}

const ThreadSection: React.FC<ThreadSectionProps> = ({ 
  title, 
  threads, 
  icon, 
  delay = 0 
}) => {
  const IconComponent = icon === 'trending' ? TrendingUp : Clock;
  const iconColor = icon === 'trending' ? 'text-orange-500' : 'text-blue-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-6 md:mb-8"
    >
      <div className="flex items-center mb-4 md:mb-6">
        <IconComponent className={`h-5 w-5 md:h-6 md:w-6 ${iconColor} mr-2`} />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="space-y-4 md:space-y-6">
        {threads.map((thread, index) => (
          <ThreadCard key={thread.id} thread={thread} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default ThreadSection;
