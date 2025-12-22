import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import Link from 'next/link'
import { FadeIn } from '@/components/motion'

export default async function AdminDashboard() {
  if (!(await isAdmin())) {
    redirect('/admin/sign-in')
  }

  const supabase = await createClient()
  
  const { data: volumes } = await supabase
    .from('volumes')
    .select('id, status')
  
  const { data: purchases } = await supabase
    .from('purchases')
    .select('id')

  const stats = {
    totalVolumes: volumes?.length || 0,
    publishedVolumes: volumes?.filter(v => v.status === 'published').length || 0,
    totalPurchases: purchases?.length || 0,
  }

  return (
    <div>
      <FadeIn>
        <h1 className="font-display text-4xl font-bold mb-12 text-charcoal">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5">
            <h2 className="text-sm font-medium text-charcoal/60 mb-2">Total Volumes</h2>
            <p className="text-3xl font-bold text-charcoal">{stats.totalVolumes}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5">
            <h2 className="text-sm font-medium text-charcoal/60 mb-2">Published</h2>
            <p className="text-3xl font-bold text-charcoal">{stats.publishedVolumes}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5">
            <h2 className="text-sm font-medium text-charcoal/60 mb-2">Total Purchases</h2>
            <p className="text-3xl font-bold text-charcoal">{stats.totalPurchases}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/volumes/new"
            className="px-8 py-4 bg-orange text-offwhite rounded-full font-medium hover:bg-orange/90 transition-all duration-300"
          >
            New Volume
          </Link>
          <Link
            href="/admin/volumes"
            className="px-8 py-4 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-medium hover:bg-charcoal hover:text-offwhite transition-all duration-300"
          >
            Manage Volumes
          </Link>
        </div>
      </FadeIn>
    </div>
  )
}
