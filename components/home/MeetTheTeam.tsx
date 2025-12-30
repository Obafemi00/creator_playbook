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

  // Image reveal animation using clip-path
  const imageRevealVariants = {
    hidden: {
      opacity: 0,
      clipPath: prefersReducedMotion ? 'inset(0% 0% 0% 0%)' : 'inset(12% 0% 12% 0%)',
    },
    visible: {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
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

        {/* Gallery Layout - Desktop: Asymmetric, Mobile: Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Sav - Dominant (larger) */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={imageRevealVariants}
            className="relative group"
          >
            {/* Image container with overlap effect */}
            <div className="relative mb-6">
              {/* Soft shape field behind image */}
              <div 
                className="absolute -bottom-4 -right-4 w-full h-full bg-[var(--card)] dark:bg-[#1a1a20] rounded-2xl opacity-60 dark:opacity-40 -z-10"
                style={{ transform: 'rotate(-2deg)' }}
              />
              
              {/* Image */}
              <motion.div
                {...(!prefersReducedMotion && {
                  whileHover: {
                    scale: 1.02,
                    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                  }
                })}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src="/images/sav.jpg"
                  alt="Sav, Team Lead"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </div>

            {/* Name with animated underline on hover */}
            <div className="relative">
              <motion.h3
                className="font-display text-2xl md:text-3xl font-bold mb-2 text-[var(--text)] inline-block"
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
              className="inline-block"
            >
              <span className="px-4 py-1.5 rounded-full text-sm font-sans font-medium bg-[var(--card)] dark:bg-[#1a1a20] text-[var(--muted)] border border-[var(--border)]">
                Team Lead
              </span>
            </motion.div>
          </motion.div>

          {/* Herb Codes - Offset (smaller, tighter crop) */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
              hidden: {
                opacity: 0,
                clipPath: prefersReducedMotion ? 'inset(0% 0% 0% 0%)' : 'inset(12% 0% 12% 0%)',
              },
              visible: {
                opacity: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: prefersReducedMotion ? 0 : 0.2,
                }
              }
            }}
            className="relative group lg:mt-16"
          >
            {/* Image container */}
            <div className="relative mb-6">
              {/* Soft shape field behind image - offset */}
              <div 
                className="absolute -top-4 -left-4 w-full h-full bg-[var(--card)] dark:bg-[#1a1a20] rounded-2xl opacity-60 dark:opacity-40 -z-10"
                style={{ transform: 'rotate(2deg)' }}
              />
              
              {/* Image - tighter crop */}
              <motion.div
                {...(!prefersReducedMotion && {
                  whileHover: {
                    scale: 1.02,
                    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                  }
                })}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src="/images/femi.jpeg"
                  alt="Herb Codes, Web Experience Curator"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </div>

            {/* Name with animated underline on hover */}
            <div className="relative">
              <motion.h3
                className="font-display text-2xl md:text-3xl font-bold mb-2 text-[var(--text)] inline-block"
              >
                Herb Codes
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
              className="inline-block"
            >
              <span className="px-4 py-1.5 rounded-full text-sm font-sans font-medium bg-[var(--card)] dark:bg-[#1a1a20] text-[var(--muted)] border border-[var(--border)]">
                Web Experience Curator
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
