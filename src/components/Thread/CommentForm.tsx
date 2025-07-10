
import React, { useState, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { addComment } from '../../store/slices/threadsSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { Textarea } from '../ui/textarea';

interface CommentFormProps {
  threadId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ threadId }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useTypedSelector(state => state.auth);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !isAuthenticated) {
      dispatch(addNotification({
        message: 'Please login to comment',
        type: 'warning'
      }));
      return;
    }

    if (!content.trim()) {
      dispatch(addNotification({
        message: 'Comment cannot be empty',
        type: 'error'
      }));
      return;
    }

    if (content.length > 500) {
      dispatch(addNotification({
        message: 'Comment is too long (max 500 characters)',
        type: 'error'
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const newComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        threadId,
        content: content.trim(),
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        likedBy: []
      };

      dispatch(addComment({ threadId, comment: newComment }));
      setContent('');
      
      dispatch(addNotification({
        message: 'Comment posted successfully!',
        type: 'success'
      }));
    } catch (error) {
      dispatch(addNotification({
        message: 'Failed to post comment',
        type: 'error'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [user, isAuthenticated, content, threadId, dispatch]);

  if (!user || !isAuthenticated) {
    return (
      <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Please login to leave a comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start space-x-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-gray-200 dark:border-gray-700"
        />
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What are your thoughts?"
            className="min-h-[80px] resize-none border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-3">
            <span className={`text-xs ${
              content.length > 450 
                ? 'text-red-500' 
                : content.length > 400 
                  ? 'text-yellow-500' 
                  : 'text-gray-500 dark:text-gray-400'
            }`}>
              {content.length}/500 characters
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim() || content.length > 500}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
