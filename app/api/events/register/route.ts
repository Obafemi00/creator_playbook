import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

// Generate short debug ID for error tracking
function generateDebugId(): string {
  return Math.random().toString(36).substring(2, 9)
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
  const debugId = generateDebugId()
  
  try {
    // Check required environment variables first
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[events/register] missing service role key', { debugId })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY missing',
          debugId
        },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('[events/register] missing NEXT_PUBLIC_SUPABASE_URL', { debugId })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Server misconfigured: NEXT_PUBLIC_SUPABASE_URL missing',
          debugId
        },
        { status: 500 }
      )
    }

    // Parse and validate request body
    let body: any
    try {
      body = await req.json()
    } catch (parseError: any) {
      console.error('[events/register] JSON parse error', {
        debugId,
        message: parseError.message,
        error: parseError
      })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Invalid request format. Expected JSON.',
          detail: parseError.message,
          debugId
        },
        { status: 400 }
      )
    }
    
    // Check honeypot (silently return success if filled - bot detected)
    if (body.honeypot && body.honeypot.trim() !== '') {
      console.warn('[events/register] Honeypot triggered - bot detected', { debugId })
      return NextResponse.json({ ok: true, message: 'Registration received' })
    }

    // Validate with Zod
    const validationResult = registrationSchema.safeParse(body)
    if (!validationResult.success) {
      const zodErrors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      
      console.error('[events/register] Validation error', {
        debugId,
        errors: zodErrors,
        body
      })
      
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Validation error',
          details: zodErrors,
          debugId
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
    const normalizedEventSlug = data.eventSlug?.trim() || 'current'

    // Validate required fields are not empty after trim
    if (!normalizedFirstName || !normalizedLastName || !normalizedCountry || !normalizedEmail) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'All fields are required',
          detail: 'One or more required fields are empty',
          debugId
        },
        { status: 400 }
      )
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email address format', detail: 'email format validation failed', debugId },
        { status: 400 }
      )
    }

    // Create Supabase admin client
    let supabase
    try {
      supabase = createAdminClient()
    } catch (clientError: any) {
      console.error('[events/register] Supabase client creation error', {
        debugId,
        message: clientError.message,
        error: clientError
      })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Database configuration error',
          detail: clientError.message || 'Failed to create database client',
          debugId
        },
        { status: 500 }
      )
    }
    
    // Insert into Supabase using service role
    let registration
    let insertError
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .insert({
          first_name: normalizedFirstName,
          last_name: normalizedLastName,
          country: normalizedCountry,
          email: normalizedEmail,
          event_slug: normalizedEventSlug,
          // Note: source field removed - if column exists, it will use default value
          // If column doesn't exist, this prevents insert failures
        })
        .select()
        .single()

      registration = data
      insertError = error
    } catch (insertException: any) {
      console.error('[events/register] Exception during insert', {
        debugId,
        message: insertException.message,
        stack: insertException.stack,
        error: insertException
      })
      return NextResponse.json(
        {
          ok: false,
          error: 'Internal error',
          detail: insertException.message || 'Database insert exception',
          debugId
        },
        { status: 500 }
      )
    }

    // Handle insert errors with detailed logging
    if (insertError) {
      console.error('[events/register] Supabase insert error', {
        debugId,
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
        error: insertError,
        payload: {
          first_name: normalizedFirstName,
          last_name: normalizedLastName,
          country: normalizedCountry,
          email: normalizedEmail,
          event_slug: normalizedEventSlug,
        }
      })

      // Handle missing table/column errors
      if (insertError.code === '42P01') { // Undefined table
        return NextResponse.json(
          { 
            ok: false, 
            error: 'Database table not found. Please run the migration.',
            detail: `Table 'event_registrations' does not exist. Run migration: supabase/migrations/20251227_create_event_registrations.sql`,
            debugId
          },
          { status: 500 }
        )
      }

      if (insertError.code === '42703') { // Undefined column
        return NextResponse.json(
          { 
            ok: false, 
            error: 'Database column mismatch. Please check the migration.',
            detail: insertError.message || 'Column name mismatch',
            debugId
          },
          { status: 500 }
        )
      }

      // Handle unique constraint violations (duplicate email for same event)
      if (insertError.code === '23505') { // Unique violation
        console.warn('[events/register] Duplicate registration detected', {
          debugId,
          email: normalizedEmail,
          eventSlug: normalizedEventSlug
        })
        // Return success for duplicates (user already registered)
        return NextResponse.json({
          ok: true,
          message: 'You are already registered for this event.',
          id: null,
          duplicate: true
        })
      }

      // Generic database error
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Failed to save registration. Please try again.',
          detail: `Database error: ${insertError.code} - ${insertError.message}`,
          debugId
        },
        { status: 500 }
      )
    }

    if (!registration) {
      console.error('[events/register] Insert succeeded but no data returned', { debugId })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Registration saved but confirmation failed.',
          detail: 'No data returned from insert',
          debugId
        },
        { status: 500 }
      )
    }

    // Log successful insert for debugging
    console.log('[events/register] Registration inserted successfully', {
      debugId,
      registrationId: registration.id,
      email: normalizedEmail,
      eventSlug: normalizedEventSlug
    })

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

      // Send notification email to sav@mycreatorplaybook.com
      const notificationResult = await sendRegistrationNotification({
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        country: normalizedCountry,
        email: normalizedEmail,
        eventSlug: normalizedEventSlug,
        timestamp,
      })

      // Send confirmation email to registrant (optional, non-blocking)
      const confirmationResult = await sendRegistrationConfirmation({
        email: normalizedEmail,
        firstName: normalizedFirstName,
        eventSlug: normalizedEventSlug,
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
        console.warn('[events/register] Email sending skipped', {
          debugId,
          reason: emailDeliveryReason
        })
      } else if (emailDeliveryStatus === 'failed') {
        console.error('[events/register] Email sending failed', {
          debugId,
          reason: emailDeliveryReason
        })
      }
    } catch (emailError: any) {
      // Import error or other unexpected error
      console.error('[events/register] Email service error', {
        debugId,
        message: emailError.message,
        stack: emailError.stack,
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
    console.error('[events/register] Unexpected error', {
      debugId,
      message: error?.message,
      stack: error?.stack,
      error
    })
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal error',
        detail: error?.message || 'Unexpected server error',
        debugId
      },
      { status: 500 }
    )
  }
}
