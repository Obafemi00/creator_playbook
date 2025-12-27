# Events Registration - Verification Guide

## ✅ Quick Verification Steps

### Step 1: Create the Database Table

**Option A: Run Migration in Supabase Dashboard (Recommended)**

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of:
   ```
   supabase/migrations/20251227_create_event_registrations.sql
   ```
4. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)
5. You should see: `Success. No rows returned`

**Option B: Manual SQL (If Migration File Not Available)**

Run this SQL in Supabase SQL Editor:

```sql
-- Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  event_slug TEXT NOT NULL DEFAULT 'current',
  source TEXT NOT NULL DEFAULT 'website'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at 
  ON public.event_registrations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_registrations_email 
  ON public.event_registrations(email);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_slug 
  ON public.event_registrations(event_slug);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Block all public access (server-only via service role)
CREATE POLICY "No public access to event_registrations" 
  ON public.event_registrations
  FOR ALL 
  USING (false);
```

### Step 2: Verify Table Exists

1. Go to **Supabase Dashboard** → **Table Editor**
2. Look for **`event_registrations`** in the left sidebar
3. Click on it to view the table structure
4. You should see columns:
   - `id` (uuid)
   - `created_at` (timestamptz)
   - `first_name` (text)
   - `last_name` (text)
   - `country` (text)
   - `email` (text)
   - `event_slug` (text)
   - `source` (text)

### Step 3: Test API Endpoint Locally

**Using curl:**

```bash
curl -X POST http://localhost:3000/api/events/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "country": "United States",
    "email": "john.doe@example.com",
    "eventSlug": "current",
    "honeypot": ""
  }'
```

**Expected Success Response (200 OK):**
```json
{
  "ok": true,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email_delivery": "sent"
}
```

**Expected Error Response (if table missing):**
```json
{
  "ok": false,
  "error": "Database table not found. Please run the migration.",
  "detail": "Table 'event_registrations' does not exist. Run migration: supabase/migrations/20251227_create_event_registrations.sql",
  "debugId": "abc1234"
}
```

### Step 4: Verify Row Inserted in Supabase

1. Go to **Supabase Dashboard** → **Table Editor**
2. Click on **`event_registrations`** table
3. You should see a new row with:
   - `first_name`: "John"
   - `last_name`: "Doe"
   - `country`: "United States"
   - `email`: "john.doe@example.com"
   - `event_slug`: "current"
   - `source`: "website"
   - `created_at`: Current timestamp
   - `id`: UUID

### Step 5: Test Form on Events Page

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/events`
3. Scroll down to the registration form
4. Fill in:
   - First Name: "Jane"
   - Last Name: "Smith"
   - Country: "Canada"
   - Email: "jane.smith@example.com"
5. Click **Register**
6. You should see a success message
7. Check Supabase Table Editor → `event_registrations` → new row appears

---

## 🔍 Troubleshooting

### Error: "Database table not found"

**Solution:**
- Run the migration SQL in Supabase SQL Editor (see Step 1)
- Verify table exists in Table Editor (see Step 2)

### Error: "SUPABASE_SERVICE_ROLE_KEY missing"

**Solution:**
1. Get your service role key from:
   - **Supabase Dashboard** → **Settings** → **API** → **Service Role Key** (secret)
2. Add to `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Restart dev server: `npm run dev`

### Error: "Database column mismatch"

**Solution:**
- The table exists but has wrong columns
- Drop and recreate the table:
  ```sql
  DROP TABLE IF EXISTS public.event_registrations CASCADE;
  ```
- Then run the migration again (Step 1)

### No rows appearing in Table Editor

**Possible Causes:**
1. **RLS blocking:** Check that service role key is being used (not anon key)
2. **Wrong table:** Make sure you're looking at `event_registrations` (not `event_registration`)
3. **Insert failed:** Check server logs for `[events/register]` errors

**Debug:**
- Check browser console for API response
- Check server terminal for `[events/register]` logs
- Check Supabase Dashboard → **Logs** → **Postgres Logs**

### Form shows "Failed to save registration"

**Check:**
1. Browser console (F12) → Network tab → `/api/events/register` → Response
2. Look for `debugId` in error response
3. Check server logs for that `debugId`
4. Common issues:
   - Missing `SUPABASE_SERVICE_ROLE_KEY`
   - Table doesn't exist (run migration)
   - Wrong column names (recreate table)

---

## 📊 Expected Database Schema

```sql
Table: public.event_registrations
├── id (uuid, primary key, default: gen_random_uuid())
├── created_at (timestamptz, not null, default: now())
├── first_name (text, not null)
├── last_name (text, not null)
├── country (text, not null)
├── email (text, not null)
├── event_slug (text, not null, default: 'current')
└── source (text, not null, default: 'website')

Indexes:
├── idx_event_registrations_created_at (created_at DESC)
├── idx_event_registrations_email (email)
└── idx_event_registrations_event_slug (event_slug)

RLS: Enabled
Policy: "No public access to event_registrations" (FOR ALL USING (false))
```

---

## ✅ Success Checklist

- [ ] Migration SQL runs without errors in Supabase SQL Editor
- [ ] Table `event_registrations` appears in Supabase Table Editor
- [ ] Table has all 8 columns (id, created_at, first_name, last_name, country, email, event_slug, source)
- [ ] `curl` test returns `{ "ok": true }`
- [ ] New row appears in Supabase after curl test
- [ ] Form on `/events` page submits successfully
- [ ] New row appears in Supabase after form submission
- [ ] No 500 errors in browser console or server logs
- [ ] `npm run build` passes with zero errors

---

## 🚀 Production Deployment

**Before deploying to Vercel:**

1. **Add Environment Variables in Vercel:**
   - Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
   - Add:
     - `SUPABASE_SERVICE_ROLE_KEY` (Production, Preview, Development)
     - `NEXT_PUBLIC_SUPABASE_URL` (Production, Preview, Development)
     - `RESEND_API_KEY` (optional, for emails)
     - `RESEND_FROM_EMAIL` (optional, for emails)

2. **Run Migration in Production Supabase:**
   - Use the same SQL from Step 1
   - Run it in your production Supabase project's SQL Editor

3. **Redeploy:**
   - Push to main branch, or
   - Go to **Vercel Dashboard** → **Deployments** → **Redeploy**

---

## 📝 Notes

- **Service Role Key:** This bypasses RLS, so it's safe to use server-side only
- **RLS Policy:** Blocks all public access, ensuring only server-side inserts work
- **Email:** Optional. Registration works even if `RESEND_API_KEY` is missing
- **Source Field:** Always set to `'website'` for form submissions
- **Debug ID:** Every error response includes a `debugId` for server log correlation

---

**Last Updated:** 2025-12-27
