'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FadeIn } from '@/components/motion'

const steps = [
  {
    title: 'Watch',
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
const WatchIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path
      d="M12 8v4l3 2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ThinkIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path
      d="M7 16c0-2 2-3 5-3s5 1 5 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
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

const iconComponents = [WatchIcon, ThinkIcon, ActIcon]

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
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-charcoal text-center mb-12 md:mb-16">
            How it works
          </h2>
        </FadeIn>

        {/* Cards Container */}
        <div className="relative">
          {/* Connecting Line - Runs through cards at vertical center */}
          <div className="absolute top-1/2 left-0 right-0 h-[1.5px] hidden md:block pointer-events-none -translate-y-1/2">
            <svg className="w-full h-full" viewBox="0 0 1000 2" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <motion.line
                x1="0"
                y1="1"
                x2="1000"
                y2="1"
                stroke="#2B2B2B"
                strokeWidth="1.5"
                strokeOpacity="0.2"
                strokeDasharray="1000"
                strokeDashoffset={useTransform(lineProgress, (val) => 1000 - val * 1000)}
              />
            </svg>
          </div>

          {/* Three Horizontal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {steps.map((step, index) => {
              const IconComponent = iconComponents[index]
              return (
                <FadeIn key={step.title} duration={0.6} delay={0.15 + index * 0.1}>
                  <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 flex flex-col items-center text-center h-full">
                    {/* Icon Container */}
                    <div className={`${step.iconBg} rounded-2xl w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-6 relative z-10`}>
                      <div style={{ color: step.iconColor }} className="opacity-90">
                        <IconComponent />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-4 leading-tight">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base md:text-lg text-charcoal/65 leading-relaxed font-sans">
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
