'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0f0f12] via-[#1a1a1f] to-[#0f0f12]">
      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A1A]/5 via-transparent to-[#5FB3B3]/5 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#1a1a1f]/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-[#2a2a35] shadow-2xl"
          style={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 122, 26, 0.1)',
          }}
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF7A1A]/5 to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="font-display text-3xl md:text-4xl font-bold text-[#f2f2f2] mb-2"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="text-[#a0a0a0] text-sm md:text-base mb-8"
              >
                {subtitle}
              </motion.p>
            )}
            {children}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
