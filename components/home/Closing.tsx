'use client'

import { FadeIn, SlideIn } from '@/components/motion'

export function Closing() {
  return (
    <section className="py-24 px-6 lg:px-8 relative text-center">
      <div className="max-w-3xl mx-auto">
        <FadeIn duration={0.55}>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-8 text-charcoal">
            Be Intentional
          </h2>
        </FadeIn>
        
        <SlideIn delay={0.1} y={12} duration={0.55}>
          <p className="text-xl md:text-2xl text-charcoal/80 leading-relaxed max-w-2xl mx-auto">
            Creator Playbook isn&apos;t something you buy.
            <br />
            It&apos;s a story you step into.
          </p>
        </SlideIn>
      </div>
    </section>
  )
}
