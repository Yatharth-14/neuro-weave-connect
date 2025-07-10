
import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { toggleLike } from '../../store/slices/threadsSlice';
import { addNotification } from '../../store/slices/uiSlice';

interface LikeButtonProps {
  threadId: string;
  likes: number;
  likedBy: string[];
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  threadId, 
  likes, 
  likedBy, 
  className = '' 
}) => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  
  const isLiked = user ? likedBy.includes(user.id) : false;

  const handleLike = () => {
    if (!isAuthenticated || !user) {
      dispatch(addNotification({
        message: 'Please login to like this thread',
        type: 'warning'
      }));
      return;
    }

    try {
      dispatch(toggleLike({ threadId, userId: user.id }));
      
      const action = isLiked ? 'removed like from' : 'liked';
      dispatch(addNotification({
        message: `You ${action} this thread`,
        type: 'success'
      }));
    } catch (error) {
      dispatch(addNotification({
        message: 'Failed to update like. Please try again.',
        type: 'error'
      }));
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`
        inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200
        ${isLiked 
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30' 
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={!isAuthenticated}
    >
      <Heart 
        className={`h-5 w-5 transition-colors ${
          isLiked ? 'fill-current' : ''
        }`} 
      />
      <span className="font-medium">{likes}</span>
      <span className="hidden sm:inline">
        {likes === 1 ? 'Like' : 'Likes'}
      </span>
    </button>
  );
};

export default LikeButton;
