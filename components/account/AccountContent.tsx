'use client'

import { useState } from 'react'
import { createPortalSession } from '@/app/actions/stripe'
import { createClient } from '@/lib/supabase/client'

interface AccountContentProps {
  user: {
    id: string
    email?: string
  }
  membership: {
    status: string
    current_period_end?: string
    stripe_customer_id?: string
  } | null
}

export function AccountContent({ user, membership }: AccountContentProps) {
  const [loading, setLoading] = useState(false)

  const handlePortal = async () => {
    if (!membership?.stripe_customer_id) return
    setLoading(true)
    try {
      const { url } = await createPortalSession()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setLoading(false)
    }
  }

  const isActive = membership?.status === 'active'
  const nextChapterDate = new Date()
  nextChapterDate.setMonth(nextChapterDate.getMonth() + 1)
  nextChapterDate.setDate(1)

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-12">Account</h1>

      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5 mb-8">
        <h2 className="font-display text-2xl font-bold mb-6">Membership status</h2>
        {isActive ? (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-charcoal/60">Status</span>
              <p className="text-lg font-semibold text-teal">Active</p>
            </div>
            {membership.current_period_end && (
              <div>
                <span className="text-sm text-charcoal/60">Next billing date</span>
                <p className="text-lg">
                  {new Date(membership.current_period_end).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <span className="text-sm text-charcoal/60">Next chapter</span>
              <p className="text-lg">
                {nextChapterDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={handlePortal}
              disabled={loading || !membership.stripe_customer_id}
              className="px-8 py-4 bg-charcoal text-offwhite rounded-full font-semibold hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Manage billing'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-charcoal/60">Status</span>
              <p className="text-lg font-semibold text-charcoal/60">Inactive</p>
            </div>
            <p className="text-charcoal/80 mb-4">
              You don&apos;t have an active membership. Join to get access to all events and tools.
            </p>
            <a
              href="/pricing"
              className="inline-block px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
            >
              Start membership
            </a>
          </div>
        )}
      </div>

      {membership?.status === 'past_due' && (
        <div className="bg-orange/10 border border-orange/30 rounded-2xl p-6 mb-8">
          <p className="text-lg font-semibold mb-2">Payment required</p>
          <p className="text-charcoal/80 mb-4">
            Your membership payment failed. Please update your billing information to continue access.
          </p>
          <button
            onClick={handlePortal}
            disabled={loading || !membership.stripe_customer_id}
            className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Update billing'}
          </button>
        </div>
      )}
    </div>
  )
}

