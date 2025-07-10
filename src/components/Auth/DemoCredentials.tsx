
import React from 'react';

const DemoCredentials: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
        Demo Credentials:
      </p>
      <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
        Email: demo@neuroshare.com
        <br />
        Password: demo123
      </p>
    </div>
  );
};

export default DemoCredentials;
