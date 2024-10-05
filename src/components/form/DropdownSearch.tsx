import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { DropdownSearchProps, DropdownItem } from '@/interfaces/componentsInterface';
import { useDebounce } from '@/hooks/useDebounce';

const DropdownSearch = ({ 
  fetchData,
  onSelect, 
  placeholder = 'Search...', 
  labelKey = 'label', 
  valueKey = 'value',
  debounceTime = 300
}: DropdownSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const debouncedSearchTerm = useDebounce(searchTerm, debounceTime);

  const loadData = useCallback(async () => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      try {
        const data = await fetchData(debouncedSearchTerm);
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setItems([]);
    }
  }, [debouncedSearchTerm, fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSelectItem = (item: DropdownItem) => {
    onSelect(item);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <li className="px-4 py-2 text-gray-500 dark:text-gray-400">Loading...</li>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <li
                key={item[valueKey] || index}
                onClick={() => handleSelectItem(item)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-white"
              >
                {item[labelKey]}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 dark:text-gray-400">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownSearch;