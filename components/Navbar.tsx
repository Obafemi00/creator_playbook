'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from './NavLink'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-offwhite/60 backdrop-blur-sm border-b border-charcoal/5"
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - wordmark only, generous spacing, never boxed */}
            <Link 
              href="/" 
              className="flex items-center hover:opacity-80 transition-opacity duration-300"
            >
              <Image
                src="/logo/Creator Playbook Logo_Orange_Transparent.png"
                alt="Creator Playbook"
                width={2586}
                height={1008}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/" pathname={pathname}>
                Home
              </NavLink>
              <NavLink href="/events" pathname={pathname}>
                Events
              </NavLink>
              <NavLink href="/toolbox" pathname={pathname}>
                Toolbox
              </NavLink>
              <NavLink href="/#about" pathname={pathname}>
                About
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-charcoal hover:text-orange transition-colors"
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

