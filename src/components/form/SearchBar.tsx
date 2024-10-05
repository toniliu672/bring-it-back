import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Search, X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { SearchBarProps } from '@/interfaces/componentsInterface'

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  className,
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  const handleSearch = () => {
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const baseStyles = `
    flex items-center w-full max-w-md mx-auto
    border rounded-full overflow-hidden
    transition-all duration-300 ease-in-out
  `

  const focusStyles = isFocused
    ? 'ring-2 ring-blue-400'
    : isDark
    ? 'border-gray-600 hover:border-gray-500'
    : 'border-gray-300 hover:border-gray-400'

  const searchBarStyles = twMerge(
    baseStyles,
    focusStyles,
    isDark ? 'bg-gray-800' : 'bg-white',
    className
  )

  return (
    <div className={searchBarStyles}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        className={`
          w-full py-2 px-4 
          leading-tight
          focus:outline-none
          ${isDark ? 'text-gray-200 bg-gray-800' : 'text-gray-700 bg-white'}
        `}
      />
      {query && (
        <button
          onClick={handleClear}
          className={`
            p-2 hover:text-gray-700
            transition-colors duration-150 ease-in-out
            ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}
          `}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
      <button
        onClick={handleSearch}
        className={`
          p-2 text-white
          transition-colors duration-150 ease-in-out
          ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
        `}
        aria-label="Search"
      >
        <Search size={18} />
      </button>
    </div>
  )
}

export default SearchBar