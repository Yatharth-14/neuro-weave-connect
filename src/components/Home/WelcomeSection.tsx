
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 md:mb-8"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {userName}!
        </h1>
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
  );
};

export default WelcomeSection;
