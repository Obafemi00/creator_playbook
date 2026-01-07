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
            Creators just like you building tools that help you think clearly and create{'\u00A0'}faster.
          </motion.p>
        </div>

        {/* Team Members - Single row layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {/* Herb Codes */}
          <motion.div
            variants={imageRevealVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: prefersReducedMotion ? 0 : 0.1 }}
            className="group"
          >
            <motion.div
              className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.18)] mb-6"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, boxShadow: '0_24px_60px_rgba(0,0,0,0.25)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/femi.jpeg"
                alt="Herb Codes, Web Ninja"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority
              />
            </motion.div>
            
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ delay: prefersReducedMotion ? 0 : 0.22 }}
              className="text-center"
            >
              <div className="relative mb-3 inline-block">
                <motion.h3
                  className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-[var(--text)] inline-block"
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
              
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
                className="mt-2 shrink-0"
              >
                <span className="inline-flex items-center justify-center whitespace-nowrap h-7 px-3 text-xs font-medium tracking-wide rounded-full border border-[var(--border)] bg-[var(--card)]/50 dark:bg-white/5 text-[var(--muted)] dark:text-white/80 backdrop-blur">
                  Web Ninja
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Favour */}
          <motion.div
            variants={imageRevealVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
            className="group"
          >
            <motion.div
              className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.18)] mb-6"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, boxShadow: '0_24px_60px_rgba(0,0,0,0.25)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/favour.jpeg"
                alt="Favour, Quality Control"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
            
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ delay: prefersReducedMotion ? 0 : 0.32 }}
              className="text-center"
            >
              <div className="relative mb-3 inline-block">
                <motion.h3
                  className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-[var(--text)] inline-block"
                >
                  Favour
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
              
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: prefersReducedMotion ? 0 : 0.6 }}
                className="mt-2 shrink-0"
              >
                <span className="inline-flex items-center justify-center whitespace-nowrap h-7 px-3 text-xs font-medium tracking-wide rounded-full border border-[var(--border)] bg-[var(--card)]/50 dark:bg-white/5 text-[var(--muted)] dark:text-white/80 backdrop-blur">
                  Quality Control
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Odee */}
          <motion.div
            variants={imageRevealVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
            className="group"
          >
            <motion.div
              className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.18)] mb-6"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, boxShadow: '0_24px_60px_rgba(0,0,0,0.25)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/odee.jpeg"
                alt="Odee, Content Curator"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
            
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ delay: prefersReducedMotion ? 0 : 0.42 }}
              className="text-center"
            >
              <div className="relative mb-3 inline-block">
                <motion.h3
                  className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-[var(--text)] inline-block"
                >
                  Odee
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
              
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: prefersReducedMotion ? 0 : 0.7 }}
                className="mt-2 shrink-0"
              >
                <span className="inline-flex items-center justify-center whitespace-nowrap h-7 px-3 text-xs font-medium tracking-wide rounded-full border border-[var(--border)] bg-[var(--card)]/50 dark:bg-white/5 text-[var(--muted)] dark:text-white/80 backdrop-blur">
                  Content Curator
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Sav */}
          <motion.div
            variants={imageRevealVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: prefersReducedMotion ? 0 : 0.4 }}
            className="group"
          >
            <motion.div
              className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[var(--border)] dark:border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.18)] mb-6"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, boxShadow: '0_24px_60px_rgba(0,0,0,0.25)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/sav.jpg"
                alt="Sav, Team Lead"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority
              />
            </motion.div>
            
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ delay: prefersReducedMotion ? 0 : 0.52 }}
              className="text-center"
            >
              <div className="relative mb-3 inline-block">
                <motion.h3
                  className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-[var(--text)] inline-block"
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
              
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: prefersReducedMotion ? 0 : 0.8 }}
                className="mt-2 shrink-0"
              >
                <span className="inline-flex items-center justify-center whitespace-nowrap h-7 px-3 text-xs font-medium tracking-wide rounded-full border border-[var(--border)] bg-[var(--card)]/50 dark:bg-white/5 text-[var(--muted)] dark:text-white/80 backdrop-blur">
                  Team Lead
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
