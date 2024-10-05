import { PaginationProps } from '@/interfaces/componentsInterface'
import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { useTheme } from 'next-themes'

const PaginationButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
  const { theme } = useTheme()
  
  const baseStyles = `px-4 py-2 border text-sm font-medium
    ${theme === 'dark' 
      ? 'border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700' 
      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`
  const buttonStyles = twMerge(baseStyles, className)
  
  return (
    <button className={buttonStyles} {...props}>
      {children}
    </button>
  )
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  const { theme } = useTheme()

  const baseStyles = `flex items-center justify-between border-t px-4 py-3 sm:px-6
    ${theme === 'dark'
      ? 'border-gray-700 bg-gray-900 text-gray-200'
      : 'border-gray-200 bg-white text-gray-700'}`
  const containerStyles = twMerge(baseStyles, className)

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <nav className={containerStyles}>
      <div className="flex flex-1 justify-between sm:hidden">
        <PaginationButton
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </PaginationButton>
        <PaginationButton
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationButton>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Page <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <PaginationButton
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="rounded-l-md"
          >
            Previous
          </PaginationButton>
          <PaginationButton
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="rounded-r-md"
          >
            Next
          </PaginationButton>
        </div>
      </div>
    </nav>
  )
}

export default Pagination