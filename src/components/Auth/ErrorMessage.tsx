
import React from 'react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm"
    >
      {error}
    </motion.div>
  );
};

export default ErrorMessage;
