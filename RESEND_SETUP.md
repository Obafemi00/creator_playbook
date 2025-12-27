# Resend Email Setup Guide

## Quick Setup Steps

### 1. Sign Up for Resend

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. In Resend Dashboard, go to **API Keys** (left sidebar)
2. Click **Create API Key**
3. Give it a name (e.g., "Creator Playbook Production")
4. Copy the API key (starts with `re_`)
   - ⚠️ **Important:** You can only see it once! Copy it immediately.

### 3. Verify Your Domain (Required for Production)

To send emails from `no-reply@mycreatorplaybook.com`, you need to verify your domain:

1. In Resend Dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter: `mycreatorplaybook.com`
4. Resend will provide DNS records to add:
   - **TXT record** for domain verification
   - **DKIM records** (3 CNAME records) for email authentication
5. Add these records to your domain's DNS settings
6. Wait for verification (usually 5-15 minutes)
7. Once verified, you can use `no-reply@mycreatorplaybook.com` as the sender

**For Development/Testing:**
- Resend provides a test domain: `onboarding@resend.dev`
- You can use this without domain verification for testing

### 4. Add to `.env.local`

Add these lines to your `.env.local` file:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=no-reply@mycreatorplaybook.com
```

**For local development/testing (if domain not verified yet):**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 5. Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:

   **Variable 1:**
   - Name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxx` (your actual API key)
   - Environment: Select all (Production, Preview, Development)

   **Variable 2:**
   - Name: `RESEND_FROM_EMAIL`
   - Value: `no-reply@mycreatorplaybook.com` (or `onboarding@resend.dev` for testing)
   - Environment: Select all (Production, Preview, Development)

4. Click **Save**
5. **Important:** Redeploy your application for changes to take effect:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**

### 6. Verify It's Working

After setting up:

1. Submit a test registration on `/events` page
2. Check the server logs (Vercel logs or local terminal)
3. Look for:
   - `[Email] Skipped sending...` = Resend not configured or not installed
   - `[Email] Failed to send...` = API key invalid or domain not verified
   - No email logs = Email sent successfully (check spam folder)

### Troubleshooting

**"api_key_missing" error:**
- Check that `RESEND_API_KEY` is set in `.env.local` and Vercel
- Restart dev server after adding to `.env.local`
- Redeploy on Vercel after adding environment variables

**"resend_not_installed" error:**
- Run: `npm install resend`
- This is optional - registration will still work, emails just won't send

**Email sending fails:**
- Verify domain is verified in Resend dashboard
- Check that `RESEND_FROM_EMAIL` matches a verified domain
- Check Resend dashboard → **Logs** for delivery errors
- Check spam folder - emails might be filtered

**Domain verification pending:**
- Use `onboarding@resend.dev` for testing
- Check DNS records are correctly added
- Wait 15-30 minutes for DNS propagation

### Current Status

✅ **Email service is optional** - Registration will work even without Resend
✅ **Build passes** - No dependency on Resend package
✅ **Graceful fallback** - If Resend fails, registration still succeeds

When you're ready to enable emails:
1. Install: `npm install resend`
2. Add API key to `.env.local` and Vercel
3. Verify domain in Resend
4. Emails will automatically start sending!
