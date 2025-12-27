'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { z } from 'zod'

// Countries list (abbreviated for brevity - can be expanded)
const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
  'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Belgium', 'Switzerland', 'Austria', 'Ireland', 'Portugal', 'Poland',
  'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'India', 'Japan',
  'South Korea', 'Singapore', 'Hong Kong', 'New Zealand', 'South Africa',
  'Other'
].sort()

const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  country: z.string().min(2, 'Please select a country'),
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof registrationSchema>

export function EventRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    country: '',
    email: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setSubmitError(null)
  }

  const validateForm = (): boolean => {
    try {
      registrationSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormData, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    // Validate
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eventSlug: 'current',
          honeypot, // Honeypot field
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Success
      setSubmitSuccess(true)
      setFormData({ firstName: '', lastName: '', country: '', email: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Registration error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.3 : 0.6,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="mt-16 md:mt-20"
    >
      <div className="bg-white/70 dark:bg-[#12141B] backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-8 md:p-10 lg:p-12 border border-charcoal/5 dark:border-[#232635] shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">
          Register for the Event
        </h2>
        <p className="text-charcoal/60 dark:text-[#B7BCCB] mb-8 text-lg leading-relaxed">
          Save your spot. We'll only use your email for event updates.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field (hidden) */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px' }}
            aria-hidden="true"
          />

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-charcoal dark:text-[#B7BCCB]">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              disabled={isSubmitting}
              aria-invalid={errors.firstName ? 'true' : 'false'}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              className={`
                w-full px-6 py-4 rounded-xl
                border bg-white/90 dark:bg-[#0F1117]
                text-charcoal dark:text-[#F5F7FF]
                placeholder:text-charcoal/30 dark:placeholder:text-[#7E8599]
                focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:border-[#FF7A1A]/50
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  errors.firstName
                    ? 'border-red-500/50 dark:border-red-500/50'
                    : 'border-charcoal/10 dark:border-[#2A2F3D]'
                }
              `}
              placeholder="John"
              required
            />
            {errors.firstName && (
              <p id="firstName-error" className="mt-2 text-sm text-red-500 dark:text-red-400" role="alert">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-charcoal dark:text-[#B7BCCB]">
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              disabled={isSubmitting}
              aria-invalid={errors.lastName ? 'true' : 'false'}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              className={`
                w-full px-6 py-4 rounded-xl
                border bg-white/90 dark:bg-[#0F1117]
                text-charcoal dark:text-[#F5F7FF]
                placeholder:text-charcoal/30 dark:placeholder:text-[#7E8599]
                focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:border-[#FF7A1A]/50
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  errors.lastName
                    ? 'border-red-500/50 dark:border-red-500/50'
                    : 'border-charcoal/10 dark:border-[#2A2F3D]'
                }
              `}
              placeholder="Doe"
              required
            />
            {errors.lastName && (
              <p id="lastName-error" className="mt-2 text-sm text-red-500 dark:text-red-400" role="alert">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2 text-charcoal dark:text-[#B7BCCB]">
              Country <span className="text-red-400">*</span>
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              disabled={isSubmitting}
              aria-invalid={errors.country ? 'true' : 'false'}
              aria-describedby={errors.country ? 'country-error' : undefined}
              className={`
                w-full px-6 py-4 rounded-xl
                border bg-white/90 dark:bg-[#0F1117]
                text-charcoal dark:text-[#F5F7FF]
                focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:border-[#FF7A1A]/50
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  errors.country
                    ? 'border-red-500/50 dark:border-red-500/50'
                    : 'border-charcoal/10 dark:border-[#2A2F3D]'
                }
              `}
              required
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p id="country-error" className="mt-2 text-sm text-red-500 dark:text-red-400" role="alert">
                {errors.country}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-charcoal dark:text-[#B7BCCB]">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={isSubmitting}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`
                w-full px-6 py-4 rounded-xl
                border bg-white/90 dark:bg-[#0F1117]
                text-charcoal dark:text-[#F5F7FF]
                placeholder:text-charcoal/30 dark:placeholder:text-[#7E8599]
                focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:border-[#FF7A1A]/50
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  errors.email
                    ? 'border-red-500/50 dark:border-red-500/50'
                    : 'border-charcoal/10 dark:border-[#2A2F3D]'
                }
              `}
              placeholder="you@example.com"
              required
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-500 dark:text-red-400" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
            >
              <p className="text-sm text-green-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Registered. Check your email for confirmation.
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <p className="text-sm text-red-400" role="alert">
                {submitError}
              </p>
            </motion.div>
          )}

          {/* Terms & Privacy Link */}
          <p className="text-xs text-charcoal/50 dark:text-[#7E8599] leading-relaxed">
            By registering, you agree to our{' '}
            <a href="/terms" className="text-[#FF7A1A] hover:underline" target="_blank" rel="noopener noreferrer">
              Terms
            </a>
            {' '}and{' '}
            <a href="/privacy" className="text-[#FF7A1A] hover:underline" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </p>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || submitSuccess}
            whileHover={!prefersReducedMotion && !isSubmitting && !submitSuccess ? { 
              y: -2,
              scale: 1.02,
              boxShadow: '0 10px 25px -5px rgba(255, 122, 26, 0.4)',
            } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            className={`
              w-full px-8 py-4 md:py-5 rounded-xl font-semibold text-base md:text-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:ring-offset-2 dark:focus:ring-offset-[#0B0C10]
              ${
                isSubmitting || submitSuccess
                  ? 'bg-[#1A1C24] dark:bg-[#1A1C24] text-[#7E8599] dark:text-[#7E8599] cursor-not-allowed border border-[#232635]'
                  : 'bg-[#FF7A1A] text-[#0B0C10] hover:bg-[#FF7A1A]/90 cursor-pointer shadow-lg shadow-[#FF7A1A]/30'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
                Registering...
              </span>
            ) : submitSuccess ? (
              'Registered ✓'
            ) : (
              'Register'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
