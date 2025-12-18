import Link from 'next/link'
import Image from 'next/image'

interface EventCardProps {
  event: {
    id: string
    slug: string
    chapter_number: number
    title: string
    one_line_promise: string
    thumbnail_path?: string | null
    is_free_preview: boolean
    status: string
  }
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="block bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5 hover:border-orange/30 transition-all hover:shadow-lg group"
    >
      {event.thumbnail_path && (
        <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
          <Image
            src={event.thumbnail_path}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-semibold text-charcoal/60">
          Chapter {event.chapter_number}
        </span>
        <div className="flex gap-2">
          {event.is_free_preview && (
            <span className="px-2 py-1 text-xs font-semibold bg-teal/20 text-teal rounded-full">
              Preview
            </span>
          )}
          {!event.is_free_preview && (
            <span className="px-2 py-1 text-xs font-semibold bg-lavender/20 text-lavender rounded-full">
              Member
            </span>
          )}
        </div>
      </div>
      <h3 className="font-display text-xl font-bold mb-2 group-hover:text-orange transition-colors">
        {event.title}
      </h3>
      <p className="text-sm text-charcoal/70 line-clamp-2">{event.one_line_promise}</p>
    </Link>
  )
}

