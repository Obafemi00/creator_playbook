import { Hero } from '@/components/home/Hero'
import { WhatIs } from '@/components/home/WhatIs'
import { HowItWorks } from '@/components/home/HowItWorks'
import { WhyNow } from '@/components/home/WhyNow'
import { AboutMe } from '@/components/home/AboutMe'
import { ThisMonth } from '@/components/home/ThisMonth'
import { MeetTheTeam } from '@/components/home/MeetTheTeam'
import { Closing } from '@/components/home/Closing'
import { GalleryWallShapes } from '@/components/home/GalleryWallShapes'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Hero />
      <WhatIs />
      <HowItWorks />
      <WhyNow />
      <AboutMe />
      <ThisMonth />
      <MeetTheTeam />
      <Closing />
    </div>
  )
}
