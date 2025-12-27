'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Email gate configuration
const PLAYBOOK_EMAIL_GATE_ENABLED = true

// PDF file path (URL-encoded for spaces)
const PLAYBOOK_PDF_PATH = '/docs/100%20Prompts%20for%20Creators.pdf'

export default function PlaybookClient() {
  const [email, setEmail] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Check localStorage on mount
  useEffect(() => {
    if (!PLAYBOOK_EMAIL_GATE_ENABLED) {
      setIsUnlocked(true)
      return
    }

    const stored = localStorage.getItem('playbook_unlocked')
    if (stored === 'true') {
      setIsUnlocked(true)
    }
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setSubmitError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/toolbox-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to unlock playbook')
      }

      // Success: unlock and persist
      setIsUnlocked(true)
      setSubmitSuccess(true)
      localStorage.setItem('playbook_unlocked', 'true')
      
      // Clear success message after a moment
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error('Email signup error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAccessPlaybook = () => {
    if (isUnlocked) {
      window.open(PLAYBOOK_PDF_PATH, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C10] dark:bg-gradient-to-br dark:from-[#0B0C10] dark:to-[#11131A]">
      {/* Subtle background accents - premium dark theme */}
      {!prefersReducedMotion && (
        <>
          {/* Grain texture overlay */}
          <div 
            className="fixed inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
          
          {/* Radial gradient behind card */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] dark:opacity-[0.06] pointer-events-none blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255, 122, 26, 0.3), transparent)' }}
          />
          
          {/* Soft gradient accents */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.04] dark:opacity-[0.06] pointer-events-none blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255, 122, 26, 0.4), transparent)' }}
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(95, 179, 179, 0.3), transparent)' }}
            animate={{
              scale: [1, 1.15, 1],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </>
      )}

      <section className="pt-0 pb-24 md:pb-32 px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="text-center mb-20 md:mb-28"
          >
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-10 text-charcoal dark:text-[#F5F7FF] leading-tight tracking-tight">
              Creator Playbook
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-charcoal/70 dark:text-[#B7BCCB] leading-relaxed max-w-2xl mx-auto">
              Simple tools designed to help creators think clearer and move faster. Zero fluff. One job per tool.
            </p>
          </motion.div>

          {/* Featured Playbook Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.7,
              delay: prefersReducedMotion ? 0 : 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            whileHover={!prefersReducedMotion ? { 
              y: -4,
              transition: { duration: 0.3, ease: 'easeOut' }
            } : {}}
            className="relative group mb-16 md:mb-20"
          >
            {/* Card background - premium dark featured style */}
            <div className="relative bg-white/70 dark:bg-[#12141B] backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-10 md:p-12 lg:p-16 border border-charcoal/5 dark:border-[#232635] shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-xl dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] dark:hover:border-[#2A2F3D] transition-all duration-300">
              {/* Subtle decorative elements */}
              <div className="absolute top-6 right-6 w-24 h-24 opacity-[0.04] dark:opacity-[0.08] pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#FF7A1A" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="#FF7A1A" strokeWidth="0.3" />
                </svg>
              </div>
              
              <div className="absolute bottom-6 left-6 w-16 h-16 opacity-[0.03] dark:opacity-[0.06] pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 20 L80 80 L20 80 Z" fill="none" stroke="#5FB3B3" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Icon - light bulb in corner with hover effect */}
              <motion.div 
                className="absolute top-8 right-8 md:top-10 md:right-10 text-charcoal/20 dark:text-[#7E8599] group-hover:text-[#FF7A1A] transition-colors duration-300"
                whileHover={!prefersReducedMotion ? { rotate: 4 } : {}}
              >
                <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </motion.div>

              {/* Content */}
              <div className="relative z-10 max-w-2xl">
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-charcoal dark:text-[#F5F7FF] leading-tight tracking-tight">
                  100 Prompts for Creators
                </h2>
                <p className="text-lg md:text-xl text-charcoal/60 dark:text-[#B7BCCB] mb-10 md:mb-12 leading-relaxed">
                  Thought-provoking questions to clarify your creative direction and unlock new ideas.
                </p>

                {/* CTA Button with unlock badge */}
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={handleAccessPlaybook}
                    disabled={!isUnlocked}
                    whileHover={!prefersReducedMotion && isUnlocked ? { 
                      y: -2,
                      scale: 1.02,
                      boxShadow: '0 12px 30px -8px rgba(255, 122, 26, 0.5)',
                    } : {}}
                    whileTap={isUnlocked ? { scale: 0.98 } : {}}
                    className={`
                      px-8 md:px-10 py-4 md:py-5 rounded-xl font-semibold text-base md:text-lg
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:ring-offset-2 dark:focus:ring-offset-[#0B0C10]
                      ${
                        isUnlocked
                          ? 'bg-[#FF7A1A] text-[#0B0C10] hover:bg-[#FF7A1A]/90 cursor-pointer shadow-lg shadow-[#FF7A1A]/30'
                          : 'bg-[#1A1C24] dark:bg-[#1A1C24] text-[#7E8599] dark:text-[#7E8599] cursor-not-allowed border border-[#232635]'
                      }
                    `}
                  >
                    Access playbook
                  </motion.button>

                  {/* Unlocked badge */}
                  {isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="flex items-center gap-2 text-sm text-[#B7BCCB]"
                    >
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlocked</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Email Gate Section */}
          {PLAYBOOK_EMAIL_GATE_ENABLED && !isUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.6,
                delay: prefersReducedMotion ? 0 : 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="max-w-md mx-auto text-center"
            >
              <p className="text-charcoal/60 dark:text-[#B7BCCB] mb-3 text-base md:text-lg leading-relaxed">
                Enter your email to unlock this toolkit.
              </p>
              <p className="text-charcoal/50 dark:text-[#7E8599] mb-8 text-sm md:text-base">
                No spam. Just the journey.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-[420px] mx-auto">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setSubmitError(null)
                    }}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                    className={`
                      w-full px-6 py-4 md:py-5 rounded-xl
                      border bg-[#0F1117] dark:bg-[#0F1117]
                      text-[#F5F7FF] dark:text-[#F5F7FF]
                      placeholder:text-[#7E8599] dark:placeholder:text-[#7E8599]
                      focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:border-[#FF7A1A]/50
                      transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        submitError
                          ? 'border-red-500/50 dark:border-red-500/50'
                          : 'border-[#2A2F3D] dark:border-[#2A2F3D]'
                      }
                    `}
                    autoFocus
                  />
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                {submitError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 dark:text-red-400"
                  >
                    {submitError}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !email}
                  whileHover={!prefersReducedMotion && !isSubmitting && email ? { 
                    y: -2,
                    scale: 1.02,
                    boxShadow: '0 10px 25px -5px rgba(255, 122, 26, 0.4)',
                  } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className={`
                    w-full px-8 py-4 md:py-5 rounded-xl font-semibold text-base md:text-lg
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:ring-offset-2 dark:focus:ring-offset-[#0B0C10]
                    ${
                      isSubmitting || !email
                        ? 'bg-[#1A1C24] dark:bg-[#1A1C24] text-[#7E8599] dark:text-[#7E8599] cursor-not-allowed border border-[#232635]'
                        : 'bg-[#FF7A1A] text-[#0B0C10] hover:bg-[#FF7A1A]/90 cursor-pointer shadow-lg shadow-[#FF7A1A]/30'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                      Unlocking...
                    </span>
                  ) : submitSuccess ? (
                    'Unlocked ✓'
                  ) : (
                    'Unlock toolkit'
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
