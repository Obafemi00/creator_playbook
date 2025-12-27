'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { updatePassword } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login?error=session_expired')
        return
      }
      
      setChecking(false)
    }
    
    checkSession()
  }, [router])

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
    formData.append('password', password)
    formData.append('confirmPassword', confirmPassword)

    const result = await updatePassword(formData)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(result.message || 'Password updated successfully!')
      setTimeout(() => {
        router.push('/account')
      }, 2000)
    }

    setLoading(false)
  }

  if (checking) {
    return (
      <AuthCard title="Checking session...">
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-[#FF7A1A]/30 border-t-[#FF7A1A] rounded-full"
          />
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle="Choose a strong password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="password"
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          error={error && !confirmPassword ? error : undefined}
        />

        <AuthInput
          id="confirmPassword"
          type="password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          error={error && confirmPassword ? error : undefined}
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
          Update password
        </AuthButton>
      </form>
    </AuthCard>
  )
}
