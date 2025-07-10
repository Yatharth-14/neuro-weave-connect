
import React, { useState } from 'react';
import { Send } from 'lucide-react';
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
  const { user } = useTypedSelector(state => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
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
        message: 'Comment added successfully!',
        type: 'success'
      }));
    } catch (error) {
      dispatch(addNotification({
        message: 'Failed to add comment',
        type: 'error'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        Please login to leave a comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start space-x-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[80px] resize-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {content.length}/500 characters
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim() || content.length > 500}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Send className="h-4 w-4 mr-1" />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
