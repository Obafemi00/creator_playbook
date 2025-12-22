'use client'

import { Drift } from './motion/Drift'

export function BackgroundShapes() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Teal circle - top right */}
      <Drift x={30} y={-15} duration={25}>
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-teal/8 blur-3xl" />
      </Drift>
      
      {/* Lavender circle - bottom left */}
      <Drift x={-25} y={20} duration={30}>
        <div className="absolute bottom-40 left-10 w-[32rem] h-[32rem] rounded-full bg-lavender/8 blur-3xl" />
      </Drift>
      
      {/* Small orange accent - center right */}
      <Drift x={15} y={10} duration={22}>
        <div className="absolute top-1/2 right-20 w-64 h-64 rounded-full bg-orange/5 blur-2xl" />
      </Drift>
      
      {/* Organic arc shape */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,400 Q300,200 600,350 T1200,400"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          opacity="0.15"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5FB3B3" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C6B7E2" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
