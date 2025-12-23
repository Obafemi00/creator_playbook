import type { Metadata } from 'next'
import { Baloo_2, DM_Sans } from 'next/font/google'
import './globals.css'
import { Layout } from '@/components/Layout'
import { Providers } from './providers'

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-baloo',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Creator Playbook',
  description: 'Not a course. Not a hustle. This is a journey.',
  icons: {
    icon: '/logo/Creator_Playbook_Logo_Icon_Colorful_GrayBG.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[var(--bg)] text-[var(--text)]">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
