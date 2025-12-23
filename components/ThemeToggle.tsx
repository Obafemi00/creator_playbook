'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showScanline, setShowScanline] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    // Trigger scanline animation (only if motion is not reduced)
    if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowScanline(true)
      setTimeout(() => setShowScanline(false), 400)
    }
  }

  if (!mounted) {
    return (
      <div className="w-12 h-6 rounded-full bg-charcoal/10 border border-charcoal/10" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      {/* Scanline overlay */}
      <AnimatePresence>
        {showScanline && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 0.08, y: '100vh' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 pointer-events-none z-[9999] bg-gradient-to-b from-transparent via-[var(--text)] to-transparent"
          />
        )}
      </AnimatePresence>

      {/* TV Switch Toggle */}
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className="relative w-12 h-6 rounded-full border border-charcoal/20 dark:border-white/20 bg-charcoal/5 dark:bg-white/10 transition-all duration-300 hover:border-orange/40 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
      >
        {/* Toggle Knob */}
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-orange shadow-sm flex items-center justify-center"
          initial={false}
          animate={{
            x: isDark ? 24 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* TV Antenna / Icon */}
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
              rotate: isDark ? [0, -5, 5, -5, 0] : [0, 5, -5, 5, 0],
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
          >
            {isDark ? (
              // Moon icon
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ) : (
              // Sun icon
              <>
                <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" fill="none" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </motion.svg>
        </motion.div>
      </button>

    </>
  )
}
