'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  pathname: string | null
}

export function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use colorful logo for both light and dark modes
  const logoSrc = '/logo/Creator_Playbook_Logo_Full_Colorful_NoBG.png'
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal/10 dark:bg-black/20 backdrop-blur-sm z-50 md:hidden"
            onClick={onClose}
          />

          {/* Menu sheet */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 top-0 bg-[var(--bg)] border-b border-[var(--border)] z-50 md:hidden"
          >
            <div className="max-w-[1200px] mx-auto px-6 py-6">
              {/* Close button */}
              <div className="flex items-center justify-between mb-8">
                <Link 
                  href="/" 
                  className="flex items-center"
                  onClick={onClose}
                >
                  {mounted ? (
                    <Image
                      src={logoSrc}
                      alt="Creator Playbook"
                      width={2586}
                      height={1008}
                      className="h-32 w-auto"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-charcoal/10 rounded" />
                  )}
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 text-[var(--text)] hover:text-orange transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu items - generous spacing */}
              <nav className="flex flex-col gap-6">
                <Link
                  href="/"
                  onClick={onClose}
                  className={`text-base font-medium ${
                    pathname === '/' ? 'text-orange' : 'text-[var(--text)]/70'
                  } hover:text-[var(--text)] transition-colors`}
                >
                  Home
                </Link>
                <Link
                  href="/events"
                  onClick={onClose}
                  className={`text-base font-medium ${
                    pathname === '/events' ? 'text-orange' : 'text-[var(--text)]/70'
                  } hover:text-[var(--text)] transition-colors`}
                >
                  Events
                </Link>
                <Link
                  href="/#about"
                  onClick={onClose}
                  className="text-base font-medium text-[var(--text)]/70 hover:text-[var(--text)] transition-colors"
                >
                  About
                </Link>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

