import { createClient } from '@/lib/supabase/server'
import { EventCard } from '@/components/EventCard'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Creator Playbook Events
        </h1>
        <p className="text-lg text-charcoal/80">
          Each event captures a moment in the journey. Start anywhere.
        </p>
      </div>
      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-charcoal/60 py-12">No events yet.</p>
      )}
    </div>
  )
}

