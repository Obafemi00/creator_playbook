'use client'

import { useState } from 'react'
import { createMembershipCheckoutSession } from '@/app/actions/stripe'

// Note: Price IDs should be set as NEXT_PUBLIC_ env vars or passed from server
// For now, using placeholders - update these in your .env.local
const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_PRICE_ID_MONTHLY || ''
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_PRICE_ID_ANNUAL || ''

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string) => {
    const priceType = priceId === MONTHLY_PRICE_ID ? 'monthly' : 'annual'
    setLoading(priceType)
    try {
      const { url } = await createMembershipCheckoutSession(priceId)
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(null)
    }
  }

  const features = [
    'Access to all monthly events',
    'Full toolbox access',
    'One clear action per event',
    'Simple strategies, no fluff',
  ]

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Step into the journey.
        </h1>
        <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
          Join Creator Playbook and get access to monthly events, tools, and strategies designed to help you build with intention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5">
          <h2 className="font-display text-2xl font-bold mb-2">Monthly</h2>
          <div className="mb-6">
            <span className="text-4xl font-bold">$</span>
            <span className="text-4xl font-bold">X</span>
            <span className="text-charcoal/60">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="text-orange mt-1">✓</span>
                <span className="text-charcoal/80">{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleCheckout(MONTHLY_PRICE_ID)}
            disabled={loading === 'monthly' || !MONTHLY_PRICE_ID}
            className="w-full px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50"
          >
            {loading === 'monthly' ? 'Loading...' : 'Start membership'}
          </button>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-orange/30 relative">
          <div className="absolute top-4 right-4 px-3 py-1 bg-orange text-offwhite text-xs font-semibold rounded-full">
            Best value
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Annual</h2>
          <div className="mb-6">
            <span className="text-4xl font-bold">$</span>
            <span className="text-4xl font-bold">Y</span>
            <span className="text-charcoal/60">/year</span>
          </div>
          <ul className="space-y-3 mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="text-orange mt-1">✓</span>
                <span className="text-charcoal/80">{feature}</span>
              </li>
            ))}
            <li className="flex items-start gap-3">
              <span className="text-orange mt-1">✓</span>
              <span className="text-charcoal/80 font-semibold">Save 20%</span>
            </li>
          </ul>
          <button
            onClick={() => handleCheckout(ANNUAL_PRICE_ID)}
            disabled={loading === 'annual' || !ANNUAL_PRICE_ID}
            className="w-full px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50"
          >
            {loading === 'annual' ? 'Loading...' : 'Start membership'}
          </button>
        </div>
      </div>
    </div>
  )
}

