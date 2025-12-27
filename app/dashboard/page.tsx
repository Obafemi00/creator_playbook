import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import Link from 'next/link'
import { FadeIn } from '@/components/motion'
import { signOut } from '@/app/actions/auth'

export default async function DashboardPage() {
  if (!(await isAdmin())) {
    redirect('/auth/login')
  }

  const supabase = await createClient()
  
  const { data: volumes } = await supabase
    .from('volumes')
    .select('id, title, status, created_at, event_date')
    .order('created_at', { ascending: false })
    .limit(10)
  
  const { data: purchases } = await supabase
    .from('purchases')
    .select('id')
    .limit(1000) // For count

  const stats = {
    totalVolumes: volumes?.length || 0,
    publishedVolumes: volumes?.filter(v => v.status === 'published').length || 0,
    totalPurchases: purchases?.length || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f12] via-[#1a1a1f] to-[#0f0f12] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-[#f2f2f2] mb-2">
                Dashboard
              </h1>
              <p className="text-[#a0a0a0]">Manage your playbooks and content</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#2a2a35] text-[#f2f2f2] hover:bg-[#3a3a45] border border-[#3a3a45] transition-colors font-medium"
              >
                Sign out
              </button>
            </form>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#1a1a1f]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#2a2a35]">
              <h2 className="text-sm font-medium text-[#a0a0a0] mb-2">Total Volumes</h2>
              <p className="text-3xl font-bold text-[#f2f2f2]">{stats.totalVolumes}</p>
            </div>
            <div className="bg-[#1a1a1f]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#2a2a35]">
              <h2 className="text-sm font-medium text-[#a0a0a0] mb-2">Published</h2>
              <p className="text-3xl font-bold text-[#f2f2f2]">{stats.publishedVolumes}</p>
            </div>
            <div className="bg-[#1a1a1f]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#2a2a35]">
              <h2 className="text-sm font-medium text-[#a0a0a0] mb-2">Total Purchases</h2>
              <p className="text-3xl font-bold text-[#f2f2f2]">{stats.totalPurchases}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              href="/dashboard/upload"
              className="px-8 py-4 bg-[#FF7A1A] text-white rounded-xl font-semibold hover:bg-[#FF7A1A]/90 transition-all duration-300 shadow-lg shadow-[#FF7A1A]/20"
            >
              Upload New Playbook
            </Link>
            <Link
              href="/admin/volumes"
              className="px-8 py-4 bg-[#2a2a35] text-[#f2f2f2] rounded-xl font-medium hover:bg-[#3a3a45] border border-[#3a3a45] transition-colors"
            >
              Manage Volumes
            </Link>
          </div>

          {volumes && volumes.length > 0 && (
            <div className="bg-[#1a1a1f]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#2a2a35]">
              <h2 className="text-xl font-semibold text-[#f2f2f2] mb-4">Recent Volumes</h2>
              <div className="space-y-3">
                {volumes.map((volume) => (
                  <Link
                    key={volume.id}
                    href={`/admin/volumes/${volume.id}`}
                    className="block p-4 rounded-xl bg-[#0f0f12]/50 border border-[#2a2a35] hover:border-[#FF7A1A]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-[#f2f2f2]">{volume.title}</h3>
                        <p className="text-sm text-[#a0a0a0] mt-1">
                          {new Date(volume.event_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        volume.status === 'published' 
                          ? 'bg-[#5FB3B3]/20 text-[#5FB3B3] border border-[#5FB3B3]/30'
                          : 'bg-[#6b6b6b]/20 text-[#6b6b6b] border border-[#6b6b6b]/30'
                      }`}>
                        {volume.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  )
}
