
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  MessageSquare, 
  Loader, 
  Search,
  Tag,
  Lightbulb,
  Link
} from 'lucide-react';
import { getAIService, initializeAIService, type SmartSuggestion } from '../../services/aiService';

interface AIAnalysisProps {
  content: string;
  title?: string;
  existingTags?: string[];
  allThreads?: Array<{ id: string; title: string; content: string; tags: string[] }>;
  onSummaryGenerated?: (summary: string) => void;
  onTagSuggested?: (tag: string) => void;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ 
  content, 
  title = '',
  existingTags = [],
  allThreads = [],
  onSummaryGenerated,
  onTagSuggested 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [insights, setInsights] = useState<string[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [relatedThreads, setRelatedThreads] = useState<Array<{ id: string; title: string; similarity: number }>>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'insights' | 'suggestions' | 'related'>('summary');

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
        initializeAIService(apiKey);
        service = getAIService();
      }

      if (service) {
        const fullContent = `${title}\n\n${content}`;
        
        // Generate all AI features in parallel
        const [
          generatedSummary,
          generatedInsights,
          suggestions,
          related
        ] = await Promise.all([
          service.summarizeContent({ content: fullContent }),
          service.generateInsights(fullContent),
          service.generateSmartSuggestions(fullContent, existingTags),
          allThreads.length > 0 ? service.findRelatedThreads(fullContent, allThreads) : Promise.resolve([])
        ]);

        setSummary(generatedSummary);
        setInsights(generatedInsights);
        setSmartSuggestions(suggestions);
        setRelatedThreads(related);
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

  const handleAcceptSuggestion = (suggestion: SmartSuggestion) => {
    if (suggestion.type === 'tag') {
      const tagName = suggestion.title.replace('Add tag: #', '');
      onTagSuggested?.(tagName);
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
          <h3 className="font-semibold text-purple-800 dark:text-purple-300">AI-Powered Analysis</h3>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Enable intelligent summarization, semantic search, and smart suggestions with your OpenAI API key:
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
              Generate AI Analysis
            </button>
            
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">AI Features Include:</h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Intelligent content summarization</li>
            <li>• Key insights extraction</li>
            <li>• Smart tag suggestions</li>
            <li>• Related thread discovery</li>
            <li>• Semantic search capabilities</li>
          </ul>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Your API key is stored temporarily and never sent to our servers.
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
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1">
            {[
              { key: 'summary', label: 'Summary', icon: MessageSquare },
              { key: 'insights', label: 'Insights', icon: TrendingUp },
              { key: 'suggestions', label: 'Suggestions', icon: Lightbulb },
              { key: 'related', label: 'Related', icon: Link }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === 'summary' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">AI Summary</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/50 rounded-md p-3 border border-blue-200 dark:border-blue-700 leading-relaxed">
                  {summary}
                </p>
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
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
                      className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/50 rounded-md p-3 border border-green-200 dark:border-green-700 flex items-start"
                    >
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {insight}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'suggestions' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mr-2" />
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Smart Suggestions</h4>
                </div>
                <div className="space-y-2">
                  {smartSuggestions.length > 0 ? (
                    smartSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800/50 rounded-md p-3 border border-yellow-200 dark:border-yellow-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              {suggestion.type === 'tag' ? (
                                <Tag className="h-3 w-3 text-blue-500 mr-1" />
                              ) : (
                                <Lightbulb className="h-3 w-3 text-yellow-500 mr-1" />
                              )}
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {suggestion.title}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {suggestion.description}
                            </p>
                          </div>
                          {suggestion.type === 'tag' && (
                            <button
                              onClick={() => handleAcceptSuggestion(suggestion)}
                              className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No suggestions available for this content.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'related' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center mb-2">
                  <Link className="h-4 w-4 text-purple-600 mr-2" />
                  <h4 className="font-medium text-purple-800 dark:text-purple-300">Related Threads</h4>
                </div>
                <div className="space-y-2">
                  {relatedThreads.length > 0 ? (
                    relatedThreads.map((thread, index) => (
                      <motion.div
                        key={thread.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800/50 rounded-md p-3 border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {thread.title}
                          </span>
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            {Math.round(thread.similarity * 100)}% match
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No related threads found.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
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
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Powered by AI • {new Date().toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIAnalysis;
