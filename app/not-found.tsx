import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">404</h1>
      <p className="text-xl text-charcoal/80 mb-8">Page not found</p>
      <Link
        href="/"
        className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors inline-block"
      >
        Go home
      </Link>
    </div>
  )
}

