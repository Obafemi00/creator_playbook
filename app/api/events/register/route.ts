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

// Zod schema for validation - matches client form fields
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
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    let body: any
    try {
      body = await req.json()
    } catch (parseError: any) {
      console.error('[events/register] JSON parse error:', parseError)
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Invalid request format. Expected JSON.',
          detail: parseError.message 
        },
        { status: 400 }
      )
    }
    
    // Check honeypot (reject if filled)
    if (body.honeypot && body.honeypot.trim() !== '') {
      return NextResponse.json(
        { ok: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Validate with Zod
    const validationResult = registrationSchema.safeParse(body)
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]
      const errorMessage = firstError?.message || 'Validation failed'
      const field = firstError?.path?.[0] || 'unknown'
      
      console.error('[events/register] Validation error:', {
        field,
        message: errorMessage,
        errors: validationResult.error.errors
      })
      
      return NextResponse.json(
        { 
          ok: false, 
          error: errorMessage,
          detail: `Missing or invalid field: ${field}`
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Normalize and sanitize input
    const normalizedEmail = data.email.toLowerCase().trim()
    const normalizedFirstName = data.firstName.trim()
    const normalizedLastName = data.lastName.trim()
    const normalizedCountry = data.country.trim()

    // Validate required fields are not empty after trim
    if (!normalizedFirstName) {
      return NextResponse.json(
        { ok: false, error: 'First name is required', detail: 'firstName is empty' },
        { status: 400 }
      )
    }
    if (!normalizedLastName) {
      return NextResponse.json(
        { ok: false, error: 'Last name is required', detail: 'lastName is empty' },
        { status: 400 }
      )
    }
    if (!normalizedCountry) {
      return NextResponse.json(
        { ok: false, error: 'Country is required', detail: 'country is empty' },
        { status: 400 }
      )
    }
    if (!normalizedEmail) {
      return NextResponse.json(
        { ok: false, error: 'Email is required', detail: 'email is empty' },
        { status: 400 }
      )
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email address format', detail: 'email format validation failed' },
        { status: 400 }
      )
    }

    // Get user agent
    const userAgent = req.headers.get('user-agent') || null

    // Create Supabase admin client (with error handling for missing env vars)
    let supabase
    try {
      supabase = createAdminClient()
    } catch (clientError: any) {
      console.error('[events/register] Supabase client creation error:', clientError)
      return NextResponse.json(
        { 
          ok: false, 
          error: clientError.message || 'Database configuration error',
          detail: 'Check environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
        },
        { status: 500 }
      )
    }
    
    // Insert into Supabase using service role
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

    // Handle insert errors with detailed logging
    if (insertError) {
      console.error('[events/register] Supabase insert error:', {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
        error: insertError
      })

      // Handle duplicate constraint violation
      if (insertError.code === '23505') { // Unique violation
        return NextResponse.json(
          { 
            ok: false, 
            error: 'This email is already registered for this event.',
            detail: 'Duplicate email for event_slug'
          },
          { status: 409 }
        )
      }

      // Handle missing table/column errors
      if (insertError.code === '42P01') { // Undefined table
        return NextResponse.json(
          { 
            ok: false, 
            error: 'Database table not found. Please run the migration.',
            detail: `Table 'event_registrations' does not exist. Run: supabase/migrations/add_event_registrations.sql`
          },
          { status: 500 }
        )
      }

      if (insertError.code === '42703') { // Undefined column
        return NextResponse.json(
          { 
            ok: false, 
            error: 'Database column mismatch. Please check the migration.',
            detail: insertError.message || 'Column name mismatch'
          },
          { status: 500 }
        )
      }

      // Generic database error
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Failed to save registration. Please try again.',
          detail: `Database error: ${insertError.code} - ${insertError.message}`
        },
        { status: 500 }
      )
    }

    if (!registration) {
      console.error('[events/register] Insert succeeded but no data returned')
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Registration saved but confirmation failed.',
          detail: 'No data returned from insert'
        },
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
      console.error('[events/register] Email service error:', emailError)
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
  } catch (error: any) {
    // Catch-all for unexpected errors
    console.error('[events/register] Unexpected error:', {
      message: error?.message,
      stack: error?.stack,
      error
    })
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Something went wrong. Please try again.',
        detail: error?.message || 'Unexpected server error'
      },
      { status: 500 }
    )
  }
}
