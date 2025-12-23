import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminToolboxPage() {
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

  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Playbook</h1>
        <Link
          href="/admin/toolbox/new"
          className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
        >
          New Tool
        </Link>
      </div>

      {tools && tools.length > 0 ? (
        <div className="space-y-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      tool.status === 'published'
                        ? 'bg-teal/20 text-teal'
                        : 'bg-charcoal/20 text-charcoal/60'
                    }`}
                  >
                    {tool.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-lavender/20 text-lavender rounded-full">
                    {tool.gated_level}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-teal/20 text-teal rounded-full">
                    {tool.type}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-1">{tool.name}</h3>
                <p className="text-sm text-charcoal/70">{tool.description}</p>
              </div>
              <Link
                href={`/admin/toolbox/${tool.id}/edit`}
                className="px-6 py-3 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-semibold hover:bg-charcoal hover:text-offwhite transition-colors"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-charcoal/60 py-12">No tools yet.</p>
      )}
    </div>
  )
}

