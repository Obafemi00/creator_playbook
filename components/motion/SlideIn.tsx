'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SlideInProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
}

export function SlideIn({ 
  children, 
  delay = 0, 
  duration = 0.55,
  y = 12 
}: SlideInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1], // easeInOut
      }}
    >
      {children}
    </motion.div>
  )
}

