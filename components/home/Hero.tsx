'use client'

import { FadeIn, SlideIn, StaggerGroup, StaggerItem } from '@/components/motion'
import { Button } from '@/components/Button'

export function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto text-center">
        <StaggerGroup>
          <StaggerItem>
            <FadeIn delay={0} duration={0.55}>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight text-charcoal">
                Not a course. Not a hustle. This is a journey.
              </h1>
            </FadeIn>
          </StaggerItem>
          
          <StaggerItem>
            <SlideIn delay={0.15} y={12} duration={0.55}>
              <p className="text-xl sm:text-2xl text-charcoal/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                Monthly events, simple strategies, and one clear action for creators who want to build with intention.
              </p>
            </SlideIn>
          </StaggerItem>
          
          <StaggerItem>
            <FadeIn delay={0.25} duration={0.55}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/events" variant="primary">
                  Watch the latest event
                </Button>
              </div>
            </FadeIn>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  )
}
