
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { mockThreads } from '../services/mockData';
import Layout from '../components/Layout/Layout';
import SemanticSearch from '../components/Search/SemanticSearch';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [threads] = useState(mockThreads);

  const handleResultClick = (threadId: string) => {
    navigate(`/thread/${threadId}`);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Knowledge
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Search through threads using AI-powered semantic search or traditional keyword matching
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <SearchIcon className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Smart Search Features
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-white">🧠 Semantic Search</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Find content by meaning, not just keywords. Powered by AI embeddings.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-white">⚡ Keyword Search</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Traditional fast search through titles, content, and tags.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Semantic Search Component */}
        <SemanticSearch 
          threads={threads}
          onResultClick={handleResultClick}
        />
      </div>
    </Layout>
  );
};

export default Search;
