'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AboutMe() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-4xl font-bold mb-8">About me</h2>
        <div className="space-y-4 text-lg text-charcoal/80 leading-relaxed">
          <p>
            I started in 2015. Three years in tech, seven years creating. Overlap, gaps, and everything in between.
          </p>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                <p>
                  I built Creator Playbook for that gap. For the space between &quot;I want to create&quot; and &quot;I&apos;m creating.&quot; For the moments when you&apos;re stuck, uncertain, or just need a nudge in the right direction.
                </p>
                <p>
                  This isn&apos;t theory. It&apos;s practice. It&apos;s what I wish I had when I was starting. It&apos;s what I use now to keep going.
                </p>
                <div className="flex items-center gap-2 text-sm text-charcoal/60 mt-6">
                  <span className="w-12 h-px bg-charcoal/20"></span>
                  <span>2015 → Now</span>
                  <span className="w-12 h-px bg-charcoal/20"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange hover:text-orange/80 font-semibold mt-4"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        </div>
      </motion.div>
    </section>
  )
}

