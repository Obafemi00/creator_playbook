import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export async function ThisMonth() {
  const supabase = await createClient()
  const { data: latestEvent } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (!latestEvent) {
    return null
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-charcoal/5">
        <div className="mb-6">
          <span className="text-sm font-semibold text-charcoal/60">This month</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
            Chapter {latestEvent.chapter_number} | {latestEvent.title.toUpperCase()}
          </h2>
        </div>
        <p className="text-lg text-charcoal/80 mb-6">{latestEvent.one_line_promise}</p>
        <ul className="space-y-2 mb-8">
          {latestEvent.description && latestEvent.description.split('\n').slice(0, 3).map((bullet: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-orange mt-1">•</span>
              <span className="text-charcoal/80">{bullet}</span>
            </li>
          ))}
        </ul>
        {latestEvent.youtube_url && (
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${latestEvent.youtube_url.split('v=')[1]?.split('&')[0] || latestEvent.youtube_url}`}
              title={latestEvent.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
        <Link
          href={`/events/${latestEvent.slug}`}
          className="inline-block px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
        >
          Watch the event
        </Link>
      </div>
    </section>
  )
}

