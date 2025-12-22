'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn, SlideIn } from '@/components/motion'

export function AboutMe() {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <section id="about" className="py-24 px-6 lg:px-8 relative">
      <div className="max-w-[65ch] mx-auto">
        <FadeIn duration={0.55}>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-12 text-charcoal">
            About me
          </h2>
        </FadeIn>
        
        <SlideIn delay={0.1} y={12} duration={0.55}>
          <div className="space-y-6 text-lg text-charcoal/80 leading-relaxed">
            <p>
              This is the result of a ten year journey, starting in 2015.
            </p>
            <p>
              The first 3 years were tech, driven by pure curiosity. I got hooked on the idea that you can give a computer instructions and it will execute them right in front of you. That obsession turned into building small games and apps, then real projects and early products, launching things while still in uni.
            </p>

            {/* Read more button */}
            <div className="mt-4">
              <button
                onClick={toggleExpand}
                aria-expanded={isExpanded}
                aria-controls="about-me-expanded"
                className="text-orange font-sans text-base font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 rounded transition-all duration-200"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            </div>

            {/* Collapsible content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  id="about-me-expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="space-y-6 pt-2">
                    <p>
                      The next 7 years were about creating. I followed that same curiosity into design, art, motion, and 3D, learning what makes us stand out, and how to make things people actually feel. That was my introduction to storytelling.
                    </p>
                    <p>
                      3 years of tech and 7 years of art. That order matters. Here&apos;s why:
                    </p>
                    <p>
                      Someone who spent their ten years in tech sees this new era through the lens of systems. Someone who spent ten years as a creator sees it through craft and culture. I&apos;ve lived both worlds long enough to see the overlap, and the gap creators are standing in right now.
                    </p>
                    <p>
                      Creator Playbook is built for that gap.
                    </p>
                    <p>
                      A monthly checkpoint to slow down, understand what&apos;s happening, test simple strategies, and keep building with intention. I&apos;m inviting you to be a part of that journey.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SlideIn>
      </div>
    </section>
  )
}
