import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { DropdownProps } from '@/interfaces/componentsInterface'

const Dropdown: React.FC<DropdownProps> = ({ label, items, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const mobileStyles = isMobile ? 'w-full' : ''
  const desktopStyles = !isMobile ? 'relative inline-block text-left' : ''

  return (
    <div className={`${mobileStyles} ${desktopStyles}`} ref={dropdownRef}>
      <div>
        <button
          type="button"
          className={`inline-flex justify-between items-center w-full rounded-md border shadow-sm px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 ${
            isDark
              ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } ${isMobile ? 'text-left' : ''}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          {label}
          <ChevronDown className={`ml-2 h-5 w-5 transform ${isOpen ? 'rotate-180' : ''} transition-transform`} />
        </button>
      </div>

      {isOpen && (
        <div
          className={`${
            isMobile ? 'w-full' : 'origin-top-right absolute right-0 mt-2 w-56'
          } rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`block px-4 py-2 text-sm ${
                  isDark
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown