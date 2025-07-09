
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Users, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { setCurrentThread } from '../store/slices/threadsSlice';
import { addNotification } from '../store/slices/uiSlice';
import { mockThreads } from '../services/mockData';
import { socketService } from '../services/socket';
import Layout from '../components/Layout/Layout';

const ThreadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { currentThread } = useTypedSelector(state => state.threads);
  const { user } = useTypedSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [showAISummary, setShowAISummary] = useState(false);

  useEffect(() => {
    if (id) {
      // Find thread by ID
      const thread = mockThreads.find(t => t.id === id);
      if (thread) {
        dispatch(setCurrentThread(thread));
        setEditContent(thread.content);
        setCollaborators(thread.contributors);
        
        // Join thread room for real-time collaboration
        socketService.joinThread(id);
        
        // Listen for updates
        const handleThreadUpdate = (data: any) => {
          if (data.threadId === id) {
            setEditContent(data.content);
          }
        };
        
        const handleCollaboratorJoined = (data: any) => {
          if (data.threadId === id) {
            setCollaborators(prev => [...prev, data.user]);
          }
        };
        
        socketService.on('thread_updated', handleThreadUpdate);
        socketService.on('collaborator_joined', handleCollaboratorJoined);
        
        return () => {
          socketService.off('thread_updated', handleThreadUpdate);
          socketService.off('collaborator_joined', handleCollaboratorJoined);
          socketService.leaveThread(id);
        };
      }
    }
  }, [id, dispatch]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (id && currentThread) {
      // Send update via socket
      socketService.updateThread(id, editContent);
      
      // Update local state
      const updatedThread = {
        ...currentThread,
        content: editContent,
        updatedAt: new Date().toISOString(),
      };
      dispatch(setCurrentThread(updatedThread));
      
      setIsEditing(false);
      dispatch(addNotification({
        message: 'Thread updated successfully!',
        type: 'success',
      }));
    }
  };

  const handleCancel = () => {
    setEditContent(currentThread?.content || '');
    setIsEditing(false);
  };

  const generateAISummary = () => {
    setShowAISummary(true);
    // Simulate AI summary generation
    setTimeout(() => {
      dispatch(addNotification({
        message: 'AI summary generated!',
        type: 'success',
      }));
    }, 2000);
  };

  if (!currentThread) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thread not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The thread you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const isAuthor = user?.id === currentThread.author.id;
  const canEdit = isAuthor || collaborators.some(c => c.id === user?.id);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={currentThread.author.avatar}
                  alt={currentThread.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {currentThread.author.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(currentThread.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{currentThread.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{currentThread.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
                <button
                  onClick={generateAISummary}
                  className="flex items-center px-3 py-2 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI Summary
                </button>
                <button className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </button>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {currentThread.title}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {currentThread.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* AI Summary */}
            {(currentThread.aiSummary || showAISummary) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg mb-6"
              >
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="font-medium text-purple-700 dark:text-purple-300">AI Summary</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {currentThread.aiSummary || 'Generating AI summary...'}
                </p>
              </motion.div>
            )}

            {/* Collaborators */}
            {collaborators.length > 0 && (
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Collaborators:</span>
                </div>
                <div className="flex items-center space-x-2">
                  {collaborators.slice(0, 3).map((collaborator, index) => (
                    <img
                      key={collaborator.id}
                      src={collaborator.avatar}
                      alt={collaborator.name}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                      style={{ marginLeft: index > 0 ? '-8px' : '0' }}
                      title={collaborator.name}
                    />
                  ))}
                  {collaborators.length > 3 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      +{collaborators.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          {isEditing ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center justify-end space-x-4 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{editContent}</ReactMarkdown>
            </div>
          )}
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center mb-6">
            <MessageCircle className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
          </div>
          
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ThreadDetail;
