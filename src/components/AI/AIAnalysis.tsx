
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Tag, 
  TrendingUp, 
  Lightbulb,
  Settings,
  Key,
  AlertCircle
} from 'lucide-react';
import { getAIService, initializeAIService, SmartSuggestion } from '../../services/aiService';

interface AIAnalysisProps {
  content: string;
  title?: string;
  existingTags?: string[];
  allThreads?: Array<{
    id: string;
    title: string;
    content: string;
    tags: string[];
  }>;
  onSummaryGenerated?: (summary: string) => void;
  onTagSuggested?: (tag: string) => void;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({
  content,
  title = '',
  existingTags = [],
  allThreads = [],
  onSummaryGenerated,
  onTagSuggested,
}) => {
  const [apiKey, setApiKey] = useState<string>(() => 
    localStorage.getItem('gemini_api_key') || ''
  );
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [insights, setInsights] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [relatedThreads, setRelatedThreads] = useState<Array<{ id: string; title: string; similarity: number }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const hasAI = !!getAIService();
  const hasContent = content.trim().length > 50;

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
      initializeAIService(apiKey);
    }
  }, [apiKey]);

  const performAnalysis = async () => {
    const aiService = getAIService();
    if (!aiService || !hasContent || isAnalyzing) return;

    setIsAnalyzing(true);
    
    try {
      // Generate summary
      const summaryResult = await aiService.summarizeContent({
        content: `${title}\n\n${content}`,
        maxLength: 150
      });
      setSummary(summaryResult);
      onSummaryGenerated?.(summaryResult);

      // Generate insights
      const insightsResult = await aiService.generateInsights(content);
      setInsights(insightsResult);

      // Generate smart suggestions
      const suggestionsResult = await aiService.generateSmartSuggestions(content, existingTags);
      setSuggestions(suggestionsResult);

      // Find related threads
      if (allThreads.length > 0) {
        const relatedResult = await aiService.findRelatedThreads(content, allThreads);
        setRelatedThreads(relatedResult);
      }

      setHasAnalyzed(true);
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      initializeAIService(apiKey);
      setShowApiKeyInput(false);
    }
  };

  if (!hasAI && !showApiKeyInput) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Enable AI Analysis
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Add your Google Gemini API key to unlock AI-powered summaries, insights, and smart suggestions.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Free Gemini API
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Google's Gemini offers 15 requests/minute and 1M tokens/month for free.
                  Get your key at: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">ai.google.dev</code>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowApiKeyInput(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-auto"
          >
            <Key className="h-4 w-4 mr-2" />
            Add API Key
          </button>
        </div>
      </div>
    );
  }

  if (showApiKeyInput) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleApiKeySubmit} className="space-y-4">
          <div className="text-center mb-4">
            <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Enter Gemini API Key
            </h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowApiKeyInput(false)}
              className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Analysis
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Change API Key"
            >
              <Settings className="h-4 w-4" />
            </button>
            {hasContent && !isAnalyzing && (
              <button
                onClick={performAnalysis}
                className="flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 text-sm"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {hasAnalyzed ? 'Re-analyze' : 'Analyze'}
              </button>
            )}
          </div>
        </div>

        {!hasContent && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Write at least 50 characters to enable AI analysis.
          </p>
        )}

        {isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
              <span>Analyzing with Gemini AI...</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">AI Summary</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {summary}
          </p>
        </motion.div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">Key Insights</h4>
          </div>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">{insight}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">Smart Suggestions</h4>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-md"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {suggestion.description}
                  </p>
                </div>
                {suggestion.type === 'tag' && onTagSuggested && (
                  <button
                    onClick={() => onTagSuggested(suggestion.title.replace('Add tag: #', ''))}
                    className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-800"
                  >
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Related Threads */}
      {relatedThreads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">Related Threads</h4>
          </div>
          <div className="space-y-2">
            {relatedThreads.map((thread) => (
              <div
                key={thread.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {thread.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {Math.round(thread.similarity * 100)}% similarity
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIAnalysis;
