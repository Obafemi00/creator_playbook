import { createClient } from '@/lib/supabase/server'
import { FadeIn } from '@/components/motion'
import { VolumeCard } from '@/components/VolumeCard'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: volumes } = await supabase
    .from('volumes')
    .select('*')
    .eq('status', 'published')
    .order('event_date', { ascending: false })

  return (
    <div className="relative">
      <section className="px-6 lg:px-8 pt-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-charcoal">
                Creator Playbook Events
              </h1>
            <p className="text-xl text-charcoal/70 leading-relaxed max-w-2xl">
              Each event captures a moment in the journey. Start anywhere.
            </p>
          </div>

          {volumes && volumes.length > 0 ? (
            <div className="space-y-8">
              {volumes.map((volume) => (
                <VolumeCard key={volume.id} volume={volume} />
              ))}
            </div>
          ) : (
            <p className="text-center text-charcoal/50 py-20">No events yet. Check back soon.</p>
          )}
        </FadeIn>
        </div>
      </section>
    </div>
  )
}
