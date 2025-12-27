'use client'

import { useState } from 'react'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { resetPassword } from '@/app/actions/auth'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('email', email)

    const result = await resetPassword(formData)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(result.message || 'Check your email for the password reset link!')
    }

    setLoading(false)
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          error={error}
        />

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#5FB3B3]/10 border border-[#5FB3B3]/30 text-[#5FB3B3] text-sm"
          >
            {success}
          </motion.div>
        )}

        <AuthButton loading={loading} disabled={!!success}>
          Send reset link
        </AuthButton>

        <div className="text-center text-sm text-[#6b6b6b]">
          Remember your password?{' '}
          <Link
            href="/auth/login"
            className="text-[#FF7A1A] hover:text-[#FF7A1A]/80 font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}
