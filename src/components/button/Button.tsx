import { ButtonProps } from '@/interfaces/componentsInterface'
import { twMerge } from 'tailwind-merge'

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50'
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  }
  
  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  }
  
  const widthStyle = fullWidth ? 'w-full' : ''
  
  const buttonStyles = twMerge(
    baseStyles,
    variantStyles[variant as keyof typeof variantStyles],
    sizeStyles[size as keyof typeof sizeStyles],
    widthStyle,
    className
  )
  
  return (
    <button className={buttonStyles} {...props}>
      {children}
    </button>
  )
}

export default Button