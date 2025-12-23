'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCheckoutSession } from '@/app/actions/stripe'
import { FadeIn } from '@/components/motion'

interface UnlockFormProps {
  volume: {
    id: string
    slug: string
    title: string
    price_cents: number
  }
}

export function UnlockForm({ volume }: UnlockFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { url } = await createCheckoutSession({
        volumeId: volume.id,
        email,
      })

      if (url) {
        // Store email for post-checkout verification
        localStorage.setItem('purchase_email', email)
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FadeIn>
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-charcoal">
            {volume.title}
          </h1>
          <p className="text-lg text-charcoal/70 leading-relaxed">
            This month includes a short event + a simple document.
          </p>
        </div>

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
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-orange text-offwhite rounded-full font-medium hover:bg-orange/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Unlock for $${(volume.price_cents / 100).toFixed(2)}`}
          </button>
        </form>
      </div>
    </FadeIn>
  )
}

