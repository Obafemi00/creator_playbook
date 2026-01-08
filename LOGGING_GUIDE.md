# Event Registration Logging Guide

This guide explains how to check logs for the event registration form to verify it's working correctly.

## 📋 Quick Checklist

After submitting the event registration form, verify:

1. ✅ **Form submission creates a new row in `event_registrations`** (check Supabase)
2. ✅ **Server logs show success message** (check terminal/Vercel logs)
3. ✅ **No errors in logs** (check for `[events/register]` messages)
4. ✅ **Duplicate registrations return friendly message** (check browser console)

---

## 🔍 Method 1: Development Logs (Local)

### Where to Look

When running `npm run dev`, all server logs appear in **the terminal where you started the dev server**.

### What to Look For

#### ✅ **Success Log** (Line 276 in `app/api/events/register/route.ts`)
```
[events/register] Registration inserted successfully {
  debugId: 'abc123',
  registrationId: 'uuid-here',
  email: 'user@example.com',
  eventSlug: 'current'
}
```

#### ❌ **Error Logs** (Various lines)
```
[events/register] Supabase insert error {
  debugId: 'xyz789',
  message: '...',
  code: '23505',  // or other error codes
  payload: { ... }
}
```

#### ⚠️ **Duplicate Registration** (Line 236)
```
[events/register] Duplicate registration detected {
  debugId: 'def456',
  email: 'user@example.com',
  eventSlug: 'current'
}
```

### How to Test

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Submit the form** on `http://localhost:3000/events`

3. **Watch the terminal** where `npm run dev` is running

4. **Look for the log message** starting with `[events/register]`

---

## 🌐 Method 2: Production Logs (Vercel)

### Where to Look

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **Creator_Playbook**
3. Click **"Deployments"** tab
4. Click on the **latest deployment**
5. Click **"Functions"** tab
6. Find `/api/events/register`
7. Click **"View Logs"** or **"Runtime Logs"**

### Alternative: Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login
vercel login

# View logs
vercel logs --follow
```

### What to Look For

Same log messages as development, but in Vercel's log viewer:
- Success: `[events/register] Registration inserted successfully`
- Errors: `[events/register] Supabase insert error`
- Duplicates: `[events/register] Duplicate registration detected`

---

## 🗄️ Method 3: Check Supabase Database Directly

### Where to Look

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"Table Editor"** in the left sidebar
4. Find the **`event_registrations`** table
5. Click on it to view all rows

### What to Verify

- ✅ **New row appears** after form submission
- ✅ **Columns are populated correctly:**
  - `first_name`
  - `last_name`
  - `email`
  - `country`
  - `event_slug` (should be `'current'` or the event slug)
  - `created_at` (timestamp)

### SQL Query (Optional)

You can also run a query in Supabase SQL Editor:

```sql
SELECT 
  id,
  first_name,
  last_name,
  email,
  country,
  event_slug,
  created_at
FROM event_registrations
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🐛 Method 4: Browser Console (Client-Side)

### Where to Look

1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to **"Console"** tab
3. Submit the form
4. Look for any error messages

### What to Look For

#### ✅ **Success Response**
```javascript
// Network tab → /api/events/register → Response
{
  "ok": true,
  "id": "uuid-here",
  "email_delivery": "sent"
}
```

#### ❌ **Error Response**
```javascript
{
  "ok": false,
  "error": "Validation error",
  "details": [...],
  "debugId": "abc123"  // Use this to find the server log
}
```

#### ⚠️ **Duplicate Response**
```javascript
{
  "ok": true,
  "message": "You are already registered for this event.",
  "duplicate": true
}
```

---

## 🔍 Debugging with `debugId`

Every request generates a unique `debugId` that links:
- **Client response** → **Server logs** → **Database errors**

### How to Use It

1. **Submit the form**
2. **Check browser Network tab:**
   - Find `/api/events/register` request
   - Look at the response JSON
   - Copy the `debugId` (e.g., `"debugId": "xyz789"`)

3. **Search server logs for that ID:**
   ```bash
   # In terminal (development)
   # Look for: [events/register] ... { debugId: 'xyz789' }
   
   # In Vercel logs (production)
   # Search for: xyz789
   ```

4. **Find the exact error** associated with that request

---

## 📊 Common Log Patterns

### Pattern 1: Successful Registration
```
[events/register] Registration inserted successfully {
  debugId: 'abc123',
  registrationId: '550e8400-e29b-41d4-a716-446655440000',
  email: 'user@example.com',
  eventSlug: 'current'
}
```

### Pattern 2: Validation Error
```
[events/register] Validation error {
  debugId: 'def456',
  errors: [
    { field: 'email', message: 'Invalid email address' }
  ],
  body: { ... }
}
```

### Pattern 3: Database Error
```
[events/register] Supabase insert error {
  debugId: 'ghi789',
  message: 'duplicate key value violates unique constraint',
  code: '23505',
  payload: { ... }
}
```

### Pattern 4: Missing Environment Variable
```
[events/register] missing service role key { debugId: 'jkl012' }
```

---

## 🛠️ Troubleshooting

### No Logs Appearing?

1. **Check if dev server is running:**
   ```bash
   npm run dev
   ```

2. **Check if the API route is being called:**
   - Open browser Network tab
   - Submit form
   - Look for `/api/events/register` request

3. **Check Vercel function logs:**
   - Sometimes logs are delayed
   - Refresh the Vercel logs page

### Logs Show Errors?

1. **Copy the `debugId` from the error response**
2. **Search server logs for that `debugId`**
3. **Check the error details:**
   - `code`: Database error code (e.g., `23505` = duplicate)
   - `message`: Human-readable error
   - `payload`: What data was being inserted

### Database Not Updating?

1. **Check Supabase RLS policies:**
   - Go to Supabase Dashboard
   - Table Editor → `event_registrations`
   - Check "RLS" is enabled
   - Verify policies allow server-side inserts

2. **Check environment variables:**
   - `SUPABASE_SERVICE_ROLE_KEY` must be set
   - `NEXT_PUBLIC_SUPABASE_URL` must be set

3. **Check server logs for insert errors:**
   - Look for `[events/register] Supabase insert error`
   - Check the `code` and `message` fields

---

## ✅ Verification Checklist

After implementing the fix, verify:

- [ ] Form submission creates a new row in `event_registrations` (Supabase)
- [ ] Server logs show `[events/register] Registration inserted successfully`
- [ ] No errors in server logs (check for `[events/register]` errors)
- [ ] Duplicate registrations return `{ ok: true, message: "You are already registered..." }`
- [ ] Browser console shows success response with `ok: true`
- [ ] Email notifications are sent (check `email_delivery: "sent"` in response)

---

## 📝 Quick Reference

| What | Where | How |
|------|-------|-----|
| **Success logs** | Terminal (dev) / Vercel (prod) | Look for `[events/register] Registration inserted successfully` |
| **Error logs** | Terminal (dev) / Vercel (prod) | Look for `[events/register] ... error` |
| **Database rows** | Supabase Dashboard → Table Editor | Check `event_registrations` table |
| **Client errors** | Browser DevTools → Console | Check Network tab for API response |
| **Debug ID** | Response JSON → `debugId` | Use to search server logs |

---

## 🚀 Next Steps

If you find errors:

1. **Copy the `debugId`** from the error response
2. **Search server logs** for that ID
3. **Read the error details** (code, message, payload)
4. **Fix the issue** based on the error code:
   - `23505` = Duplicate (already handled)
   - `42703` = Column doesn't exist (schema mismatch)
   - `42P01` = Table doesn't exist (migration not run)
   - `500` = Server error (check env vars)

---

**Need help?** Check the error `code` and `message` in the logs, then refer to PostgreSQL error codes or Supabase documentation.
