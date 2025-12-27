/**
 * Email service using Resend API via native fetch (no npm package required)
 * 
 * This module uses the Resend REST API directly via fetch:
 * - POST https://api.resend.com/emails
 * - Authorization: Bearer ${RESEND_API_KEY}
 * 
 * Gracefully handles missing configuration:
 * - If RESEND_API_KEY is missing, returns { ok: false, skipped: true, reason: 'api_key_missing' }
 * - Never throws errors - always returns a result object
 * - Registration will still succeed even if email fails
 */

interface RegistrationEmailData {
  firstName: string
  lastName: string
  country: string
  email: string
  eventSlug?: string
  timestamp: string
}

interface EmailResult {
  ok: boolean
  skipped?: boolean
  reason?: string
  id?: string
}

/**
 * Send email via Resend API using native fetch
 */
async function sendEmailViaResendAPI(options: {
  to: string
  subject: string
  html: string
  from?: string
}): Promise<EmailResult> {
  // Check API key
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not configured. Skipping email.')
    return { ok: false, skipped: true, reason: 'api_key_missing' }
  }

  const fromEmail = options.from || process.env.RESEND_FROM_EMAIL || 'no-reply@mycreatorplaybook.com'

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`[Email] Resend API error (${response.status}):`, data)
      return { 
        ok: false, 
        skipped: false, 
        reason: data.message || `HTTP ${response.status}` 
      }
    }

    return { ok: true, id: data.id }
  } catch (error: any) {
    console.error(`[Email] Failed to send to ${options.to}:`, error)
    return { 
      ok: false, 
      skipped: false, 
      reason: error.message || 'network_error' 
    }
  }
}

export async function sendRegistrationNotification(data: RegistrationEmailData): Promise<EmailResult> {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Event Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0B0C10; color: #F5F7FF;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0B0C10;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #12141B; border-radius: 24px; border: 1px solid #232635; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, rgba(255, 122, 26, 0.1) 0%, rgba(95, 179, 179, 0.1) 100%);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #F5F7FF; letter-spacing: -0.5px;">
                Creator Playbook
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #F5F7FF;">
                New Event Registration
              </h2>
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #B7BCCB;">
                Someone has registered for an event.
              </p>
              
              <!-- Registration Summary Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0F1117; border-radius: 12px; border: 1px solid #232635; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #232635;">
                          <strong style="color: #F5F7FF; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">First Name</strong>
                          <p style="margin: 4px 0 0; color: #B7BCCB; font-size: 16px;">${escapeHtml(data.firstName)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #232635;">
                          <strong style="color: #F5F7FF; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Last Name</strong>
                          <p style="margin: 4px 0 0; color: #B7BCCB; font-size: 16px;">${escapeHtml(data.lastName)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #232635;">
                          <strong style="color: #F5F7FF; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email</strong>
                          <p style="margin: 4px 0 0; color: #B7BCCB; font-size: 16px;">${escapeHtml(data.email)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #232635;">
                          <strong style="color: #F5F7FF; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Country</strong>
                          <p style="margin: 4px 0 0; color: #B7BCCB; font-size: 16px;">${escapeHtml(data.country)}</p>
                        </td>
                      </tr>
                      ${data.eventSlug ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <strong style="color: #F5F7FF; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Event</strong>
                          <p style="margin: 4px 0 0; color: #B7BCCB; font-size: 16px;">${escapeHtml(data.eventSlug)}</p>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0 0;">
                          <strong style="color: #F5F7FF; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Registered At</strong>
                          <p style="margin: 4px 0 0; color: #B7BCCB; font-size: 16px;">${escapeHtml(data.timestamp)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #232635; background-color: #0B0C10;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #7E8599;">
                Creator Playbook
              </p>
              <p style="margin: 0; font-size: 12px; color: #7E8599;">
                You're receiving this because someone registered on the Events page.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return sendEmailViaResendAPI({
    to: 'sav@mycreatorplaybook.com',
    subject: `New Event Registration: ${data.firstName} ${data.lastName}`,
    html,
  })
}

export async function sendRegistrationConfirmation(data: { 
  email: string
  firstName: string
  eventSlug?: string
}): Promise<EmailResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://mycreatorplaybook.com'
  const eventText = data.eventSlug ? ` for ${data.eventSlug}` : ''

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Registered</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0B0C10; color: #F5F7FF;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0B0C10;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #12141B; border-radius: 24px; border: 1px solid #232635; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, rgba(255, 122, 26, 0.1) 0%, rgba(95, 179, 179, 0.1) 100%);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #F5F7FF; letter-spacing: -0.5px;">
                Creator Playbook
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #F5F7FF;">
                You're registered${eventText ? ` for ${escapeHtml(data.eventSlug!)}` : ''}
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #B7BCCB;">
                Hi ${escapeHtml(data.firstName)},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #B7BCCB;">
                Thanks for registering! We'll send you event updates and reminders.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${siteUrl}/events" style="display: inline-block; padding: 16px 32px; background-color: #FF7A1A; color: #0B0C10; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 122, 26, 0.3);">
                      View Events
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #232635; background-color: #0B0C10;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #7E8599;">
                Creator Playbook
              </p>
              <p style="margin: 0; font-size: 12px; color: #7E8599;">
                <a href="${siteUrl}" style="color: #FF7A1A; text-decoration: none;">${siteUrl}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return sendEmailViaResendAPI({
    to: data.email,
    subject: `You're registered${eventText} for Creator Playbook Events`,
    html,
  })
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
