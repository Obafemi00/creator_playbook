import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Layout } from '@/components/Layout'
import { Providers } from './providers'

const dmSans = localFont({
  variable: '--font-dm-sans',
  display: 'swap',
  src: [
    { path: '../public/fonts/DMSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/DMSans-Medium.woff2', weight: '500', style: 'normal' },
  ],
})

const baloo2 = localFont({
  variable: '--font-baloo2',
  display: 'swap',
  src: [
    { path: '../public/fonts/Baloo2-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Baloo2-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/Baloo2-Bold.woff2', weight: '700', style: 'normal' },
  ],
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
    <html lang="en" className={`${baloo2.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[var(--bg)] text-[var(--text)]">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
