'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { signIn, signInWithMagicLink } from '@/app/actions/auth'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [useMagicLink, setUseMagicLink] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('email', email)
    
    if (useMagicLink) {
      const result = await signInWithMagicLink(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(result.message || 'Check your email for the magic link!')
      }
    } else {
      formData.append('password', password)
      const result = await signIn(formData)
      if (result.error) {
        setError(result.error)
      } else {
        // Redirect will be handled by middleware
        router.push('/account')
        router.refresh()
      }
    }

    setLoading(false)
    setMagicLinkLoading(false)
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setMagicLinkLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('email', email)

    const result = await signInWithMagicLink(formData)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(result.message || 'Check your email for the magic link!')
    }

    setMagicLinkLoading(false)
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back to Creator Playbook"
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

        {!useMagicLink && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
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
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#5FB3B3]/10 border border-[#5FB3B3]/30 text-[#5FB3B3] text-sm"
          >
            {success}
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setUseMagicLink(!useMagicLink)}
            className="text-sm text-[#a0a0a0] hover:text-[#FF7A1A] transition-colors"
          >
            {useMagicLink ? 'Use password instead' : 'Use magic link instead'}
          </button>
          {!useMagicLink && (
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#a0a0a0] hover:text-[#FF7A1A] transition-colors"
            >
              Forgot password?
            </Link>
          )}
        </div>

        {useMagicLink ? (
          <AuthButton
            onClick={handleMagicLink}
            loading={magicLinkLoading}
          >
            Send magic link
          </AuthButton>
        ) : (
          <AuthButton loading={loading}>
            Sign in
          </AuthButton>
        )}

        <div className="text-center text-sm text-[#6b6b6b]">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-[#FF7A1A] hover:text-[#FF7A1A]/80 font-medium transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}
