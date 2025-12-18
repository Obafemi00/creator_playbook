'use client'

import Link from 'next/link'

interface ToolCardProps {
  tool: {
    id: string
    slug: string
    name: string
    description: string
    gated_level: 'email' | 'member'
    type: 'download' | 'interactive' | 'link'
  }
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/toolbox/${tool.slug}`}
      className="block bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5 hover:border-orange/30 transition-all hover:shadow-lg group"
    >
      <h3 className="font-display text-xl font-bold mb-2 group-hover:text-orange transition-colors">
        {tool.name}
      </h3>
      <p className="text-sm text-charcoal/70 mb-4 line-clamp-2">{tool.description}</p>
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 text-xs font-semibold bg-teal/20 text-teal rounded-full">
          {tool.gated_level === 'email' ? 'Email' : 'Member'}
        </span>
        <span className="text-sm text-orange font-semibold group-hover:translate-x-1 transition-transform inline-block">
          Access toolbox →
        </span>
      </div>
    </Link>
  )
}

