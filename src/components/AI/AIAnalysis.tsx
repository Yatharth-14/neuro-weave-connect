
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, MessageSquare, Loader } from 'lucide-react';
import { getAIService } from '../../services/aiService';

interface AIAnalysisProps {
  content: string;
  onSummaryGenerated?: (summary: string) => void;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ content, onSummaryGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [insights, setInsights] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleGenerateAnalysis = async () => {
    const aiService = getAIService();
    
    if (!aiService && !apiKey) {
      setShowKeyInput(true);
      return;
    }

    setIsGenerating(true);
    
    try {
      let service = aiService;
      if (!service && apiKey) {
        // Temporarily create service with provided key
        const { default: AIService, initializeAIService } = await import('../../services/aiService');
        initializeAIService(apiKey);
        service = getAIService();
      }

      if (service) {
        const [generatedSummary, generatedInsights] = await Promise.all([
          service.summarizeContent({ content }),
          service.generateInsights(content)
        ]);

        setSummary(generatedSummary);
        setInsights(generatedInsights);
        onSummaryGenerated?.(generatedSummary);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      setSummary('Unable to generate analysis at this time.');
      setInsights(['Analysis unavailable due to API error.']);
    } finally {
      setIsGenerating(false);
    }
  };

  if (showKeyInput && !getAIService()) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 md:p-6 border border-purple-200 dark:border-purple-700"
      >
        <div className="flex items-center mb-4">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="font-semibold text-purple-800 dark:text-purple-300">AI Analysis</h3>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          To enable AI-powered analysis, please provide your OpenAI API key:
        </p>
        
        <div className="space-y-3">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your OpenAI API key..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
          
          <div className="flex space-x-2">
            <button
              onClick={handleGenerateAnalysis}
              disabled={!apiKey.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate Analysis
            </button>
            
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Your API key is only stored temporarily in memory and never sent to our servers.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 md:p-6 border border-purple-200 dark:border-purple-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="font-semibold text-purple-800 dark:text-purple-300">AI Analysis</h3>
        </div>
        
        {!summary && (
          <button
            onClick={handleGenerateAnalysis}
            disabled={isGenerating}
            className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader className="h-4 w-4 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                Analyze
              </>
            )}
          </button>
        )}
      </div>

      {summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Summary Section */}
          <div>
            <div className="flex items-center mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Summary</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/50 rounded-md p-3 border border-blue-200 dark:border-blue-700">
              {summary}
            </p>
          </div>

          {/* Insights Section */}
          {insights.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                <h4 className="font-medium text-green-800 dark:text-green-300">Key Insights</h4>
              </div>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/50 rounded-md p-2 border border-green-200 dark:border-green-700 flex items-start"
                  >
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {insight}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateAnalysis}
            disabled={isGenerating}
            className="flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader className="h-4 w-4 mr-1 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                Refresh Analysis
              </>
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIAnalysis;
