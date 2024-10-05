import { CardProps } from '@/interfaces/componentsInterface'
import { twMerge } from 'tailwind-merge'

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  const baseStyles = `
    bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg
    rounded-xl shadow-lg border border-white border-opacity-30
    p-6 transition-all duration-300 ease-in-out
    hover:shadow-xl hover:bg-opacity-30
  `

  const cardStyles = twMerge(baseStyles, className)

  return (
    <div className={cardStyles} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card