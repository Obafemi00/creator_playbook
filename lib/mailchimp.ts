/**
 * Mailchimp integration for syncing event registrations to audience
 * 
 * This module uses the Mailchimp Marketing API v3 via native fetch:
 * - POST https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members
 * - Authorization: Bearer {api_key}
 * 
 * Gracefully handles missing configuration:
 * - If MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID is missing, returns { ok: false, skipped: true, reason: 'config_missing' }
 * - Never throws errors - always returns a result object
 * - Registration will still succeed even if Mailchimp sync fails
 */

interface MailchimpSyncData {
  email: string
  firstName: string
  lastName: string
  country: string
  eventSlug?: string
}

interface MailchimpSyncResult {
  ok: boolean
  skipped?: boolean
  reason?: string
  memberId?: string
}

/**
 * Extract Mailchimp data center from API key
 * Format: {api_key}-{dc}
 */
function extractDataCenter(apiKey: string): string | null {
  const parts = apiKey.split('-')
  if (parts.length < 2) {
    return null
  }
  return parts[parts.length - 1]
}

/**
 * Sync user to Mailchimp audience
 * 
 * Uses Mailchimp Marketing API v3:
 * - Creates new member or updates existing (upsert by email)
 * - Adds tags: "Event Registration", "Creator Playbook"
 * - Stores merge fields: FNAME, LNAME, COUNTRY, EVENT_SLUG
 */
export async function syncToMailchimp(data: MailchimpSyncData): Promise<MailchimpSyncResult> {
  // Check required environment variables
  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID

  if (!apiKey || !listId) {
    console.warn('[Mailchimp] Configuration missing. Skipping sync.', {
      hasApiKey: !!apiKey,
      hasListId: !!listId
    })
    return { ok: false, skipped: true, reason: 'config_missing' }
  }

  // Extract data center from API key
  const dataCenter = extractDataCenter(apiKey)
  if (!dataCenter) {
    console.error('[Mailchimp] Invalid API key format. Expected format: {key}-{dc}')
    return { ok: false, skipped: false, reason: 'invalid_api_key_format' }
  }

  const mailchimpBaseUrl = `https://${dataCenter}.api.mailchimp.com/3.0`
  const memberEndpoint = `${mailchimpBaseUrl}/lists/${listId}/members`

  // Mailchimp uses MD5 hash of lowercase email as member ID for upsert
  // Use Node.js crypto module (available in server environment)
  const crypto = require('crypto')
  const emailHash = crypto.createHash('md5').update(data.email.toLowerCase()).digest('hex')

  try {
    // Upsert member (PUT creates or updates)
    // Mailchimp uses MD5 hash of email in URL, email_address in body
    const response = await fetch(`${memberEndpoint}/${emailHash}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: data.email.toLowerCase(),
        status: 'subscribed', // subscribed, unsubscribed, cleaned, pending, transactional
        status_if_new: 'subscribed', // Only set if new member
        merge_fields: {
          FNAME: data.firstName,
          LNAME: data.lastName,
          COUNTRY: data.country,
          ...(data.eventSlug && { EVENT_SLUG: data.eventSlug }),
        },
        tags: [
          'Event Registration',
          'Creator Playbook',
          ...(data.eventSlug ? [`Event: ${data.eventSlug}`] : []),
        ],
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      // Handle specific Mailchimp error codes
      if (response.status === 400) {
        console.error(`[Mailchimp] Bad request (400):`, responseData)
        return { 
          ok: false, 
          skipped: false, 
          reason: responseData.detail || 'invalid_request' 
        }
      }

      if (response.status === 401) {
        console.error(`[Mailchimp] Unauthorized (401): Check API key`)
        return { 
          ok: false, 
          skipped: false, 
          reason: 'unauthorized' 
        }
      }

      if (response.status === 404) {
        console.error(`[Mailchimp] List not found (404): Check LIST_ID`)
        return { 
          ok: false, 
          skipped: false, 
          reason: 'list_not_found' 
        }
      }

      console.error(`[Mailchimp] API error (${response.status}):`, responseData)
      return { 
        ok: false, 
        skipped: false, 
        reason: responseData.detail || `HTTP ${response.status}` 
      }
    }

    // Success
    return { 
      ok: true, 
      memberId: responseData.id || emailHash
    }
  } catch (error: any) {
    console.error(`[Mailchimp] Failed to sync ${data.email}:`, error)
    return { 
      ok: false, 
      skipped: false, 
      reason: error.message || 'network_error' 
    }
  }
}
