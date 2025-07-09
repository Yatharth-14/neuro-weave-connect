import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, Zap, Clock, User, Key } from 'lucide-react';
import { getAIService, initializeAIService } from '../../services/aiService';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  createdAt: string;
  score: number;
}

interface SemanticSearchProps {
  threads: Array<{
    id: string;
    title: string;
    content: string;
    author: { id: string; name: string; avatar?: string };
    tags: string[];
    createdAt: string;
  }>;
  onResultClick?: (threadId: string) => void;
}

const SemanticSearch: React.FC<SemanticSearchProps> = ({ threads, onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'semantic' | 'keyword'>('semantic');
  const [hasAI, setHasAI] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => 
    localStorage.getItem('gemini_api_key') || ''
  );

  useEffect(() => {
    setHasAI(!!getAIService());
  }, []);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
      initializeAIService(apiKey);
      setHasAI(true);
      setShowApiKeyInput(false);
    }
  }, [apiKey]);

  const performSemanticSearch = async (searchQuery: string) => {
    const aiService = getAIService();
    if (!aiService) return [];

    try {
      const searchResults = await aiService.semanticSearch({
        query: searchQuery,
        documents: threads.map(thread => ({
          id: thread.id,
          title: thread.title,
          content: thread.content,
          tags: thread.tags
        }))
      });

      return searchResults.map(result => {
        const originalThread = threads.find(t => t.id === result.id);
        return {
          ...result,
          author: originalThread?.author || { id: '', name: 'Unknown' },
          tags: originalThread?.tags || [],
          createdAt: originalThread?.createdAt || '',
        };
      });
    } catch (error) {
      console.error('Semantic search error:', error);
      return [];
    }
  };

  const performKeywordSearch = (searchQuery: string): SearchResult[] => {
    const queryWords = searchQuery.toLowerCase().split(' ');
    
    return threads
      .map(thread => {
        const searchText = `${thread.title} ${thread.content} ${thread.tags.join(' ')}`.toLowerCase();
        const matches = queryWords.filter(word => searchText.includes(word));
        const score = matches.length / queryWords.length;
        
        return {
          id: thread.id,
          title: thread.title,
          content: thread.content,
          author: thread.author,
          tags: thread.tags,
          createdAt: thread.createdAt,
          score
        };
      })
      .filter(thread => thread.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      let searchResults: SearchResult[] = [];
      
      if (searchMode === 'semantic' && hasAI) {
        searchResults = await performSemanticSearch(query);
      } else {
        searchResults = performKeywordSearch(query);
      }
      
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      initializeAIService(apiKey);
      setHasAI(true);
      setShowApiKeyInput(false);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.split(' ').join('|')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => (
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    ));
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={hasAI ? "Search by meaning or keywords..." : "Search by keywords..."}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>

        {/* Search Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {hasAI && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSearchMode('semantic')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchMode === 'semantic'
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  Semantic
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMode('keyword')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchMode === 'keyword'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Keyword
                </button>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {results.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {results.length} results found
            </p>
          )}
        </div>
      </form>

      {/* Search Results */}
      <div className="space-y-4">
        {isSearching ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => onResultClick?.(result.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {Math.round(result.score * 100)}% match
                  </span>
                  {searchMode === 'semantic' && hasAI && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                      Gemini AI
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{result.author.name}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {highlightText(result.title, query)}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {highlightText(result.content.substring(0, 200) + '...', query)}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {result.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : query && !isSearching ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or using different keywords.
            </p>
          </motion.div>
        ) : null}
      </div>

      {/* AI Status */}
      {!hasAI && !showApiKeyInput && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Enable AI for Better Search
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Add your free Gemini API key to unlock semantic search and find content by meaning.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Key className="h-4 w-4 mr-1" />
              Add Key
            </button>
          </div>
        </div>
      )}

      {/* API Key Input */}
      {showApiKeyInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get your free API key at: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">ai.google.dev</code>
              </p>
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
        </motion.div>
      )}
    </div>
  );
};

export default SemanticSearch;
