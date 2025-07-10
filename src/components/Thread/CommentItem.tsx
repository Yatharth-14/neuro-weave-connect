
import React from 'react';
import { Clock, MoreHorizontal } from 'lucide-react';
import { Comment } from '../../store/slices/threadsSlice';
import LikeButton from './LikeButton';

interface CommentItemProps {
  comment: Comment;
  threadId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, threadId }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex space-x-3 py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 rounded-lg px-2">
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-gray-200 dark:border-gray-700"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm hover:underline cursor-pointer">
              {comment.author.name}
            </h4>
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(comment.createdAt)}</span>
            </div>
          </div>
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all duration-200">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 whitespace-pre-wrap leading-relaxed">
          {comment.content}
        </p>
        <div className="flex items-center space-x-4">
          <LikeButton
            threadId={threadId}
            commentId={comment.id}
            likes={comment.likes}
            likedBy={comment.likedBy}
            size="sm"
          />
          <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200 font-medium">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
