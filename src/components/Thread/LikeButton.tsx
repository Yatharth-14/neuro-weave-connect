
import React, { useState, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { toggleThreadLike, toggleCommentLike } from '../../store/slices/threadsSlice';
import { addNotification } from '../../store/slices/uiSlice';

interface LikeButtonProps {
  threadId?: string;
  commentId?: string;
  likes: number;
  likedBy: string[];
  size?: 'sm' | 'md' | 'lg';
}

const LikeButton: React.FC<LikeButtonProps> = ({
  threadId,
  commentId,
  likes,
  likedBy,
  size = 'md'
}) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useTypedSelector(state => state.auth);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isLiked = user && isAuthenticated ? likedBy.includes(user.id) : false;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const handleLike = useCallback(() => {
    if (!user || !isAuthenticated) {
      dispatch(addNotification({
        message: 'Please login to like posts',
        type: 'warning'
      }));
      return;
    }

    // Optimistic UI update with animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (commentId && threadId) {
      dispatch(toggleCommentLike({
        threadId,
        commentId,
        userId: user.id
      }));
    } else if (threadId) {
      dispatch(toggleThreadLike({
        threadId,
        userId: user.id
      }));
    }
  }, [user, isAuthenticated, commentId, threadId, dispatch]);

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-1 transition-all duration-200 hover:scale-105 ${
        isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
      }`}
      disabled={!isAuthenticated}
    >
      <Heart 
        className={`${sizeClasses[size]} transition-all duration-200 ${
          isLiked ? 'fill-current scale-110' : ''
        } ${isAnimating ? 'animate-pulse' : ''}`} 
      />
      <span className="text-sm font-medium">{likes}</span>
    </button>
  );
};

export default LikeButton;
