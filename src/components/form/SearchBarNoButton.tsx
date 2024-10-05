import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SearchBarNoButtonProps } from '@/interfaces/componentsInterface';


const SearchBarNoButton: React.FC<SearchBarNoButtonProps> = ({ 
  onSearch, 
  placeholder = 'Search...', 
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const inputClassName = `w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
    theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
  }`;

  const clearButtonClassName = `absolute right-3 top-1/2 transform -translate-y-1/2 ${
    theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
  }`;

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        className={inputClassName}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          className={clearButtonClassName}
          onClick={handleClear}
          aria-label="Clear search"
        >
          &#x2715; {/* Unicode for 'x' */}
        </button>
      )}
    </div>
  );
};

export default SearchBarNoButton;