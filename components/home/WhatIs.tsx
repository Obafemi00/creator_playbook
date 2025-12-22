'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FadeIn } from '@/components/motion'

export function WhatIs() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Opacity for lines 3-4: start faded, reveal as user scrolls
  // Lines 1-2 are always fully visible
  const line3Opacity = useTransform(scrollYProgress, [0, 0.6], [0.4, 1], {
    clamp: true,
  })
  const line4Opacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 1], {
    clamp: true,
  })

  return (
    <section ref={sectionRef} className="py-24 px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        <FadeIn duration={0.55}>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 text-charcoal">
            What is Creator Playbook?
          </h2>
        </FadeIn>
        
        <div className="space-y-3 text-lg text-charcoal/80 leading-relaxed max-w-3xl">
          {/* Line 1 - Always fully visible */}
          <p className="opacity-100">
            Creator Playbook is a monthly check-in on your creative journey.
          </p>
          
          {/* Line 2 - Always fully visible */}
          <p className="opacity-100">
            One short event on the 1st of every month.
          </p>
          
          {/* Line 3 - Reveals on scroll */}
          <motion.p
            style={{
              opacity: line3Opacity,
            }}
          >
            Simple strategies.
          </motion.p>
          
          {/* Line 4 - Reveals on scroll */}
          <motion.p
            style={{
              opacity: line4Opacity,
            }}
          >
            One clear action point: creating and building deliberately in a noisy world.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
