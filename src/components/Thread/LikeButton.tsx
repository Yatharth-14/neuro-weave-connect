
import React from 'react';
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
  const { user } = useTypedSelector(state => state.auth);
  
  const isLiked = user ? likedBy.includes(user.id) : false;
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const handleLike = () => {
    if (!user) {
      dispatch(addNotification({
        message: 'Please login to like posts',
        type: 'warning'
      }));
      return;
    }

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
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-1 transition-colors ${
        isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
      }`}
    >
      <Heart 
        className={`${sizeClasses[size]} ${isLiked ? 'fill-current' : ''}`} 
      />
      <span className="text-sm">{likes}</span>
    </button>
  );
};

export default LikeButton;
