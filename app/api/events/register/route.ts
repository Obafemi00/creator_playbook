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
  eventSlug: z.string().optional(),
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
      console.error('[events/register] Rate limit exceeded for IP:', ip)
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
      console.error('[events/register] JSON parse error:', {
        message: parseError.message,
        error: parseError
      })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Invalid request format. Expected JSON.',
          detail: parseError.message 
        },
        { status: 400 }
      )
    }
    
    // Check honeypot (silently return success if filled - bot detected)
    if (body.honeypot && body.honeypot.trim() !== '') {
      console.warn('[events/register] Honeypot triggered - bot detected, silently returning success')
      return NextResponse.json({ ok: true, message: 'Registration received' })
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
        errors: validationResult.error.errors,
        body
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
    const normalizedEventSlug = data.eventSlug?.trim() || null

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
      console.error('[events/register] Supabase client creation error:', {
        message: clientError.message,
        error: clientError
      })
      return NextResponse.json(
        { 
          ok: false, 
          error: clientError.message || 'Database configuration error',
          detail: 'Check environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
        },
        { status: 500 }
      )
    }
    
    // Check for existing registration (deduplication)
    // Use the actual event_slug value (null or string) for comparison
    const eventSlugForCheck = normalizedEventSlug || null
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('event_slug', eventSlugForCheck)
      .maybeSingle()

    if (existingRegistration) {
      console.log('[events/register] Duplicate registration detected:', {
        email: normalizedEmail,
        eventSlug: eventSlugForCheck
      })
      return NextResponse.json({
        ok: true,
        message: 'Already registered',
        id: existingRegistration.id
      })
    }
    
    // Insert into Supabase using service role
    const { data: registration, error: insertError } = await supabase
      .from('event_registrations')
      .insert({
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        country: normalizedCountry,
        email: normalizedEmail,
        event_slug: normalizedEventSlug,
        user_agent: userAgent,
        ip: ip !== 'unknown' ? ip : null,
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

      // Handle duplicate constraint violation (fallback check)
      if (insertError.code === '23505') { // Unique violation
        // Try to get the existing record
        const eventSlugForCheck = normalizedEventSlug || null
        const { data: existing } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('email', normalizedEmail)
          .eq('event_slug', eventSlugForCheck)
          .maybeSingle()

        if (existing) {
          return NextResponse.json({
            ok: true,
            message: 'Already registered',
            id: existing.id
          })
        }
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
        eventSlug: normalizedEventSlug || undefined,
        timestamp,
      })

      // Send confirmation email (non-blocking)
      const confirmationResult = await sendRegistrationConfirmation({
        email: normalizedEmail,
        firstName: normalizedFirstName,
        eventSlug: normalizedEventSlug || undefined,
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

      if (emailDeliveryStatus === 'skipped') {
        console.warn('[events/register] Email sending skipped:', emailDeliveryReason)
      } else if (emailDeliveryStatus === 'failed') {
        console.error('[events/register] Email sending failed:', emailDeliveryReason)
      }
    } catch (emailError: any) {
      // Import error or other unexpected error
      console.error('[events/register] Email service error:', {
        message: emailError.message,
        error: emailError
      })
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
