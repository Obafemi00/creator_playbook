import Link from 'next/link'
import { FadeIn } from '@/components/motion'

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <FadeIn>
        <div className="text-center max-w-md">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-charcoal">404</h1>
          <p className="text-xl text-charcoal/70 mb-8">Page not found</p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-orange text-offwhite rounded-full font-medium hover:bg-orange/90 transition-all duration-300"
          >
            Go home
          </Link>
        </div>
      </FadeIn>
    </div>
  )
}
