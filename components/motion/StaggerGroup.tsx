'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StaggerGroupProps {
  children: ReactNode
  staggerDelay?: number
}

export function StaggerGroup({ children, staggerDelay = 0.1 }: StaggerGroupProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.55,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

