import React from 'react'
import { motion } from 'framer-motion'
import { BaseAnimationProps } from '@/interfaces/componentsInterface'

const ScaleIn: React.FC<BaseAnimationProps> = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  ...props 
}) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ 
      duration, 
      delay, 
      type: 'spring', 
      stiffness: 260, 
      damping: 20 
    }}
    {...props}
  >
    {children}
  </motion.div>
)

export default ScaleIn