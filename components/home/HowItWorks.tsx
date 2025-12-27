'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FadeIn } from '@/components/motion'

const steps = [
  {
    title: 'Join',
    description: 'A short monthly event exploring one idea that matters to creators right now.',
    iconBg: 'bg-teal/20',
    iconColor: '#5FB3B3',
  },
  {
    title: 'Think',
    description: 'About the strategy and how you can apply it to your journey.',
    iconBg: 'bg-orange/20',
    iconColor: '#FF7A1A',
  },
  {
    title: 'Act',
    description: 'On it and share your story. Nothing more.',
    iconBg: 'bg-lavender/20',
    iconColor: '#C6B7E2',
  },
]

// Clean, modern icons - consistent style
const JoinIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path
      d="M10 8l6 4-6 4V8z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
    />
  </svg>
)

const ThinkIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Light bulb - main bulb shape */}
    <path
      d="M12 3C9.5 3 7.5 5 7.5 7.5c0 1.5.5 2.5 1.5 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 3c2.5 0 4.5 2 4.5 4.5 0 1.5-.5 2.5-1.5 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bulb body - rounded bottom */}
    <path
      d="M9 11c0 2 1.5 3.5 3 3.5s3-1.5 3-3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bulb base/connector */}
    <path
      d="M10.5 14.5h3M11 16.5h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Light rays - subtle indication of brightness */}
    <path
      d="M6 8l-1.5-1.5M18 8l1.5-1.5M6 12l-1.5 1.5M18 12l1.5 1.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    />
  </svg>
)

const ActIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 12h14M13 7l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const iconComponents = [JoinIcon, ThinkIcon, ActIcon]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Animate line drawing from left to right - completes before section exits
  const lineProgress = useTransform(scrollYProgress, [0, 0.85], [0, 1], {
    clamp: true,
  })

  return (
    <section ref={sectionRef} className="py-16 md:py-20 px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <FadeIn duration={0.6} delay={0.1}>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--how-heading)] text-center mb-12 md:mb-16">
            How it works
          </h2>
        </FadeIn>

        {/* Cards Container */}
        <div className="relative">
          {/* Connecting Line - Runs through cards at vertical center */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] hidden md:block pointer-events-none -translate-y-1/2">
            <svg className="w-full h-full" viewBox="0 0 1000 2" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              {/* Base line (muted) */}
              <line
                x1="0"
                y1="1"
                x2="1000"
                y2="1"
                stroke="var(--how-line-muted)"
                strokeWidth="2"
              />
              {/* Animated progress line (full orange in dark mode) */}
              <motion.line
                x1="0"
                y1="1"
                x2="1000"
                y2="1"
                stroke="var(--how-line)"
                strokeWidth="2"
                strokeDasharray="1000"
                strokeDashoffset={useTransform(lineProgress, (val) => 1000 - val * 1000)}
                style={{
                  filter: 'drop-shadow(0 0 2px var(--how-line))',
                }}
              />
              {/* Nodes at card positions */}
              <motion.circle
                cx="166.67"
                cy="1"
                r="4"
                fill="var(--how-node)"
                style={{
                  opacity: useTransform(lineProgress, [0.15, 0.3], [0, 1], { clamp: true }),
                }}
              />
              <motion.circle
                cx="500"
                cy="1"
                r="4"
                fill="var(--how-node)"
                style={{
                  opacity: useTransform(lineProgress, [0.45, 0.6], [0, 1], { clamp: true }),
                }}
              />
              <motion.circle
                cx="833.33"
                cy="1"
                r="4"
                fill="var(--how-node)"
                style={{
                  opacity: useTransform(lineProgress, [0.75, 0.9], [0, 1], { clamp: true }),
                }}
              />
            </svg>
          </div>

          {/* Three Horizontal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {steps.map((step, index) => {
              const IconComponent = iconComponents[index]
              return (
                <FadeIn key={step.title} duration={0.6} delay={0.15 + index * 0.1}>
                  <div 
                    className="relative rounded-3xl p-8 md:p-10 flex flex-col items-center text-center h-full backdrop-blur-sm border shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--how-card-bg)',
                      borderColor: 'var(--how-card-border)',
                      boxShadow: '0 4px 12px var(--how-card-shadow)',
                    }}
                  >
                    {/* Radial highlight at top (dark mode only) */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 rounded-full opacity-30 dark:block hidden pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
                      }}
                    />

                    {/* Icon Container with Badge (dark mode) */}
                    <div className="relative z-10 mb-6 w-24 h-24 md:w-28 md:h-28">
                      {/* Badge background (dark mode only) */}
                      <div 
                        className="absolute inset-0 rounded-2xl border dark:block hidden"
                        style={{
                          backgroundColor: 'var(--how-badge-bg)',
                          borderColor: 'var(--how-badge-border)',
                        }}
                      />
                      {/* Icon container */}
                      <div className={`${step.iconBg} rounded-2xl w-full h-full flex items-center justify-center relative`}>
                        <div style={{ color: step.iconColor }} className="opacity-90 dark:opacity-100">
                          <IconComponent />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      className="font-display text-2xl md:text-3xl font-bold mb-4 leading-tight"
                      style={{ color: 'var(--how-heading)' }}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p 
                      className="text-base md:text-lg leading-relaxed font-sans"
                      style={{ color: 'var(--how-body)' }}
                    >
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
