import React from 'react'
import { motion } from 'framer-motion'
import { BaseAnimationProps } from '@/interfaces/componentsInterface'

interface RotateInProps extends BaseAnimationProps {
  degrees?: number
}

const RotateIn: React.FC<RotateInProps> = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  degrees = 360,
  ...props 
}) => (
  <motion.div
    initial={{ rotate: degrees, scale: 0, opacity: 0 }}
    animate={{ rotate: 0, scale: 1, opacity: 1 }}
    exit={{ rotate: -degrees, scale: 0, opacity: 0 }}
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

export default RotateIn