'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FadeIn } from '@/components/motion'

export function AdminManagement() {
  const [admins, setAdmins] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'OWNER' | 'ADMIN'>('ADMIN')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('admin_profiles')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false })
    
    setAdmins(data || [])
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Note: In production, you'd send an invite email
      // For now, this creates the admin profile but the user needs to sign up first
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })

      if (response.ok) {
        setEmail('')
        loadAdmins()
      }
    } catch (error) {
      console.error('Error inviting admin:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <FadeIn>
        <h1 className="font-display text-4xl font-bold mb-12 text-charcoal">Admin Management</h1>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5 mb-12">
          <h2 className="font-display text-xl font-bold mb-6 text-charcoal">Invite Admin</h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'OWNER' | 'ADMIN')}
                className="px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
              >
                <option value="ADMIN">Admin</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-orange text-offwhite rounded-full font-medium hover:bg-orange/90 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Inviting...' : 'Invite Admin'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-6 text-charcoal">Current Admins</h2>
          <div className="space-y-4">
            {admins.map((admin) => (
              <div
                key={admin.user_id}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-charcoal/5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-charcoal">
                    {admin.profiles?.email || 'Unknown'}
                  </p>
                  <p className="text-sm text-charcoal/60">{admin.role}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  admin.role === 'OWNER'
                    ? 'bg-orange/20 text-orange'
                    : 'bg-teal/20 text-teal'
                }`}>
                  {admin.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

