# Event Registration System - Setup Guide

## ✅ Implementation Complete

The event registration system has been implemented with database, API routes, email notifications, and legal pages.

---

## 📁 Files Created/Modified

### Created Files:
1. **`supabase/migrations/add_event_registrations.sql`** - Database migration
2. **`lib/email.ts`** - Email service using Resend
3. **`app/api/events/register/route.ts`** - Registration API endpoint
4. **`components/events/EventRegistrationForm.tsx`** - Registration form component
5. **`app/terms/page.tsx`** - Terms of Service page (complete)
6. **`app/privacy/page.tsx`** - Privacy Policy page (complete)
7. **`EVENT_REGISTRATION_SETUP.md`** - This file

### Modified Files:
1. **`app/events/page.tsx`** - Added EventRegistrationForm component
2. **`package.json`** - Added `resend` dependency

---

## 🗄️ Database Setup

### Run Migration in Supabase

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run the migration file: `supabase/migrations/add_event_registrations.sql`

Or copy-paste this SQL:

```sql
-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  event_slug TEXT NOT NULL DEFAULT 'current',
  source TEXT,
  ip TEXT,
  user_agent TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_slug ON event_registrations(event_slug);

-- Unique constraint: prevent duplicate registrations per event
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_registrations_unique_event_email 
ON event_registrations(event_slug, email);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: No public access (server-only via service role)
CREATE POLICY "No public access to event_registrations" ON event_registrations
  FOR ALL USING (false);
```

3. Verify table was created:
```sql
SELECT * FROM event_registrations LIMIT 1;
```

---

## 📧 Email Setup (Resend)

### 1. Install Resend Package

```bash
npm install resend
```

### 2. Get Resend API Key

1. Sign up at https://resend.com
2. Go to **API Keys** section
3. Create a new API key
4. Copy the key (starts with `re_`)

### 3. Verify Sender Domain (Required)

1. In Resend Dashboard, go to **Domains**
2. Add your domain: `mycreatorplaybook.com`
3. Add the DNS records provided by Resend
4. Wait for verification (usually a few minutes)

### 4. Environment Variables

Add to `.env.local` and Vercel:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=no-reply@mycreatorplaybook.com
NEXT_PUBLIC_SITE_URL=https://mycreatorplaybook.com
# Or use:
SITE_URL=https://mycreatorplaybook.com
```

**Important:** 
- `RESEND_FROM_EMAIL` must be a verified domain in Resend
- For development, you can use Resend's test domain: `onboarding@resend.dev`

---

## 🧪 Testing Checklist

### Database
- [ ] Run migration SQL in Supabase
- [ ] Verify `event_registrations` table exists
- [ ] Check RLS is enabled (no public access)

### Email Service
- [ ] Install Resend: `npm install resend`
- [ ] Set `RESEND_API_KEY` in environment
- [ ] Verify sender domain in Resend dashboard
- [ ] Test notification email to sav@mycreatorplaybook.com
- [ ] Test confirmation email to registrant

### Registration Form
- [ ] Visit `/events` page
- [ ] Form appears below event listings
- [ ] Fill out form and submit
- [ ] Success message appears
- [ ] Check Supabase: row created in `event_registrations`
- [ ] Check email inbox: notification received
- [ ] Check registrant email: confirmation received

### Duplicate Prevention
- [ ] Try registering same email twice for same event
- [ ] Should show friendly error: "This email is already registered for this event."
- [ ] Only one row in database

### Validation
- [ ] Try submitting empty form → shows validation errors
- [ ] Try invalid email → shows email validation error
- [ ] Try without country → shows country required error

### Legal Pages
- [ ] Visit `/terms` → shows complete Terms of Service
- [ ] Visit `/privacy` → shows complete Privacy Policy
- [ ] Footer links work correctly

### Build
- [ ] Run `npm run build` → succeeds
- [ ] No TypeScript errors
- [ ] No missing dependencies

---

## 🔒 Security Features

✅ **Server-side validation** - Zod schema validation
✅ **Honeypot field** - Bot protection
✅ **Rate limiting** - 3 requests per minute per IP
✅ **RLS enabled** - No public database access
✅ **Service role only** - All inserts via service role key
✅ **Email normalization** - Lowercase, trimmed
✅ **Duplicate prevention** - Unique constraint on (event_slug, email)

---

## 📝 API Endpoint

**POST** `/api/events/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "country": "United States",
  "email": "john@example.com",
  "eventSlug": "current",
  "honeypot": "" // Hidden field - reject if filled
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "id": "uuid-here"
}
```

**Error Responses:**
- `400` - Validation error
- `409` - Duplicate email for event
- `429` - Rate limit exceeded
- `500` - Server error

---

## 📧 Email Templates

### Notification Email (to sav@mycreatorplaybook.com)
- **Subject:** "New Event Registration: {First Last}"
- **Content:** Registration summary card with all details
- **Brand:** Dark theme, orange accent, premium styling

### Confirmation Email (to registrant)
- **Subject:** "You're registered for Creator Playbook Events"
- **Content:** Welcome message + link back to events page
- **Brand:** Dark theme, orange accent, warm tone

---

## 🎨 Form Features

### Design
- Premium dark card with border and shadow
- Dark inputs with orange focus ring
- Orange CTA button with hover lift
- Success/error states with animations
- Respects `prefers-reduced-motion`

### Validation
- Client-side: Zod schema validation
- Server-side: Zod schema validation
- Real-time error messages
- Accessible: ARIA labels, proper focus states

### Anti-Spam
- Honeypot field (hidden)
- Rate limiting (3 per minute per IP)
- Server-side validation

---

## 📚 Legal Pages Content

### Terms of Service
- Acceptance of Terms
- Description of Service
- User Accounts
- Acceptable Use
- Intellectual Property
- Payments and Refunds
- Disclaimers
- Limitation of Liability
- Changes to Terms
- Contact Information

### Privacy Policy
- Introduction
- Information We Collect
- How We Use Information
- Data Storage and Security
- Email Communications
- Data Retention
- Your Rights
- Cookies and Analytics
- Third-Party Services
- Children's Privacy
- Changes to Policy
- Contact Information

---

## 🚀 Deployment Checklist

1. ✅ Run database migration in Supabase
2. ✅ Install Resend: `npm install resend`
3. ✅ Set environment variables in Vercel:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. ✅ Verify sender domain in Resend
5. ✅ Test registration flow
6. ✅ Test email delivery
7. ✅ Verify legal pages are accessible

---

## 🐛 Troubleshooting

### Build fails with "Module not found: resend"
**Solution:** Run `npm install resend`

### Emails not sending
**Check:**
- `RESEND_API_KEY` is set correctly
- Sender domain is verified in Resend
- Check Resend dashboard for delivery logs

### Duplicate registration error
**Expected:** This is correct behavior - prevents duplicate registrations per event

### Rate limit error
**Expected:** Prevents spam - wait 1 minute and try again

---

**Status:** ✅ Implementation complete - Install Resend and configure environment variables to activate
