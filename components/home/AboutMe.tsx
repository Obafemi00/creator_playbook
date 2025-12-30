'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { FadeIn } from '@/components/motion'
import { SquareImage } from '@/components/ui/SquareImage'

export function AboutMe() {
  const [isExpanded, setIsExpanded] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Animation variants
  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 12 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      }
    }
  }

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      x: prefersReducedMotion ? 0 : 16 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.1, // Stagger: image after text
      }
    }
  }

  const imageHoverVariants = {
    rest: {
      scale: 1,
      y: 0,
    },
    hover: {
      scale: 1.015,
      y: -2,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }
    }
  }

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-24 px-6 lg:px-8 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <FadeIn duration={0.55}>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-16 text-charcoal dark:text-[#F5F7FF]">
            About me
          </h2>
        </FadeIn>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Text Content (7 columns on desktop) */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:col-span-7 space-y-6"
          >
            <div className="text-lg text-charcoal/80 dark:text-[#B7BCCB] leading-relaxed">
              <p>
                This is the result of a ten year journey, starting in 2015.
              </p>
              <p>
                The first 5 years were tech, driven by pure curiosity. I got hooked on the idea that you can give a computer instructions and it will execute them right in front of you. That obsession turned into building small games and apps, then real projects and early products, launching things while still in uni.
              </p>

              {/* Read more button */}
              <div className="mt-4">
                <button
                  onClick={toggleExpand}
                  aria-expanded={isExpanded}
                  aria-controls="about-me-expanded"
                  className="text-orange dark:text-[#FF7A1A] font-sans text-base font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-orange dark:focus:ring-[#FF7A1A] focus:ring-offset-2 dark:focus:ring-offset-[#0B0C10] rounded transition-all duration-200"
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
                        The next 5 years were about creating. I followed that same curiosity into design, art, motion, and 3D, learning what makes us stand out, and how to make things people actually feel. That was my introduction to storytelling.
                      </p>
                      <p>
                        5 years of tech and 5 years of art. That order matters. Here&apos;s why:
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
          </motion.div>

          {/* Right Column: Image (5 columns on desktop) */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:col-span-5 order-first lg:order-last"
          >
            <motion.div
              variants={prefersReducedMotion ? {} : imageHoverVariants}
              initial="rest"
              whileHover="hover"
              className="relative group"
            >
              {/* Accent Glow Ring (behind image) */}
              <div 
                className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[#FF7A1A]/10 to-[#FF7A1A]/5 dark:from-[#FF7A1A]/15 dark:to-[#FF7A1A]/8 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300 -z-10"
                aria-hidden="true"
              />

              {/* Square Image */}
              <SquareImage
                src="/images/sav.jpg"
                alt="Sav"
                size="large"
                priority={false}
              />

              {/* Subtle radial gradient accent in corner */}
              <div 
                className="absolute -top-4 -right-4 w-32 h-32 bg-[#FF7A1A]/10 dark:bg-[#FF7A1A]/15 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none -z-10"
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
