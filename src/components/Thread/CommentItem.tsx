
import React from 'react';
import { Clock } from 'lucide-react';
import { Comment } from '../../store/slices/threadsSlice';
import LikeButton from './LikeButton';

interface CommentItemProps {
  comment: Comment;
  threadId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, threadId }) => {
  return (
    <div className="flex space-x-3 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {comment.author.name}
          </h4>
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 whitespace-pre-wrap">
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
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
