'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface NavLinkProps {
  href: string
  pathname: string | null
  children: React.ReactNode
}

export function NavLink({ href, pathname, children }: NavLinkProps) {
  // Handle hash links - for /#about, never show active state
  const isActive = href.includes('#') 
    ? false // Hash links (like /#about) never show active state
    : pathname === href

  return (
    <Link
      href={href}
      className="relative text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors duration-300"
    >
      <span className="relative inline-block">
        {children}
        {/* Active state underline - thin and soft */}
        {isActive && (
          <motion.span
            layoutId="navbar-active"
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-orange"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30
            }}
          />
        )}
        {/* Hover underline animation - only show when not active */}
        {!isActive && (
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-charcoal/20"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </span>
    </Link>
  )
}

