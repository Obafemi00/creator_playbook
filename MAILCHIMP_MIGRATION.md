# Mailchimp Migration Summary

## ✅ Migration Complete: Resend → Mailchimp

All Resend code has been removed and replaced with Mailchimp integration for syncing event registrations to the Mailchimp audience.

---

## 📋 What Changed

### Removed
- ✅ `lib/email.ts` - Deleted (all Resend email sending code)
- ✅ `RESEND_API_KEY` - No longer used
- ✅ `RESEND_FROM_EMAIL` - No longer used
- ✅ Resend externalization in `next.config.js` - Removed
- ✅ Resend reference in `app/privacy/page.tsx` - Updated to Mailchimp

### Added
- ✅ `lib/mailchimp.ts` - New Mailchimp sync utility
- ✅ Mailchimp integration in `app/api/events/register/route.ts`

---

## 🔧 Environment Variables Required

### New Variables (Required for Mailchimp)

```bash
# Mailchimp API Key
# Format: {api_key}-{data_center}
# Example: abc123def456-us1
MAILCHIMP_API_KEY=your_api_key-xx

# Mailchimp Audience/List ID
# Find this in Mailchimp Dashboard → Audience → Settings → Audience name and defaults
# Example: 12345678ab
MAILCHIMP_LIST_ID=your_list_id
```

### Removed Variables (No longer needed)

```bash
# ❌ Remove these from .env.local and Vercel
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
```

---

## 📊 How It Works

### Event Registration Flow

1. **User submits form** on `/events` page
2. **Supabase insert** - Registration saved to `event_registrations` table
3. **Mailchimp sync** - User synced to Mailchimp audience (non-blocking)
4. **Response returned** - Form submission succeeds regardless of Mailchimp status

### Mailchimp Data Mapping

When a user registers, they are synced to Mailchimp with:

- **Email** → Primary identifier (hashed with MD5 for member ID)
- **Merge Fields:**
  - `FNAME` → First name
  - `LNAME` → Last name
  - `COUNTRY` → Country
  - `EVENT_SLUG` → Event slug (if provided)
- **Tags:**
  - `Event Registration`
  - `Creator Playbook`
  - `Event: {eventSlug}` (dynamic tag based on event)

### Status: `subscribed`
- New members are automatically set to `subscribed`
- Existing members are updated (not re-subscribed)

---

## 🔍 Error Handling

### Non-Blocking Behavior
- **Supabase insert always succeeds first** (source of truth)
- **Mailchimp sync is best-effort** (non-blocking)
- **Form submission never fails** due to Mailchimp issues

### Logging

Server logs include Mailchimp sync status:

```javascript
// Success
[events/register] Mailchimp sync successful {
  debugId: 'abc123',
  email: 'user@example.com',
  memberId: 'xyz789'
}

// Skipped (config missing)
[events/register] Mailchimp sync skipped {
  debugId: 'abc123',
  reason: 'config_missing'
}

// Failed
[events/register] Mailchimp sync failed {
  debugId: 'abc123',
  reason: 'unauthorized' // or other error
}
```

### API Response

Registration API returns Mailchimp status:

```json
{
  "ok": true,
  "id": "registration-uuid",
  "mailchimp_sync": "synced", // or "skipped" or "failed"
  "mailchimp_sync_reason": "..." // if skipped/failed
}
```

---

## 📝 Mailchimp Setup Instructions

### 1. Get API Key

1. Go to [Mailchimp Dashboard](https://mailchimp.com/)
2. Click **Account & Billing** → **Extras** → **API keys**
3. Create a new API key (or use existing)
4. Copy the full key (format: `{key}-{dc}`)

### 2. Get List ID

1. Go to **Audience** → **All contacts**
2. Click **Settings** → **Audience name and defaults**
3. Find **Audience ID** (format: `12345678ab`)
4. Copy the ID

### 3. Configure Merge Fields (Optional)

To use merge fields in Mailchimp campaigns:

1. Go to **Audience** → **Settings** → **Audience fields and |MERGE| tags**
2. Ensure these merge fields exist:
   - `FNAME` (First Name) - usually exists by default
   - `LNAME` (Last Name) - usually exists by default
   - `COUNTRY` - Add if not present
   - `EVENT_SLUG` - Add if you want to segment by event

### 4. Set Up Welcome Email (Optional)

1. Go to **Automation** → **Create**
2. Choose **Welcome new subscribers**
3. Customize the email template
4. This will automatically send when new users are synced

---

## ✅ Testing Checklist

After deployment:

- [ ] **Environment variables set:**
  - `MAILCHIMP_API_KEY` configured in Vercel
  - `MAILCHIMP_LIST_ID` configured in Vercel
  - Old `RESEND_API_KEY` and `RESEND_FROM_EMAIL` removed

- [ ] **Form submission works:**
  - Submit form on `/events` page
  - Check Supabase `event_registrations` table for new row
  - Check server logs for `[events/register] Registration inserted successfully`

- [ ] **Mailchimp sync works:**
  - Check server logs for `[events/register] Mailchimp sync successful`
  - Check Mailchimp Dashboard → Audience → All contacts for new subscriber
  - Verify merge fields (FNAME, LNAME, COUNTRY) are populated
  - Verify tags (`Event Registration`, `Creator Playbook`) are applied

- [ ] **Error handling works:**
  - If Mailchimp config is missing, form still succeeds
  - Logs show `[events/register] Mailchimp sync skipped`
  - API response includes `mailchimp_sync: "skipped"`

- [ ] **Duplicate handling:**
  - Submit same email twice → First succeeds, second returns duplicate message
  - Mailchimp updates existing member (doesn't create duplicate)

---

## 🚀 Next Steps

### Monthly Campaigns

You can now create monthly campaigns in Mailchimp to send:
- **Playbook PDFs** (via attachment or link)
- **Video content** (via embedded video or link)
- **Personalized content** using merge fields (`FNAME`, `COUNTRY`, etc.)

### Segmentation

Use Mailchimp tags and segments to:
- Target users by event (`Event: current`)
- Target all registrations (`Event Registration` tag)
- Target by country (`COUNTRY` merge field)

### Automation

Set up Mailchimp automation:
- **Welcome series** - On registration
- **Monthly playbook delivery** - Scheduled campaigns
- **Event reminders** - Based on tags

---

## 📚 API Reference

### `syncToMailchimp(data)`

Syncs a user to Mailchimp audience.

**Parameters:**
```typescript
{
  email: string        // Required - User email
  firstName: string    // Required - First name
  lastName: string     // Required - Last name
  country: string      // Required - Country
  eventSlug?: string   // Optional - Event slug for tagging
}
```

**Returns:**
```typescript
{
  ok: boolean          // true if synced successfully
  skipped?: boolean    // true if skipped (config missing)
  reason?: string      // Error reason if failed
  memberId?: string    // Mailchimp member ID if successful
}
```

---

## 🐛 Troubleshooting

### Mailchimp sync failing?

1. **Check API key format:**
   - Must include data center (e.g., `abc123-us1`)
   - Copy full key from Mailchimp dashboard

2. **Check List ID:**
   - Find in Audience → Settings → Audience name and defaults
   - Should be alphanumeric (e.g., `12345678ab`)

3. **Check server logs:**
   - Look for `[events/register] Mailchimp sync failed`
   - Check the `reason` field in logs

4. **Common errors:**
   - `unauthorized` → Invalid API key
   - `list_not_found` → Wrong List ID
   - `invalid_request` → Missing merge fields or invalid data

### Users not appearing in Mailchimp?

1. Check server logs for sync status
2. Verify environment variables are set in Vercel
3. Check Mailchimp audience for the email address
4. Look for Mailchimp error in server logs

---

## ✨ Benefits of This Migration

- ✅ **Centralized email management** - All emails via Mailchimp
- ✅ **Better segmentation** - Use Mailchimp tags and segments
- ✅ **Campaign management** - Use Mailchimp UI for monthly campaigns
- ✅ **Analytics** - Track open rates, clicks, engagement
- ✅ **Automation** - Set up welcome series, monthly deliveries
- ✅ **Non-blocking** - Form submissions never fail due to email issues
- ✅ **Cleaner codebase** - Removed Resend dependencies and code

---

**Migration Date:** 2025-01-XX  
**Status:** ✅ Complete
