import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

// Rate limiting (simple in-memory store)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 3 // Max 3 requests per minute per IP

function getRateLimitKey(ip: string): string {
  return `register:${ip}`
}

function checkRateLimit(ip: string): boolean {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

// Zod schema for validation
const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  country: z.string().min(2, 'Country is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  eventSlug: z.string().default('current'),
  honeypot: z.string().optional(), // Honeypot field
})

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown'
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    
    // Check honeypot (reject if filled)
    if (body.honeypot && body.honeypot.trim() !== '') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Validate with Zod
    const validationResult = registrationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Normalize email (lowercase, trim)
    const normalizedEmail = data.email.toLowerCase().trim()
    const normalizedFirstName = data.firstName.trim()
    const normalizedLastName = data.lastName.trim()
    const normalizedCountry = data.country.trim()

    // Get user agent
    const userAgent = req.headers.get('user-agent') || null

    // Insert into Supabase using service role
    const supabase = createAdminClient()
    
    const { data: registration, error: insertError } = await supabase
      .from('event_registrations')
      .insert({
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        country: normalizedCountry,
        email: normalizedEmail,
        event_slug: data.eventSlug || 'current',
        source: 'events-page',
        ip: ip !== 'unknown' ? ip : null,
        user_agent: userAgent,
      })
      .select()
      .single()

    // Handle duplicate constraint violation
    if (insertError) {
      if (insertError.code === '23505') { // Unique violation
        return NextResponse.json(
          { error: 'This email is already registered for this event.' },
          { status: 409 }
        )
      }
      
      console.error('Supabase insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to save registration. Please try again.' },
        { status: 500 }
      )
    }

    // Attempt to send emails (best-effort, non-blocking)
    let emailDeliveryStatus: 'sent' | 'skipped' | 'failed' = 'skipped'
    let emailDeliveryReason: string | undefined

    try {
      // Dynamic import - only loads at runtime
      const { sendRegistrationNotification, sendRegistrationConfirmation } = await import('@/lib/email')
      
      const timestamp = new Date().toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'UTC',
      })

      // Send notification email
      const notificationResult = await sendRegistrationNotification({
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        country: normalizedCountry,
        email: normalizedEmail,
        eventSlug: data.eventSlug || 'current',
        timestamp,
      })

      // Send confirmation email (non-blocking)
      const confirmationResult = await sendRegistrationConfirmation({
        email: normalizedEmail,
        firstName: normalizedFirstName,
      })

      // Determine overall email status
      if (notificationResult.ok && confirmationResult.ok) {
        emailDeliveryStatus = 'sent'
      } else if (notificationResult.skipped || confirmationResult.skipped) {
        emailDeliveryStatus = 'skipped'
        emailDeliveryReason = notificationResult.reason || confirmationResult.reason
      } else {
        emailDeliveryStatus = 'failed'
        emailDeliveryReason = notificationResult.reason || confirmationResult.reason
      }
    } catch (emailError: any) {
      // Import error or other unexpected error
      console.error('[Registration] Email service error:', emailError)
      emailDeliveryStatus = 'skipped'
      emailDeliveryReason = emailError.message || 'email_service_unavailable'
    }

    // Always return success if Supabase insert succeeded
    // Email delivery status is included for debugging
    return NextResponse.json({ 
      ok: true, 
      id: registration.id,
      email_delivery: emailDeliveryStatus,
      ...(emailDeliveryReason && { email_delivery_reason: emailDeliveryReason })
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
