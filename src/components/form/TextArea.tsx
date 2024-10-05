import { useTheme } from 'next-themes'
import { TextAreaProps } from "@/interfaces/componentsInterface"

const TextArea: React.FC<TextAreaProps> = ({ label, error, ...props }) => {
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <textarea
        className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${error 
            ? 'border-red-500' 
            : isDark 
              ? 'border-gray-600 bg-gray-700 text-white' 
              : 'border-gray-300 bg-white text-gray-900'
          }
          ${isDark ? 'focus:border-blue-500' : 'focus:border-blue-500'}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default TextArea