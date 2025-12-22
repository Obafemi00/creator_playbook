'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface DriftProps {
  children: ReactNode
  x?: number
  y?: number
  duration?: number
}

export function Drift({ 
  children, 
  x = 20, 
  y = 20, 
  duration = 20 
}: DriftProps) {
  return (
    <motion.div
      animate={{
        x: [0, x, 0],
        y: [0, y, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  )
}

