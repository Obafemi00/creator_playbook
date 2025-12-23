'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ToolboxGate() {
  const [email, setEmail] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already unlocked
    const storedEmail = localStorage.getItem('toolbox_email')
    if (storedEmail) {
      setEmail(storedEmail)
      setUnlocked(true)
    }
  }, [])

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      // Store email in Supabase (simple signup table or just localStorage for now)
      await fetch('/api/toolbox-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      localStorage.setItem('toolbox_email', email)
      setUnlocked(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (unlocked) {
    return (
      <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-10 border border-charcoal/5">
        <h2 className="font-display text-2xl font-bold mb-6 text-charcoal">Playbook unlocked</h2>
        <p className="text-charcoal/70 mb-8">
          Your playbook is being prepared. Check back soon for tools that help you think clearer and move faster.
        </p>
        <ul className="space-y-4 text-charcoal/60">
          <li>• Coming soon: Simple templates and frameworks</li>
          <li>• Coming soon: Quick reference guides</li>
          <li>• Coming soon: Thinking exercises</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-10 border border-charcoal/5 max-w-md mx-auto">
      <h2 className="font-display text-2xl font-bold mb-4 text-charcoal">Access the playbook</h2>
      <p className="text-charcoal/70 mb-8 leading-relaxed">
        Enter your email to unlock this toolkit.
      </p>
      <p className="text-sm text-charcoal/60 mb-8">
        No spam. Just the journey.
      </p>

      <form onSubmit={handleUnlock} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 bg-orange text-offwhite rounded-full font-medium hover:bg-orange/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? 'Unlocking...' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}

