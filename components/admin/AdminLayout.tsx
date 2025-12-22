'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ReactNode } from 'react'

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-offwhite">
      <nav className="bg-white/60 backdrop-blur-sm border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="font-display text-xl font-bold text-orange">
              Creator Playbook Admin
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className={`text-sm hover:text-orange transition-colors ${
                  pathname === '/admin' ? 'text-orange font-medium' : 'text-charcoal/70'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/volumes"
                className={`text-sm hover:text-orange transition-colors ${
                  pathname?.startsWith('/admin/volumes') ? 'text-orange font-medium' : 'text-charcoal/70'
                }`}
              >
                Volumes
              </Link>
              <Link
                href="/admin/admins"
                className={`text-sm hover:text-orange transition-colors ${
                  pathname === '/admin/admins' ? 'text-orange font-medium' : 'text-charcoal/70'
                }`}
              >
                Admins
              </Link>
              <Link
                href="/"
                className="text-sm text-charcoal/70 hover:text-orange transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  )
}

