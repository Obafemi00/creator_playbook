'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { createSupportCheckoutSession } from '@/app/actions/stripe'
import { SupportSelector } from '@/components/SupportSelector'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface PurchaseStatus {
  paid: boolean
  status: string | null
  email: string | null
  session_id?: string | null
}

export default function PlaybookClient() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>({ paid: false, status: null, email: null, session_id: null })
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [unlockAnimation, setUnlockAnimation] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const searchParams = useSearchParams()
  const supportSuccess = searchParams?.get('support_success')
  const sessionId = searchParams?.get('session_id')
  const canceled = searchParams?.get('canceled')

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

  // Check purchase status on mount and when session_id changes
  useEffect(() => {
    if (sessionId) {
      checkPurchaseStatus(sessionId, null)
    } else if (userEmail) {
      // Check by email for returning users
      checkPurchaseStatus(null, userEmail)
    }
  }, [sessionId, userEmail])

  // Poll for payment verification if success=1 but not yet verified
  useEffect(() => {
    if (supportSuccess === '1' && sessionId && !purchaseStatus.paid && !verifyingPayment) {
      setVerifyingPayment(true)
      pollPurchaseStatus(sessionId)
    }
  }, [supportSuccess, sessionId, purchaseStatus.paid, verifyingPayment])

  // Show canceled message
  useEffect(() => {
    if (canceled === '1') {
      // Could show a toast here
      console.log('Payment canceled')
    }
  }, [canceled])

  // Trigger unlock animation when purchase status changes to paid
  useEffect(() => {
    if (purchaseStatus.paid && !isUnlocked) {
      setIsUnlocked(true)
      if (!prefersReducedMotion) {
        setUnlockAnimation(true)
        setTimeout(() => setUnlockAnimation(false), 1000)
      }
    }
  }, [purchaseStatus.paid, isUnlocked, prefersReducedMotion])

  const checkPurchaseStatus = async (sessionIdParam: string | null, emailParam: string | null) => {
    try {
      const queryParam = sessionIdParam 
        ? `session_id=${sessionIdParam}` 
        : emailParam 
        ? `email=${encodeURIComponent(emailParam)}` 
        : null

      if (!queryParam) return

      const response = await fetch(`/api/purchases/status?${queryParam}`)
      const data = await response.json()
      setPurchaseStatus(data)
      
      // Update sessionId if we got it from email lookup
      if (data.session_id && !sessionIdParam) {
        // Store in URL for download endpoint
        const url = new URL(window.location.href)
        url.searchParams.set('session_id', data.session_id)
        window.history.replaceState({}, '', url.toString())
      }
    } catch (error) {
      console.error('Error checking purchase status:', error)
    }
  }

  const pollPurchaseStatus = async (sessionIdParam: string) => {
    const maxAttempts = 15 // 15 seconds max
    let attempts = 0
    const baseDelay = 1000 // Start with 1 second

    const poll = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        setVerifyingPayment(false)
        return
      }

      attempts++
      
      try {
        const response = await fetch(`/api/purchases/status?session_id=${sessionIdParam}`)
        const data = await response.json()
        
        setPurchaseStatus(data)

        // If paid, stop polling
        if (data.paid) {
          setVerifyingPayment(false)
          return
        }

        // If still not paid, continue polling with exponential backoff
        const delay = Math.min(baseDelay * Math.pow(1.5, attempts - 1), 3000) // Cap at 3 seconds
        setTimeout(() => poll(), delay)
      } catch (error) {
        console.error('Error polling purchase status:', error)
        // Continue polling on error (might be temporary)
        if (attempts < maxAttempts) {
          const delay = Math.min(baseDelay * Math.pow(1.5, attempts - 1), 3000)
          setTimeout(() => poll(), delay)
        } else {
          setVerifyingPayment(false)
        }
      }
    }

    poll()
  }

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

  const handleDownload = () => {
    if (!purchaseStatus.paid) return
    
    // Use session_id from status response or URL
    const downloadSessionId = purchaseStatus.session_id || sessionId
    if (!downloadSessionId) return
    
    // Open secure download endpoint
    window.open(`/api/playbook/download?session_id=${downloadSessionId}`, '_blank')
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
            <div className="bg-white/40 dark:bg-[var(--card)]/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-charcoal/10 dark:border-[var(--border)] max-w-2xl mx-auto relative overflow-hidden">
              {/* Unlock glow effect */}
              <AnimatePresence>
                {unlockAnimation && !prefersReducedMotion && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.2, 1] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute inset-0 bg-orange/20 rounded-2xl pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-charcoal dark:text-[var(--text)]">
                Download the Playbook
              </h2>
              <p className="text-charcoal/70 dark:text-[var(--text)]/70 mb-6 leading-relaxed">
                Get the current month's Playbook. Supporting the team helps us continue creating these resources.
              </p>

              {/* Verifying payment state */}
              {verifyingPayment && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4"
                >
                  <p className="text-sm text-charcoal/60 dark:text-[var(--text)]/60 flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-orange border-t-transparent rounded-full"
                    />
                    Verifying payment...
                  </p>
                </motion.div>
              )}

              {/* Download button */}
              <motion.button
                onClick={handleDownload}
                disabled={!isUnlocked || verifyingPayment}
                initial={false}
                animate={
                  unlockAnimation && !prefersReducedMotion
                    ? {
                        scale: [1, 1.05, 1],
                        rotate: [0, -2, 2, -2, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5, ease: 'easeOut' }}
                whileHover={!prefersReducedMotion && isUnlocked ? { y: -2, scale: 1.02 } : {}}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                className={`
                  inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-lg
                  transition-all duration-300
                  ${
                    isUnlocked && !verifyingPayment
                      ? 'bg-orange text-offwhite hover:bg-orange/90 cursor-pointer shadow-lg shadow-orange/20'
                      : 'bg-charcoal/20 dark:bg-[var(--card)]/30 text-charcoal/40 dark:text-[var(--text)]/40 cursor-not-allowed'
                  }
                `}
              >
                {isUnlocked ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Unlocks after Support
                  </>
                )}
              </motion.button>

              {!isUnlocked && !verifyingPayment && (
                <p className="text-xs text-charcoal/50 dark:text-[var(--text)]/50 mt-3">
                  Support the team to unlock the download
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
