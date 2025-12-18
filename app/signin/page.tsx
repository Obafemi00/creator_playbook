'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
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
        emailRedirectTo: `${window.location.origin}/account/welcome`,
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
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <h1 className="font-display text-4xl font-bold mb-6 text-center">Sign in</h1>
      <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
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
          className="w-full px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send magic link'}
        </button>
      </form>
    </div>
  )
}

