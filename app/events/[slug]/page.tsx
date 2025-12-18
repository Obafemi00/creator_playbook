import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EventDetail } from '@/components/events/EventDetail'
import { isMember } from '@/lib/auth'

interface EventPageProps {
  params: Promise<{ slug: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!event) {
    notFound()
  }

  const member = await isMember()
  const canAccess = event.is_free_preview || member

  return <EventDetail event={event} canAccess={canAccess} />
}

