
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Comment } from '../../store/slices/threadsSlice';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface CommentsSectionProps {
  threadId: string;
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ threadId, comments }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <MessageCircle className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>
      
      <CommentForm threadId={threadId} />
      
      {comments.length > 0 ? (
        <div className="mt-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              threadId={threadId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 mt-6">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
