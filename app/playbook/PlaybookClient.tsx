'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { createSupportCheckoutSession } from '@/app/actions/stripe'
import { SupportSelector } from '@/components/SupportSelector'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PlaybookClient() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const searchParams = useSearchParams()
  const supportSuccess = searchParams?.get('support_success')

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    checkUser()
  }, [])

  // Check if user just completed support
  useEffect(() => {
    if (supportSuccess === '1') {
      // Show success state (could add a toast or success message)
      console.log('Support payment successful!')
    }
  }, [supportSuccess])

  const handleSupport = async () => {
    if (!selectedAmount) return

    // If user is logged in, use their email. Otherwise, require email input for guest support
    const supportEmail = userEmail || email
    
    if (!supportEmail) {
      setShowEmailInput(true)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(supportEmail)) {
      alert('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const { url } = await createSupportCheckoutSession(
        selectedAmount, 
        supportEmail
      )
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Support checkout error:', error)
      alert(error instanceof Error ? error.message : 'Failed to create checkout session. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background animation */}
      {!prefersReducedMotion && (
        <motion.div
          className="fixed inset-0 -z-10 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 122, 26, 0.1), transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(95, 179, 179, 0.1), transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(198, 183, 226, 0.1), transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 122, 26, 0.1), transparent 50%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      <section className="pt-6 md:pt-8 pb-24 px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-charcoal dark:text-[var(--text)]">
              Support the Team
            </h1>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.5,
                delay: prefersReducedMotion ? 0 : 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="space-y-4 text-lg md:text-xl text-charcoal/80 dark:text-[var(--text)]/80 leading-relaxed max-w-2xl mx-auto"
            >
              <p>
                This whole creator project is possible because of people like you.
              </p>
              <p>
                One Playbook, released monthly. Built with intention.
              </p>
            </motion.div>
          </motion.div>

          {/* Support Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="mb-12"
          >
            <SupportSelector
              selectedAmount={selectedAmount}
              onSelect={(amount) => {
                setSelectedAmount(amount)
                setShowEmailInput(false)
              }}
              prefersReducedMotion={!!prefersReducedMotion}
            />
          </motion.div>

          {/* Email input for guest support */}
          {showEmailInput && !userEmail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && email) {
                    handleSupport()
                  }
                }}
                placeholder="your@email.com"
                className="w-full px-6 py-4 rounded-xl border-2 border-charcoal/20 dark:border-[var(--border)] bg-white/80 dark:bg-[var(--card)]/50 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-charcoal dark:text-[var(--text)]"
                autoFocus
              />
            </motion.div>
          )}

          {/* Support Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: selectedAmount ? 1 : 0.5,
              y: 0,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.4,
              delay: prefersReducedMotion ? 0 : 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex justify-center mb-12"
          >
            <motion.button
              onClick={handleSupport}
              disabled={!selectedAmount || loading}
              whileHover={!prefersReducedMotion && selectedAmount ? { 
                y: -2,
                boxShadow: '0 10px 25px -5px rgba(255, 122, 26, 0.3), 0 8px 10px -6px rgba(255, 122, 26, 0.2)',
              } : {}}
              whileTap={{ scale: 0.98 }}
              className={`
                px-12 py-5 rounded-full font-medium text-lg
                transition-all duration-300
                ${
                  selectedAmount && !loading
                    ? 'bg-orange text-offwhite hover:bg-orange/90 cursor-pointer'
                    : 'bg-charcoal/20 dark:bg-[var(--card)]/30 text-charcoal/40 dark:text-[var(--text)]/40 cursor-not-allowed'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                  Processing...
                </span>
              ) : (
                'Support'
              )}
            </motion.button>
          </motion.div>

          {/* Monthly Context */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="text-center mb-12"
          >
            <p className="text-sm text-charcoal/60 dark:text-[var(--text)]/60">
              New Playbook released at the beginning of every month.
            </p>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="text-center"
          >
            <div className="bg-white/40 dark:bg-[var(--card)]/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-charcoal/10 dark:border-[var(--border)] max-w-2xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-charcoal dark:text-[var(--text)]">
                Download the Playbook
              </h2>
              <p className="text-charcoal/70 dark:text-[var(--text)]/70 mb-6 leading-relaxed">
                Get the current month's Playbook. Supporting the team helps us continue creating these resources.
              </p>
              <motion.a
                href="/docs/Creator%20Playbook%20Website.pdf"
                download="Creator Playbook Website.pdf"
                whileHover={!prefersReducedMotion ? { y: -2, scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                className="inline-block px-8 py-4 bg-orange text-offwhite rounded-full font-medium hover:bg-orange/90 transition-all duration-300 hover:shadow-lg"
              >
                Download
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
