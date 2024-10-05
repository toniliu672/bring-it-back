import { useTheme } from 'next-themes'
import { CheckboxProps } from "@/interfaces/componentsInterface"

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        className={`w-4 h-4 rounded focus:ring-offset-2 
          ${isDark 
            ? 'text-blue-400 border-gray-600 bg-gray-700 focus:ring-blue-400' 
            : 'text-blue-600 border-gray-300 bg-white focus:ring-blue-500'
          }
        `}
        {...props}
      />
      <label className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
    </div>
  )
}

export default Checkbox