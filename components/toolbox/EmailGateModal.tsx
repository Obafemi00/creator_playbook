'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface EmailGateModalProps {
  toolId: string
  toolName: string
  onClose: () => void
  onSuccess: () => void
}

export function EmailGateModal({ toolId, toolName, onClose, onSuccess }: EmailGateModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Create email unlock record
      const response = await fetch('/api/email-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, toolId }),
      })

      if (!response.ok) {
        throw new Error('Failed to unlock')
      }

      // Set cookie for future access
      document.cookie = `tool_unlock_${toolId}=${email}; path=/; max-age=31536000`

      onSuccess()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-offwhite rounded-2xl p-8 max-w-md w-full border border-charcoal/10">
        <h2 className="font-display text-2xl font-bold mb-2">Unlock {toolName}</h2>
        <p className="text-charcoal/80 mb-6">
          Enter your email to unlock this toolkit.
        </p>
        <p className="text-sm text-charcoal/60 mb-6">
          No spam. Just the journey.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-charcoal/20 rounded-full font-semibold hover:bg-charcoal/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Unlocking...' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

