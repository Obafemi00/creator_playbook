'use client'

import { motion } from 'framer-motion'
import React from 'react'

type MotionButtonProps = React.ComponentPropsWithoutRef<typeof motion.button>

type AuthButtonProps = MotionButtonProps & {
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

export function AuthButton({ 
  children, 
  loading = false, 
  variant = 'primary',
  className = '',
  disabled,
  type = 'submit',
  ...props 
}: AuthButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        w-full px-6 py-3.5 rounded-xl font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'primary' 
          ? 'bg-[#FF7A1A] text-white hover:bg-[#FF7A1A]/90 shadow-lg shadow-[#FF7A1A]/20' 
          : 'bg-[#2a2a35] text-[#f2f2f2] hover:bg-[#3a3a45] border border-[#3a3a45]'
        }
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          />
          Processing...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
