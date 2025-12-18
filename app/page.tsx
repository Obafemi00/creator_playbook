import { Hero } from '@/components/home/Hero'
import { WhatIs } from '@/components/home/WhatIs'
import { HowItWorks } from '@/components/home/HowItWorks'
import { WhyNow } from '@/components/home/WhyNow'
import { AboutMe } from '@/components/home/AboutMe'
import { ThisMonth } from '@/components/home/ThisMonth'
import { Closing } from '@/components/home/Closing'
import { BackgroundShapes } from '@/components/BackgroundShapes'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BackgroundShapes />
      <Hero />
      <WhatIs />
      <HowItWorks />
      <WhyNow />
      <AboutMe />
      <ThisMonth />
      <Closing />
    </div>
  )
}

