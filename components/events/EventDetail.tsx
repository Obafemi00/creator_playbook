'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface EventDetailProps {
  event: {
    id: string
    slug: string
    chapter_number: number
    title: string
    one_line_promise: string
    description?: string | null
    youtube_url?: string | null
    idea_content?: string | null
    strategy_content?: string | null
    action_content?: string | null
    thumbnail_path?: string | null
    is_free_preview: boolean
  }
  canAccess: boolean
}

export function EventDetail({ event, canAccess }: EventDetailProps) {
  const [completed, setCompleted] = useState(false)

  const handleMarkDone = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('action_completions')
      .upsert({
        user_id: user.id,
        event_id: event.id,
        completed_at: new Date().toISOString(),
      })

    if (!error) {
      setCompleted(true)
    }
  }

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <span className="text-sm font-semibold text-charcoal/60">
          Chapter {event.chapter_number}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
          {event.title}
        </h1>
        <p className="text-xl text-charcoal/80">{event.one_line_promise}</p>
      </div>

      {!canAccess && (
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5 mb-8">
          <p className="text-lg mb-4">This event is for members only.</p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
          >
            Join to unlock
          </Link>
        </div>
      )}

      {canAccess && event.youtube_url && (
        <div className="aspect-video mb-8 rounded-lg overflow-hidden bg-charcoal/10">
          <iframe
            src={`https://www.youtube.com/embed/${event.youtube_url.split('v=')[1]?.split('&')[0] || event.youtube_url}`}
            title={event.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      {canAccess ? (
        <div className="space-y-12">
          {event.idea_content && (
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">The idea</h2>
              <div className="prose prose-lg max-w-none text-charcoal/80 whitespace-pre-line">
                {event.idea_content}
              </div>
            </section>
          )}

          {event.strategy_content && (
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">The strategy</h2>
              <div className="prose prose-lg max-w-none text-charcoal/80 whitespace-pre-line">
                {event.strategy_content}
              </div>
            </section>
          )}

          {event.action_content && (
            <section>
              <div className="bg-orange/10 border-l-4 border-orange p-6 rounded-r-lg">
                <h2 className="font-display text-2xl font-bold mb-4">One clear action</h2>
                <p className="text-lg text-charcoal/80 whitespace-pre-line">
                  {event.action_content}
                </p>
                <button
                  onClick={handleMarkDone}
                  disabled={completed}
                  className="mt-4 px-6 py-3 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {completed ? '✓ Marked as done' : 'Mark as done'}
                </button>
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="space-y-12 blur-sm pointer-events-none">
          {event.idea_content && (
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">The idea</h2>
              <div className="prose prose-lg max-w-none text-charcoal/80 whitespace-pre-line">
                {event.idea_content}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

