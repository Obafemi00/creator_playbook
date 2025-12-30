'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from './NavLink'
import { MobileMenu } from './MobileMenu'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use colorful logo for both light and dark modes
  const logoSrc = '/logo/Creator_Playbook_Logo_Full_Colorful_NoBG.png'

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/60 dark:bg-[var(--bg)]/80 backdrop-blur-sm border-b border-[var(--border)]"
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - wordmark only, generous spacing, never boxed */}
            <Link 
              href="/" 
              className="flex items-center hover:opacity-80 transition-opacity duration-300"
            >
              {mounted ? (
                <Image
                  src={logoSrc}
                  alt="Creator Playbook"
                  width={2586}
                  height={1008}
                  className="h-12 md:h-14 w-auto"
                  priority
                />
              ) : (
                <div className="h-12 md:h-14 w-24 bg-charcoal/10 rounded" />
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/" pathname={pathname}>
                Home
              </NavLink>
              <NavLink href="/events" pathname={pathname}>
                Events
              </NavLink>
              <NavLink href="/#about" pathname={pathname}>
                About
              </NavLink>
              <ThemeToggle />
            </div>

            {/* Mobile: Theme Toggle + Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[var(--text)] hover:text-[var(--brand-orange)] transition-colors"
                aria-label="Open menu"
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
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
      />
    </>
  )
}

