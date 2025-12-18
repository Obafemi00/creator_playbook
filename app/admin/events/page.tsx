import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Events</h1>
        <Link
          href="/admin/events/new"
          className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
        >
          New Event
        </Link>
      </div>

      {events && events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-semibold text-charcoal/60">
                    Chapter {event.chapter_number}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'published'
                        ? 'bg-teal/20 text-teal'
                        : event.is_free_preview
                        ? 'bg-lavender/20 text-lavender'
                        : 'bg-charcoal/20 text-charcoal/60'
                    }`}
                  >
                    {event.status === 'published'
                      ? 'Published'
                      : event.is_free_preview
                      ? 'Preview'
                      : 'Draft'}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-1">{event.title}</h3>
                <p className="text-sm text-charcoal/70">{event.one_line_promise}</p>
                {event.published_at && (
                  <p className="text-xs text-charcoal/50 mt-2">
                    {new Date(event.published_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Link
                href={`/admin/events/${event.id}/edit`}
                className="px-6 py-3 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-semibold hover:bg-charcoal hover:text-offwhite transition-colors"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-charcoal/60 py-12">No events yet.</p>
      )}
    </div>
  )
}

