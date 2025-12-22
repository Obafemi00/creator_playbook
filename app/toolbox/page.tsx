import { Section } from '@/components/Section'
import { FadeIn } from '@/components/motion'
import { ToolboxGate } from '@/components/ToolboxGate'

export default function ToolboxPage() {
  return (
    <div className="relative">
      <Section className="pt-16">
        <FadeIn>
          <div className="mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-charcoal">
              Creator Toolbox
            </h1>
            <p className="text-xl text-charcoal/70 leading-relaxed max-w-2xl">
              Simple tools designed to help creators think clearer and move faster. Zero fluff. One job per tool.
            </p>
          </div>

          <ToolboxGate />
        </FadeIn>
      </Section>
    </div>
  )
}
