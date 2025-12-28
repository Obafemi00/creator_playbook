'use client'

import { FadeIn, SlideIn } from '@/components/motion'

export function WhyNow() {
  return (
    <section className="py-24 px-6 lg:px-8 relative">
      <div className="max-w-[65ch] mx-auto">
        <FadeIn duration={0.55}>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-12 text-charcoal">
            Why now
          </h2>
        </FadeIn>
        
        <SlideIn delay={0.1} y={12} duration={0.55}>
          <div className="space-y-6 text-lg text-charcoal/80 leading-relaxed">
            <p>
              The world feels louder than it used to. Things move fast. People are anxious. As a creator, you feel the pressure to keep up, even when you don&apos;t know what you&apos;re chasing. The result is a quiet kind of confusion where you&apos;re making content but you&apos;re losing clarity and direction.
            </p>
            <p>
              <strong>Creator Playbook exists for this moment.</strong>
            </p>
            <p>
              A monthly check-in on your creator journey that helps you slow down, pay attention to what&apos;s happening around you, test simple strategies, and turn all the noise into one clear action you can take before the next chapter.
            </p>
            <p>
              If you&apos;ve felt the confusion, the frustration, or the overwhelm, this is for you.
            </p>
          </div>
        </SlideIn>
      </div>
    </section>
  )
}
