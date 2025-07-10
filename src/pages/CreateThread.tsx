
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Eye, Hash, Type, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useDispatch } from 'react-redux';
import { addThread } from '../store/slices/threadsSlice';
import { addNotification } from '../store/slices/uiSlice';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { mockThreads } from '../services/mockData';
import Layout from '../components/Layout/Layout';
import AIAnalysis from '../components/AI/AIAnalysis';

const CreateThread: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useTypedSelector(state => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      // Create new thread
      const newThread = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        },
        contributors: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        likedBy: [],
        comments: [],
        aiSummary: aiSummary || undefined,
      };

      dispatch(addThread(newThread));
      dispatch(addNotification({
        message: 'Thread created successfully!',
        type: 'success',
      }));

      navigate(`/thread/${newThread.id}`);
    } catch (error) {
      dispatch(addNotification({
        message: 'Failed to create thread. Please try again.',
        type: 'error',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagSuggestion = (tag: string) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      setFormData(prev => ({ ...prev, tags: newTags }));
    }
  };

  const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Thread
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your knowledge and collaborate with the community
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <form onSubmit={handleSubmit} className="p-6">
                {/* Title */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Type className="h-4 w-4 mr-2" />
                    Thread Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter a descriptive title for your thread"
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Hash className="h-4 w-4 mr-2" />
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="react, javascript, web-development (comma separated)"
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add relevant tags separated by commas to help others find your thread
                  </p>
                </div>

                {/* Content Editor */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FileText className="h-4 w-4 mr-2" />
                      Content
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsPreview(false)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          !isPreview
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPreview(true)}
                        className={`flex items-center px-3 py-1 text-sm rounded-md ${
                          isPreview
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </button>
                    </div>
                  </div>

                  {!isPreview ? (
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      rows={12}
                      placeholder="Write your content in Markdown format..."
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    />
                  ) : (
                    <div className="min-h-[300px] p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-750">
                      {formData.content ? (
                        <div className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown>{formData.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          Start writing to see the preview...
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Markdown Help */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Markdown Quick Reference:
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p><code># Heading 1</code> • <code>## Heading 2</code> • <code>**bold**</code> • <code>*italic*</code></p>
                    <p><code>- List item</code> • <code>[Link](url)</code> • <code>`code`</code> • <code>```code block```</code></p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                    className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Creating...' : 'Create Thread'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-8"
            >
              {(formData.title.trim() || formData.content.trim()) && (
                <AIAnalysis
                  content={formData.content}
                  title={formData.title}
                  existingTags={tagsArray}
                  allThreads={mockThreads}
                  onSummaryGenerated={setAiSummary}
                  onTagSuggested={handleTagSuggestion}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateThread;
