'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
          Not a course. Not a hustle. This is a journey.
        </h1>
        <p className="text-xl sm:text-2xl text-charcoal/80 mb-12 max-w-2xl mx-auto">
          Monthly events, simple strategies, and one clear action for creators who want to build with intention.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/events"
            className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
          >
            Watch the latest event
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-semibold hover:bg-charcoal hover:text-offwhite transition-colors"
          >
            Join the journey
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

