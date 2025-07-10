
import React from 'react';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    createdAt?: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 md:mb-8"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt={user.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/20"
          />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-blue-100 text-sm md:text-base">{user.email}</p>
            <p className="text-blue-200 text-sm mt-1">
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm md:text-base">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
