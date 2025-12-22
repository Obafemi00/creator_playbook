'use client'

import { Drift } from '@/components/motion/Drift'

export function GalleryWallShapes() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Hero Section Shapes - Large, partially off-canvas */}
      
      {/* Large orange blob top left, partially off-canvas */}
      <Drift x={15} y={-10} duration={22}>
        <div className="absolute -top-20 -left-16 w-64 h-64">
          <div className="w-full h-full rounded-full bg-orange/15 blur-sm" />
          <div className="absolute top-8 left-8 w-full h-full rounded-full bg-teal/8 blur-xl" />
        </div>
      </Drift>

      {/* Rounded square with offset shadow - top right */}
      <Drift x={-12} y={8} duration={25}>
        <div className="absolute top-32 right-8">
          <div className="w-32 h-32 rounded-2xl bg-teal/10 blur-sm translate-x-2 translate-y-2" />
          <div className="w-32 h-32 rounded-2xl bg-orange/12" />
        </div>
      </Drift>

      {/* Circular dots with offset - middle left */}
      <Drift x={10} y={-8} duration={20}>
        <div className="absolute top-1/3 left-8">
          <div className="w-3 h-3 rounded-full bg-teal/20 translate-x-2 translate-y-2" />
          <div className="w-3 h-3 rounded-full bg-orange/20" />
        </div>
      </Drift>
      <Drift x={8} y={-6} duration={18}>
        <div className="absolute top-1/3 left-16 mt-8">
          <div className="w-2 h-2 rounded-full bg-teal/15 translate-x-1 translate-y-1" />
          <div className="w-2 h-2 rounded-full bg-orange/15" />
        </div>
      </Drift>

      {/* Rounded L-frame / corner bracket - bottom right */}
      <Drift x={-15} y={12} duration={28}>
        <div className="absolute bottom-32 right-12">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path
              d="M20 20 L20 60 L60 60"
              stroke="#5FB3B3"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.15"
              transform="translate(2, 2)"
            />
            <path
              d="M20 20 L20 60 L60 60"
              stroke="#FF7A1A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.2"
            />
          </svg>
        </div>
      </Drift>

      {/* Organic blob with small arc accent - center left */}
      <Drift x={12} y={-10} duration={24}>
        <div className="absolute top-1/2 left-12 -translate-y-1/2">
          <div className="w-48 h-48">
            <div className="w-full h-full rounded-full bg-orange/8 blur-xl translate-x-3 translate-y-3" />
            <div className="absolute inset-0 w-full h-full rounded-full bg-teal/6 blur-lg" />
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 12 Q12 8 16 12"
                stroke="#FF7A1A"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>
      </Drift>

      {/* Rounded plus/cross blocks - scattered */}
      <Drift x={-8} y={6} duration={26}>
        <div className="absolute top-2/3 right-1/4">
          <div className="w-16 h-16 rounded-xl bg-teal/8 blur-sm translate-x-1 translate-y-1" />
          <div className="w-16 h-16 rounded-xl bg-orange/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-8 bg-orange/20 rounded-full" />
            <div className="absolute w-8 h-1 bg-orange/20 rounded-full" />
          </div>
        </div>
      </Drift>

      {/* Tiny doodles - faint outlined shapes */}
      <div className="absolute top-1/4 right-1/3">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.12">
          <circle cx="20" cy="20" r="8" stroke="#2B2B2B" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div className="absolute bottom-1/3 left-1/4">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" opacity="0.1">
          <polygon points="15,5 25,25 5,25" stroke="#2B2B2B" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Dotted specks */}
      <div className="absolute top-3/4 left-1/3">
        <div className="w-1 h-1 rounded-full bg-charcoal/15" />
      </div>
      <div className="absolute top-1/2 right-1/4">
        <div className="w-1 h-1 rounded-full bg-charcoal/12" />
      </div>
      <div className="absolute bottom-1/4 left-1/2">
        <div className="w-1 h-1 rounded-full bg-charcoal/10" />
      </div>
    </div>
  )
}


