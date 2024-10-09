import { useState, useEffect, useRef } from 'react';
import { SearchableMultiSelectProps } from '@/interfaces/componentsInterface';
import { useTheme } from 'next-themes';

const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  label,
  placeholder = 'Search...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

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

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  const isDarkMode = theme === 'dark';

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          className={`w-full p-2 border rounded ${
            isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-700 border-gray-300'
          }`}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && (
          <div className={`absolute z-10 w-full mt-1 border rounded shadow-lg max-h-60 overflow-auto ${
            isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
          }`}>
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`p-2 cursor-pointer ${
                  selectedValues.includes(option.value) 
                    ? isDarkMode ? 'bg-blue-700' : 'bg-blue-100'
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedValues.map((value) => (
          <div
            key={value}
            className={`px-2 py-1 text-sm rounded flex items-center ${
              isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {options.find((o) => o.value === value)?.label}
            <button
              className={`ml-2 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}
              onClick={() => handleSelect(value)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchableMultiSelect;