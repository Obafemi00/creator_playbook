'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function Nav() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user)
      if (user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === 'admin')
          })
      }
    })
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-offwhite/80 backdrop-blur-sm border-b border-charcoal/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-display text-2xl font-bold text-charcoal hover:text-orange transition-colors">
            Creator Playbook
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/events"
              className={`text-sm hover:text-orange transition-colors ${
                pathname === '/events' ? 'text-orange' : ''
              }`}
            >
              Events
            </Link>
            <Link
              href="/toolbox"
              className={`text-sm hover:text-orange transition-colors ${
                pathname === '/toolbox' ? 'text-orange' : ''
              }`}
            >
              Toolbox
            </Link>
            <Link
              href="/pricing"
              className={`text-sm hover:text-orange transition-colors ${
                pathname === '/pricing' ? 'text-orange' : ''
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`text-sm hover:text-orange transition-colors ${
                pathname === '/about' ? 'text-orange' : ''
              }`}
            >
              About
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm hover:text-orange transition-colors"
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <Link
                href="/account"
                className="text-sm hover:text-orange transition-colors"
              >
                Account
              </Link>
            ) : (
              <Link
                href="/signin"
                className="text-sm hover:text-orange transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

