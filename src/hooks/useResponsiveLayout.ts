import { useState, useEffect } from 'react'

const useResponsiveLayout = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkLayout = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    window.addEventListener('resize', checkLayout)
    checkLayout() 

    return () => window.removeEventListener('resize', checkLayout)
  }, [breakpoint])

  return isMobile
}

export default useResponsiveLayout