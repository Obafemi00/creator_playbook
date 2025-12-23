'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface SupportSelectorProps {
  selectedAmount: number | null
  onSelect: (amount: number) => void
  prefersReducedMotion?: boolean
}

const amounts = [1, 2, 3]

export function SupportSelector({ 
  selectedAmount, 
  onSelect,
  prefersReducedMotion = false 
}: SupportSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {amounts.map((amount, index) => (
        <SupportCard
          key={amount}
          amount={amount}
          isSelected={selectedAmount === amount}
          onSelect={() => onSelect(amount)}
          index={index}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  )
}

interface SupportCardProps {
  amount: number
  isSelected: boolean
  onSelect: () => void
  index: number
  prefersReducedMotion: boolean
}

function SupportCard({ 
  amount, 
  isSelected, 
  onSelect, 
  index,
  prefersReducedMotion 
}: SupportCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.2 : 0.5,
        delay: prefersReducedMotion ? 0 : 0.1 + index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={!prefersReducedMotion ? { 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full sm:w-32 h-32 rounded-2xl
        border-2 transition-all duration-300
        flex flex-col items-center justify-center
        font-display text-3xl font-bold
        ${
          isSelected
            ? 'border-orange bg-orange/10 dark:bg-orange/20 shadow-lg shadow-orange/20'
            : 'border-charcoal/20 dark:border-[var(--border)] bg-white/40 dark:bg-[var(--card)]/50 hover:border-orange/40 hover:bg-orange/5 dark:hover:bg-orange/10 opacity-100'
        }
      `}
      style={{
        opacity: prefersReducedMotion ? 1 : (isSelected ? 1 : 0.7),
      }}
    >
      {/* Subtle glow effect when selected */}
      {isSelected && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-orange/10 blur-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <span className={isSelected ? 'text-orange' : 'text-charcoal dark:text-[var(--text)]'}>
        ${amount}
      </span>
    </motion.button>
  )
}
