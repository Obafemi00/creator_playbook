'use client'

import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Button } from '@/components/Button'

// TODO: Replace with actual YouTube video ID when available
const THIS_MONTH_YT_URL = "https://www.youtube.com/embed/VIDEO_ID"

const bullets = [
  'Creating intentionally in a world of chaos.',
  'Finding alignment across work and life.',
  'Staying authentic while everyone copies.',
]

// Separate component for bullet list to properly use useTransform
function BulletList({ 
  bullets, 
  isInView, 
  scrollYProgress, 
  prefersReducedMotion 
}: { 
  bullets: string[]
  isInView: boolean
  scrollYProgress: any
  prefersReducedMotion: boolean | null
}) {
  // Scroll-driven opacity: start at 0.55, reach 1.0 by 70% scroll through section
  const scrollOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    [prefersReducedMotion ? 1 : 0.55, 1],
    { clamp: true }
  )

  return (
    <motion.ul 
      className="space-y-3 text-lg text-charcoal/80 dark:text-[var(--text)]/80 leading-relaxed font-sans"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {bullets.map((bullet, index) => (
        <BulletItem
          key={index}
          bullet={bullet}
          index={index}
          scrollOpacity={scrollOpacity}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </motion.ul>
  )
}

function BulletItem({ 
  bullet, 
  index, 
  scrollOpacity, 
  prefersReducedMotion 
}: { 
  bullet: string
  index: number
  scrollOpacity: any
  prefersReducedMotion: boolean | null
}) {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: {
          x: 0,
          transition: {
            duration: prefersReducedMotion ? 0.2 : 0.4,
            delay: prefersReducedMotion ? 0 : 0.25 + index * 0.1,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      }}
      style={{
        opacity: scrollOpacity,
      }}
    >
      • {bullet}
    </motion.li>
  )
}

export function ThisMonth() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const [isHoveringVideo, setIsHoveringVideo] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  // Intersection Observer for section enter animations
  const isInView = useInView(sectionRef, { 
    once: false, // Re-trigger if user scrolls away and back
    margin: '-100px',
  })

  // Scroll progress for bullet point "read along" effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const scrollToVideo = () => {
    const videoElement = document.getElementById('this-month-video')
    if (videoElement) {
      videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section 
      ref={sectionRef} 
      className="py-24 px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Text Content */}
          <div className="space-y-6">
            {/* "This month" label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <span className="text-sm font-sans text-charcoal/60 dark:text-[var(--text)]/60 mb-3 block">
                This month
              </span>
            </motion.div>

            {/* "Chapter 1 | INTENTION" heading */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.6,
                delay: prefersReducedMotion ? 0 : 0.1,
                ease: [0.34, 1.56, 0.64, 1], // Subtle overshoot
              }}
            >
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal dark:text-[var(--text)] mb-6 leading-tight">
                Chapter 1 |{' '}
                <motion.span
                  className="text-orange inline-block"
                  initial={{ scale: 1 }}
                  animate={
                    isInView && !prefersReducedMotion
                      ? {
                          scale: [1, 1.04, 1],
                        }
                      : { scale: 1 }
                  }
                  transition={{
                    duration: 0.3,
                    delay: prefersReducedMotion ? 0 : 0.4,
                    ease: 'easeOut',
                  }}
                >
                  INTENTION
                </motion.span>
              </h2>
            </motion.div>

            {/* One sentence line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.5,
                delay: prefersReducedMotion ? 0 : 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <p className="text-lg md:text-xl text-charcoal/80 dark:text-[var(--text)]/80 leading-relaxed font-sans">
                One sentence describing the idea.
              </p>
            </motion.div>

            {/* Bullet points with stagger and scroll-driven opacity */}
            <BulletList 
              bullets={bullets}
              isInView={isInView}
              scrollYProgress={scrollYProgress}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          {/* Right Column: Video and CTA */}
          <div className="space-y-6">
            {/* Video card with ambient glow and breathing play icon */}
            <motion.div
              ref={videoRef}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.6,
                delay: prefersReducedMotion ? 0 : 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              onMouseEnter={() => setIsHoveringVideo(true)}
              onMouseLeave={() => setIsHoveringVideo(false)}
              className="relative"
            >
              {/* Ambient glow background */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 rounded-2xl blur-3xl opacity-20 -z-10"
                  animate={{
                    background: [
                      'radial-gradient(circle at 30% 50%, rgba(255, 122, 26, 0.3), rgba(95, 179, 179, 0.2), transparent)',
                      'radial-gradient(circle at 70% 50%, rgba(198, 183, 226, 0.3), rgba(255, 122, 26, 0.2), transparent)',
                      'radial-gradient(circle at 30% 50%, rgba(255, 122, 26, 0.3), rgba(95, 179, 179, 0.2), transparent)',
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              {/* Video container */}
              <div 
                id="this-month-video" 
                className="aspect-video rounded-2xl overflow-hidden bg-charcoal/5 dark:bg-[var(--card)]/50 relative group"
              >
                <iframe
                  src={THIS_MONTH_YT_URL}
                  title="This month - Chapter 1 | INTENTION"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full relative z-10"
                />
                
                {/* YouTube play button overlay - decorative breathing animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg pointer-events-none"
                    animate={
                      !isHoveringVideo && !prefersReducedMotion
                        ? {
                            scale: [1, 1.05, 1],
                          }
                        : { scale: isHoveringVideo ? 1.06 : 1 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0 : 2.5,
                      repeat: prefersReducedMotion ? 0 : Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <svg
                      className="w-10 h-10 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button with microinteractions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.5,
                delay: prefersReducedMotion ? 0 : 0.35,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <motion.div
                whileHover={!prefersReducedMotion ? { y: -2 } : {}}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button 
                  onClick={scrollToVideo} 
                  variant="primary"
                  className="relative group [&:hover]:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    Watch the event
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ x: 0 }}
                      whileHover={!prefersReducedMotion ? { x: 6 } : { x: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
