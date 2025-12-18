'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function Closing() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-display text-3xl md:text-4xl font-bold mb-12 text-balance">
          Creator Playbook isn&apos;t something you buy. It&apos;s something you step into.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pricing"
            className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
          >
            Join
          </Link>
          <Link
            href="/events"
            className="px-8 py-4 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-semibold hover:bg-charcoal hover:text-offwhite transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

