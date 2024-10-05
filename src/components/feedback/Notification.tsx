import { useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { XCircle, CheckCircle, Info } from 'lucide-react'
import { NotificationProps, NotificationType } from '@/interfaces/componentsInterface'

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const baseStyles = 'fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center max-w-sm'

  const typeStyles: Record<NotificationType, string> = {
    success: 'bg-green-100 text-green-800 border-l-4 border-green-500',
    error: 'bg-red-100 text-red-800 border-l-4 border-red-500',
    info: 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
  }

  const iconMap: Record<NotificationType, React.ReactNode> = {
    success: <CheckCircle className="w-6 h-6 mr-3 text-green-500" />,
    error: <XCircle className="w-6 h-6 mr-3 text-red-500" />,
    info: <Info className="w-6 h-6 mr-3 text-blue-500" />
  }

  const notificationStyles = twMerge(baseStyles, typeStyles[type])

  if (!isVisible) return null

  return (
    <div className={notificationStyles} role="alert">
      {iconMap[type]}
      <div className="flex-grow">{message}</div>
      <button 
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="ml-3 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  )
}

export default Notification