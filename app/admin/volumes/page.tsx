import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import Link from 'next/link'
import { FadeIn } from '@/components/motion'

export default async function AdminVolumesPage() {
  if (!(await isAdmin())) {
    redirect('/admin/sign-in')
  }

  const supabase = await createClient()
  const { data: volumes } = await supabase
    .from('volumes')
    .select('*')
    .order('event_date', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <FadeIn>
          <h1 className="font-display text-4xl font-bold text-charcoal">Volumes</h1>
        </FadeIn>
        <Link
          href="/admin/volumes/new"
          className="px-8 py-4 bg-orange text-offwhite rounded-full font-medium hover:bg-orange/90 transition-all duration-300"
        >
          New Volume
        </Link>
      </div>

      {volumes && volumes.length > 0 ? (
        <div className="space-y-4">
          {volumes.map((volume) => (
            <Link
              key={volume.id}
              href={`/admin/volumes/${volume.id}`}
              className="block bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5 hover:border-orange/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-display text-xl font-bold text-charcoal">
                      {volume.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      volume.status === 'published'
                        ? 'bg-teal/20 text-teal'
                        : 'bg-charcoal/20 text-charcoal/60'
                    }`}>
                      {volume.status}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal/60">
                    {new Date(volume.event_date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-charcoal/40">→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-charcoal/50 py-20">No volumes yet.</p>
      )}
    </div>
  )
}

