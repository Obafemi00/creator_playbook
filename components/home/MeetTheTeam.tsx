'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'framer-motion'

export function MeetTheTeam() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Animation variants
  const labelVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 12 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  }

  const headlineVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 12 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: prefersReducedMotion ? 0 : 0.05,
      }
    }
  }

  const copyVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: prefersReducedMotion ? 0 : 0.12,
      }
    }
  }

  // Image reveal animation - fade + slight upward motion
  const imageRevealVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  }

  // Text fade-in with delay
  const textVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: prefersReducedMotion ? 0 : 0.12,
      }
    }
  }

  // Background orb animation
  const orbVariants = {
    animate: {
      x: prefersReducedMotion ? 0 : [0, 12, 0],
      y: prefersReducedMotion ? 0 : [0, -10, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut',
      }
    }
  }

  // Role badge animation
  const badgeVariants = {
    hidden: {
      opacity: 0,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(4px)',
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: prefersReducedMotion ? 0 : 0.4,
      }
    }
  }

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background motif - soft gradient orb */}
      <motion.div
        variants={orbVariants}
        animate="animate"
        className="absolute top-1/4 right-1/4 w-96 h-96 md:w-[500px] md:h-[500px] rounded-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255, 122, 26, 0.4), rgba(95, 179, 179, 0.2), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Label + Headline */}
        <div className="mb-12 md:mb-16">
          <motion.p
            variants={labelVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-sm md:text-base font-sans uppercase tracking-wider text-[var(--muted)] mb-4"
          >
            Meet the team
          </motion.p>
          
          <motion.h2
            variants={headlineVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--text)] leading-tight"
          >
            The people behind the journey
          </motion.h2>

          <motion.p
            variants={copyVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-lg md:text-xl text-[var(--muted)] leading-relaxed max-w-2xl"
          >
            Two creators building tools that help you think clearer and move faster.
          </motion.p>
        </div>

        {/* Team Members - Alternating 2-column layout */}
        <div className="space-y-16 md:space-y-24">
          {/* Sav - Image left, Text right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Column */}
            <motion.div
              variants={imageRevealVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="relative group flex justify-center lg:justify-start"
            >
              <motion.div
                className="relative aspect-square w-[280px] sm:w-[320px] md:w-[400px] lg:w-[480px] overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Image
                  src="/images/sav.jpg"
                  alt="Sav, Team Lead"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Text Column */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              {/* Name with animated underline on hover */}
              <div className="relative mb-3">
                <motion.h3
                  className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text)] inline-block"
                >
                  Sav
                  {!prefersReducedMotion && (
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-[var(--brand-orange)]"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    />
                  )}
                </motion.h3>
              </div>

              {/* Role badge */}
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="mt-2 shrink-0"
              >
                <span className="inline-flex items-center justify-center whitespace-nowrap h-7 px-3 text-xs font-medium tracking-wide rounded-full border border-[var(--border)] bg-[var(--card)]/50 dark:bg-white/5 text-[var(--muted)] dark:text-white/80 backdrop-blur">
                  Team Lead
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Herb Codes - Image right, Text left */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Column */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="flex flex-col items-center lg:items-end text-center lg:text-right order-2 lg:order-1"
            >
              {/* Name with animated underline on hover */}
              <div className="relative mb-3">
                <motion.h3
                  className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text)] inline-block"
                >
                  Herb Codes
                  {!prefersReducedMotion && (
                    <motion.span
                      className="absolute bottom-0 right-0 h-0.5 bg-[var(--brand-orange)]"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    />
                  )}
                </motion.h3>
              </div>

              {/* Role badge */}
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="mt-2 shrink-0"
              >
                <span className="inline-flex items-center justify-center whitespace-nowrap h-7 px-3 text-xs font-medium tracking-wide rounded-full border border-[var(--border)] bg-[var(--card)]/50 dark:bg-white/5 text-[var(--muted)] dark:text-white/80 backdrop-blur">
                  Web Ninja
                </span>
              </motion.div>
            </motion.div>

            {/* Image Column */}
            <motion.div
              variants={imageRevealVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="relative group flex justify-center lg:justify-end order-1 lg:order-2"
            >
              <motion.div
                className="relative aspect-square w-[280px] sm:w-[320px] md:w-[400px] lg:w-[480px] overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Image
                  src="/images/femi.jpeg"
                  alt="Herb Codes, Web Ninja"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
