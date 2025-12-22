'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { FadeIn } from '@/components/motion'

export default function AdminSignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the magic link!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-offwhite">
      <FadeIn>
        <div className="max-w-md w-full">
          <h1 className="font-display text-4xl font-bold mb-8 text-center text-charcoal">
            Admin Sign In
          </h1>
          <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-charcoal/5 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-charcoal">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
              />
            </div>
            {message && (
              <p className={`text-sm ${message.includes('Check') ? 'text-teal' : 'text-red-600'}`}>
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-orange text-offwhite rounded-full font-medium hover:bg-orange/90 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        </div>
      </FadeIn>
    </div>
  )
}

