
import React, { useState } from 'react';
import { MessageCircle, TrendingUp, Clock } from 'lucide-react';
import { Comment } from '../../store/slices/threadsSlice';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface CommentsSectionProps {
  threadId: string;
  comments: Comment[];
}

type SortOption = 'newest' | 'oldest' | 'popular';

const CommentsSection: React.FC<CommentsSectionProps> = ({ threadId, comments }) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comments ({comments.length})
          </h3>
        </div>
        
        {comments.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                  sortBy === 'newest'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                }`}
              >
                <Clock className="h-3 w-3 inline mr-1" />
                Newest
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                  sortBy === 'popular'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                }`}
              >
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Popular
              </button>
            </div>
          </div>
        )}
      </div>
      
      <CommentForm threadId={threadId} />
      
      {sortedComments.length > 0 ? (
        <div className="mt-6 space-y-2">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              threadId={threadId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 mt-6">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <h4 className="text-lg font-medium mb-2">No comments yet</h4>
          <p className="text-sm">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
