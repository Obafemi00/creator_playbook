import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
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
    .select('id, status')
  const { data: tools } = await supabase
    .from('tools')
    .select('id, status')

  const eventStats = {
    total: events?.length || 0,
    published: events?.filter((e) => e.status === 'published').length || 0,
    drafts: events?.filter((e) => e.status === 'draft').length || 0,
  }

  const toolStats = {
    total: tools?.length || 0,
    published: tools?.filter((t) => t.status === 'published').length || 0,
    drafts: tools?.filter((t) => t.status === 'draft').length || 0,
  }

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-12">Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5">
          <h2 className="font-semibold mb-2">Events</h2>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{eventStats.total}</p>
            <p className="text-sm text-charcoal/60">
              {eventStats.published} published, {eventStats.drafts} drafts
            </p>
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5">
          <h2 className="font-semibold mb-2">Tools</h2>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{toolStats.total}</p>
            <p className="text-sm text-charcoal/60">
              {toolStats.published} published, {toolStats.drafts} drafts
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Link
          href="/admin/events/new"
          className="block px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors w-fit"
        >
          New Event
        </Link>
        <Link
          href="/admin/toolbox/new"
          className="block px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors w-fit"
        >
          New Tool
        </Link>
        <Link
          href="/admin/events"
          className="block px-8 py-4 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-semibold hover:bg-charcoal hover:text-offwhite transition-colors w-fit"
        >
          Manage Events
        </Link>
        <Link
          href="/admin/toolbox"
          className="block px-8 py-4 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-semibold hover:bg-charcoal hover:text-offwhite transition-colors w-fit"
        >
          Manage Toolbox
        </Link>
      </div>
    </div>
  )
}

