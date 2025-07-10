
import React from 'react';
import { motion } from 'framer-motion';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
        <span className="text-white font-bold text-2xl">N</span>
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default AuthHeader;
