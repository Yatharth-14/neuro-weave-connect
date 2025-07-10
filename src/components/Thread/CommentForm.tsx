
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { addComment } from '../../store/slices/threadsSlice';
import { addNotification } from '../../store/slices/uiSlice';

interface CommentFormProps {
  threadId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ threadId }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      dispatch(addNotification({
        message: 'Please enter a comment',
        type: 'warning'
      }));
      return;
    }

    if (!isAuthenticated || !user) {
      dispatch(addNotification({
        message: 'Please login to leave a comment',
        type: 'error'
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const newComment = {
        id: Date.now().toString(),
        threadId,
        content: content.trim(),
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
        },
        createdAt: now,
        updatedAt: now,
        likes: 0,
        likedBy: []
      };

      dispatch(addComment({ threadId, comment: newComment }));
      
      dispatch(addNotification({
        message: 'Comment added successfully!',
        type: 'success'
      }));

      setContent('');
    } catch (error) {
      dispatch(addNotification({
        message: 'Failed to add comment. Please try again.',
        type: 'error'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please login to leave a comment
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-3">
        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
          alt={user?.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {content.length}/1000
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                'Posting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Comment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
