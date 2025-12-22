'use client'

import { FadeIn, SlideIn } from '@/components/motion'
import { Button } from '@/components/Button'

// TODO: Replace with actual YouTube video ID when available
const THIS_MONTH_YT_URL = "https://www.youtube.com/embed/VIDEO_ID"

export function ThisMonth() {
  const scrollToVideo = () => {
    const videoElement = document.getElementById('this-month-video')
    if (videoElement) {
      videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section className="py-24 px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Text Content */}
          <div className="space-y-6">
            <FadeIn duration={0.6} delay={0.1}>
              <div>
                <span className="text-sm font-sans text-charcoal/60 mb-3 block">This month</span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-6 leading-tight">
                  Chapter 1 | <span className="text-orange">INTENTION</span>
                </h2>
              </div>
            </FadeIn>

            <SlideIn delay={0.15} y={10} duration={0.6}>
              <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed font-sans">
                One sentence describing the idea.
              </p>
            </SlideIn>

            <SlideIn delay={0.2} y={10} duration={0.6}>
              <ul className="space-y-3 text-lg text-charcoal/80 leading-relaxed font-sans">
                <li>• Creating intentionally in a world of chaos.</li>
                <li>• Finding alignment across work and life.</li>
                <li>• Staying authentic while everyone copies.</li>
              </ul>
            </SlideIn>
          </div>

          {/* Right Column: Video and CTA */}
          <div className="space-y-6">
            <SlideIn delay={0.25} y={10} duration={0.6}>
              <div id="this-month-video" className="aspect-video rounded-2xl overflow-hidden bg-charcoal/5">
                <iframe
                  src={THIS_MONTH_YT_URL}
                  title="This month - Chapter 1 | INTENTION"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </SlideIn>

            <SlideIn delay={0.3} y={10} duration={0.6}>
              <Button onClick={scrollToVideo} variant="primary">
                Watch the event
              </Button>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  )
}
