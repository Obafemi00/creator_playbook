import { Section } from '@/components/Section'
import { FadeIn } from '@/components/motion'

export default function AboutPage() {
  return (
    <div className="relative">
      <Section className="pt-32">
        <FadeIn>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-charcoal">
            About
          </h1>
          <div className="space-y-8 text-lg text-charcoal/80 leading-relaxed max-w-3xl">
            <p>
              Creator Playbook is for creators who want to build with intention. It&apos;s not about perfection or following someone else&apos;s path. It&apos;s about taking what works, leaving what doesn&apos;t, and building something that matters to you.
            </p>
            <p>
              Every month, on the 1st, we release a new event. Each event is a chapter in the journey. Simple strategies. One clear action. No noise. No hype.
            </p>
          </div>
        </FadeIn>
      </Section>
    </div>
  )
}
