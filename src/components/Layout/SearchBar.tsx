
import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex-1 max-w-lg mx-4 md:mx-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isMobile ? "Search..." : "Search knowledge threads..."
          }
          className="block w-full pl-8 md:pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
        />
      </form>
    </div>
  );
};

export default SearchBar;
