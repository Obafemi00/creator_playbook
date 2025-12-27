# Complete Auth & Admin Portal Setup Guide

## ✅ Implementation Complete

This guide covers everything you need to configure after the auth system implementation.

---

## 1. Supabase Dashboard Configuration

### A) Site URL & Redirect URLs

1. Go to **Supabase Dashboard** → Your Project → **Authentication** → **URL Configuration**

2. **Site URL:**
   ```
   https://yourdomain.com
   ```
   For local development:
   ```
   http://localhost:3000
   ```

3. **Redirect URLs** (add all of these):
   ```
   http://localhost:3000/api/auth/callback
   https://yourdomain.com/api/auth/callback
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   http://localhost:3000/dashboard
   https://yourdomain.com/dashboard
   http://localhost:3000/account
   https://yourdomain.com/account
   ```

4. **Email Redirect To** (for magic links):
   ```
   https://yourdomain.com/api/auth/callback
   ```

### B) Email Templates

1. Go to **Authentication** → **Email Templates**

2. **Magic Link Template:**
   - Open `supabase/email-templates/magic-link.html`
   - Copy the entire HTML content
   - In Supabase Dashboard, go to **Magic Link** template
   - Click **Edit** and paste the HTML
   - Save

3. **Password Reset Template:**
   - Open `supabase/email-templates/password-reset.html`
   - Copy the entire HTML content
   - In Supabase Dashboard, go to **Reset Password** template
   - Click **Edit** and paste the HTML
   - Save

4. **Email Subject Lines:**
   - Magic Link: `Sign in to Creator Playbook`
   - Password Reset: `Reset your password - Creator Playbook`

### C) Email Settings

1. Go to **Authentication** → **Settings** → **SMTP Settings**

2. **For Production:**
   - Configure custom SMTP (recommended: SendGrid, Mailgun, or AWS SES)
   - Or use Supabase's built-in email service (limited)

3. **Email Confirmation:**
   - For development: Set to "Disabled" (auto-confirms)
   - For production: Set to "Enabled" (requires email confirmation)

---

## 2. Storage Bucket Setup

### A) Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard

2. Create a new bucket:
   - **Name:** `creator-playbook-pdfs`
   - **Public:** `No` (Private)
   - **File size limit:** 50 MB (or your preference)
   - **Allowed MIME types:** `application/pdf`

3. Click **Create bucket**

### B) Storage Policies (RLS)

The bucket should be **private** with server-side access only. Policies are automatically handled via service role key.

**Manual Policy (if needed):**
```sql
-- Allow service role to upload/download
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL
USING (bucket_id = 'creator-playbook-pdfs')
WITH CHECK (bucket_id = 'creator-playbook-pdfs');
```

**Note:** In production, use the service role key for all uploads/downloads. Never expose storage URLs directly to clients.

---

## 3. Admin User Setup

### A) Create Admin User (Secure Method)

**DO NOT hardcode passwords in code.** Follow these steps:

1. **Option 1: Via Supabase Dashboard (Recommended)**
   - Go to **Authentication** → **Users**
   - Click **Add user** → **Create new user**
   - Email: `foundergroundworks@gmail.com`
   - Password: (set a strong password)
   - Auto Confirm: `Yes`
   - Click **Create user**

2. **Option 2: Via Sign Up Flow**
   - Go to `/auth/signup`
   - Sign up with `foundergroundworks@gmail.com`
   - Confirm email (if email confirmation is enabled)

3. **Grant Admin Role:**
   - Go to **SQL Editor** in Supabase Dashboard
   - Run this query:
   ```sql
   INSERT INTO admin_profiles (user_id, role)
   SELECT id, 'OWNER'
   FROM auth.users
   WHERE email = 'foundergroundworks@gmail.com'
   ON CONFLICT (user_id) DO NOTHING;
   ```

4. **Verify Admin Access:**
   - Sign in at `/auth/login`
   - You should be redirected to `/dashboard`
   - If not, check the `admin_profiles` table

---

## 4. Environment Variables

Ensure these are set in your `.env.local` and Vercel:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important:** 
- `NEXT_PUBLIC_SITE_URL` must match your actual domain
- Never commit `SUPABASE_SERVICE_ROLE_KEY` to git

---

## 5. Testing Checklist

### ✅ Sign Up Flow
- [ ] Go to `/auth/signup`
- [ ] Create account with email/password
- [ ] Check email for confirmation (if enabled)
- [ ] Sign in and verify redirect to `/account`

### ✅ Sign In Flow
- [ ] Go to `/auth/login`
- [ ] Sign in with email/password
- [ ] Verify redirect to `/account` (regular user) or `/dashboard` (admin)

### ✅ Magic Link Flow
- [ ] Go to `/auth/login`
- [ ] Click "Use magic link instead"
- [ ] Enter email and click "Send magic link"
- [ ] Check email and click link
- [ ] Verify redirect to `/account` or `/dashboard`

### ✅ Forgot Password Flow
- [ ] Go to `/auth/forgot-password`
- [ ] Enter email
- [ ] Check email for reset link
- [ ] Click link and verify redirect to `/auth/reset-password`
- [ ] Set new password
- [ ] Verify redirect to `/account`

### ✅ Admin Access
- [ ] Sign in as admin user
- [ ] Verify redirect to `/dashboard`
- [ ] Access `/dashboard/upload`
- [ ] Upload a test PDF
- [ ] Verify file appears in Storage bucket
- [ ] Verify record created in `volumes` table

### ✅ Route Protection
- [ ] Try accessing `/dashboard` while logged out → should redirect to `/auth/login`
- [ ] Try accessing `/dashboard` as regular user → should redirect to `/`
- [ ] Try accessing `/account` while logged out → should redirect to `/auth/login`

### ✅ Sign Out
- [ ] Click "Sign out" in dashboard
- [ ] Verify redirect to `/auth/login`
- [ ] Verify cannot access protected routes

---

## 6. File Structure

### New Files Created:
```
app/
  auth/
    login/page.tsx              # Sign in page
    signup/page.tsx             # Sign up page
    forgot-password/page.tsx    # Forgot password page
    reset-password/page.tsx      # Reset password page
  dashboard/
    page.tsx                   # Admin dashboard
    upload/page.tsx              # Upload playbook page
  actions/
    auth.ts                      # Auth server actions

components/
  auth/
    AuthCard.tsx                 # Auth page container
    AuthInput.tsx                 # Form input component
    AuthButton.tsx                # Button component
  admin/
    UploadPlaybookForm.tsx        # Playbook upload form

app/api/auth/callback/route.ts   # Fixed callback handler

supabase/email-templates/
  magic-link.html                # Magic link email template
  password-reset.html            # Password reset email template
```

### Modified Files:
```
middleware.ts                    # Updated route protection
```

---

## 7. Common Issues & Solutions

### Issue: Magic link redirects to wrong URL
**Solution:** 
- Check `NEXT_PUBLIC_SITE_URL` matches your domain
- Verify Redirect URLs in Supabase Dashboard include `/api/auth/callback`
- Check callback route is using correct redirect logic

### Issue: Admin user not redirecting to dashboard
**Solution:**
- Verify `admin_profiles` table has entry for user
- Check middleware is checking admin status correctly
- Verify `isAdmin()` function in `lib/auth.ts`

### Issue: PDF upload fails
**Solution:**
- Check Storage bucket exists: `creator-playbook-pdfs`
- Verify bucket is private (not public)
- Check file size is under limit
- Verify service role key is set correctly

### Issue: Email not sending
**Solution:**
- Check SMTP settings in Supabase Dashboard
- Verify email templates are saved correctly
- Check spam folder
- For production, configure custom SMTP

---

## 8. Security Best Practices

✅ **Implemented:**
- Server-side auth checks (no client-side bypass)
- Service role key only on server
- Private storage bucket
- RLS policies on all tables
- Secure password requirements (min 6 chars)
- Session-based authentication

⚠️ **Reminders:**
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Always verify admin status server-side
- Use HTTPS in production
- Regularly rotate service role key
- Monitor auth logs in Supabase Dashboard

---

## 9. Next Steps

1. ✅ Configure Supabase Dashboard settings
2. ✅ Set up email templates
3. ✅ Create storage bucket
4. ✅ Create admin user
5. ✅ Test all auth flows
6. ✅ Test admin dashboard upload
7. ✅ Deploy to production
8. ✅ Update production environment variables
9. ✅ Test production auth flows

---

## Support

If you encounter issues:
1. Check Supabase Dashboard → Logs
2. Check browser console for errors
3. Verify environment variables
4. Test with a fresh user account
5. Check middleware logs in Vercel

**Email:** support@creatorplaybook.com (update this in email templates)
