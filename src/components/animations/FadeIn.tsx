import { motion } from 'framer-motion'
import { BaseAnimationProps } from '@/interfaces/componentsInterface'

const FadeIn: React.FC<BaseAnimationProps> = ({ 
  children, 
  duration = 0.5, 
  delay = 0, 
  ...props 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
)

export default FadeIn