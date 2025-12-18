import type { Metadata } from 'next'
import { Baloo_2, DM_Sans } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Creator Playbook',
  description: 'Not a course. Not a hustle. This is a journey.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-offwhite text-charcoal">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

