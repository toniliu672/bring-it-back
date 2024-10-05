import React from 'react'
import { motion } from 'framer-motion'
import { BaseAnimationProps, Direction } from '@/interfaces/componentsInterface'

interface SlideInProps extends BaseAnimationProps {
  direction?: Direction
}

const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  direction = 'left', 
  ...props 
}) => {
  const variants = {
    hidden: {
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default SlideIn