'use client'

import { motion } from 'framer-motion'
import { InputHTMLAttributes, forwardRef } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="block text-sm font-medium text-[#a0a0a0]">
          {label}
        </label>
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <input
            ref={ref}
            {...props}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-[#0f0f12]/50 border border-[#2a2a35]
              text-[#f2f2f2] placeholder:text-[#6b6b6b]
              focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:border-[#FF7A1A]/50
              transition-all duration-300
              ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
              ${className}
            `}
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    )
  }
)

AuthInput.displayName = 'AuthInput'
