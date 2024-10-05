import { SkeletonProps } from '@/interfaces/componentsInterface'
import { twMerge } from 'tailwind-merge'

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width, 
  height, 
  isCircle = false 
}) => {
  const baseStyles = `
    bg-gray-200 animate-pulse
    ${isCircle ? 'rounded-full' : 'rounded'}
  `

  const styles = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : '20px'
  }

  return (
    <div 
      className={twMerge(baseStyles, className)}
      style={styles}
    />
  )
}

export default Skeleton