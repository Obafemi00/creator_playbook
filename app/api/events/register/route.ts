import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

// Generate short request ID for debugging
function generateRequestId(): string {
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
  const requestId = generateRequestId()
  
  try {
    // Check required environment variables first
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[events/register] missing service role key', { requestId })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY missing',
          requestId
        },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('[events/register] missing NEXT_PUBLIC_SUPABASE_URL', { requestId })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Server misconfigured: NEXT_PUBLIC_SUPABASE_URL missing',
          requestId
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
        requestId,
        message: parseError.message,
        error: parseError
      })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Invalid request format. Expected JSON.',
          detail: parseError.message,
          requestId
        },
        { status: 400 }
      )
    }
    
    // Check honeypot (silently return success if filled - bot detected)
    if (body.honeypot && body.honeypot.trim() !== '') {
      console.warn('[events/register] Honeypot triggered - bot detected', { requestId })
      return NextResponse.json({ ok: true, message: 'Registration received', requestId })
    }

    // Validate with Zod
    const validationResult = registrationSchema.safeParse(body)
    if (!validationResult.success) {
      const zodErrors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      
      console.error('[events/register] Validation error', {
        requestId,
        errors: zodErrors,
        body
      })
      
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Validation error',
          details: zodErrors,
          requestId
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
          requestId
        },
        { status: 400 }
      )
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email address format', detail: 'email format validation failed', requestId },
        { status: 400 }
      )
    }

    // Create Supabase admin client
    let supabase
    try {
      supabase = createAdminClient()
    } catch (clientError: any) {
      console.error('[events/register] Supabase client creation error', {
        requestId,
        message: clientError.message,
        error: clientError
      })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Database configuration error',
          detail: clientError.message || 'Failed to create database client',
          requestId
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
        })
        .select()
        .single()

      registration = data
      insertError = error
    } catch (insertException: any) {
      console.error('[events/register] Exception during insert', {
        requestId,
        message: insertException.message,
        stack: insertException.stack,
        error: insertException
      })
      return NextResponse.json(
        {
          ok: false,
          error: 'Internal error',
          detail: insertException.message || 'Database insert exception',
          requestId
        },
        { status: 500 }
      )
    }

    // Handle insert errors with detailed logging
    if (insertError) {
      console.error('[events/register] Supabase insert error', {
        requestId,
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
        error: insertError
      })

      // Handle missing table/column errors
      if (insertError.code === '42P01') { // Undefined table
        return NextResponse.json(
          { 
            ok: false, 
            error: 'Database table not found. Please run the migration.',
            detail: `Table 'event_registrations' does not exist. Run: supabase/schema.sql`,
            requestId
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
            requestId
          },
          { status: 500 }
        )
      }

      // Generic database error
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Failed to save registration. Please try again.',
          detail: `Database error: ${insertError.code} - ${insertError.message}`,
          requestId
        },
        { status: 500 }
      )
    }

    if (!registration) {
      console.error('[events/register] Insert succeeded but no data returned', { requestId })
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Registration saved but confirmation failed.',
          detail: 'No data returned from insert',
          requestId
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
          requestId,
          reason: emailDeliveryReason
        })
      } else if (emailDeliveryStatus === 'failed') {
        console.error('[events/register] Email sending failed', {
          requestId,
          reason: emailDeliveryReason
        })
      }
    } catch (emailError: any) {
      // Import error or other unexpected error
      console.error('[events/register] Email service error', {
        requestId,
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
      ...(emailDeliveryReason && { email_delivery_reason: emailDeliveryReason }),
      requestId
    })
  } catch (error: any) {
    // Catch-all for unexpected errors
    console.error('[events/register] Unexpected error', {
      requestId,
      message: error?.message,
      stack: error?.stack,
      error
    })
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal error',
        detail: error?.message || 'Unexpected server error',
        requestId
      },
      { status: 500 }
    )
  }
}
