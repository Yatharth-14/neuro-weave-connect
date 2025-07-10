
import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { toggleThreadLike, toggleCommentLike } from '../../store/slices/threadsSlice';
import { addNotification } from '../../store/slices/uiSlice';

interface LikeButtonProps {
  threadId: string;
  commentId?: string;
  likes: number;
  likedBy: string[];
  size?: 'sm' | 'lg';
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  threadId, 
  commentId,
  likes, 
  likedBy, 
  size = 'sm',
  className = '' 
}) => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  
  const isLiked = user ? likedBy.includes(user.id) : false;
  const isComment = !!commentId;

  const handleLike = () => {
    if (!isAuthenticated || !user) {
      dispatch(addNotification({
        message: 'Please login to like this',
        type: 'warning'
      }));
      return;
    }

    if (isComment && commentId) {
      dispatch(toggleCommentLike({ threadId, commentId, userId: user.id }));
      dispatch(addNotification({
        message: `You ${isLiked ? 'unliked' : 'liked'} this comment`,
        type: 'success'
      }));
    } else {
      dispatch(toggleThreadLike({ threadId, userId: user.id }));
      dispatch(addNotification({
        message: `You ${isLiked ? 'unliked' : 'liked'} this thread`,
        type: 'success'
      }));
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <button
      onClick={handleLike}
      className={`
        inline-flex items-center space-x-1 rounded-lg border transition-all duration-200
        ${isLiked 
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30' 
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
        }
        ${sizeClasses[size]}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={!isAuthenticated}
    >
      <Heart 
        className={`${iconSize} transition-colors ${
          isLiked ? 'fill-current text-red-500' : ''
        }`} 
      />
      <span className="font-medium">{likes}</span>
      {size === 'lg' && (
        <span className="hidden sm:inline">
          {likes === 1 ? 'Like' : 'Likes'}
        </span>
      )}
    </button>
  );
};

export default LikeButton;
