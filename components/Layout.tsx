'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="pt-28">{children}</main>
    </div>
  )
}

