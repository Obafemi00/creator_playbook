'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { signUp } from '@/app/actions/auth'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    const result = await signUp(formData)
    if (result.error) {
      setError(result.error)
    } else if (result.requiresConfirmation) {
      setSuccess(result.message || 'Please check your email to confirm your account')
    } else {
      // Account created and logged in
      router.push('/account')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Join Creator Playbook and start your journey"
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
          error={error && !password ? error : undefined}
        />

        <AuthInput
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          error={error && password ? error : undefined}
        />

        <AuthInput
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
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

        <AuthButton loading={loading}>
          Create account
        </AuthButton>

        <div className="text-center text-sm text-[#6b6b6b]">
          Already have an account?{' '}
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
