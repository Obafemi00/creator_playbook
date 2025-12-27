# Playbook Paid Downloads - Setup Checklist

## ✅ Implementation Complete

The secure paid-only download system has been implemented. Follow these steps to activate it:

## 1. Database Setup (Supabase)

### Run the Schema Migration

1. Go to your Supabase Dashboard → SQL Editor
2. Run the updated `supabase/schema.sql` file (or just the new parts):
   ```sql
   -- Playbook purchases table
   CREATE TABLE IF NOT EXISTS playbook_purchases (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     email TEXT NOT NULL,
     stripe_session_id TEXT UNIQUE NOT NULL,
     stripe_payment_intent_id TEXT UNIQUE,
     amount INTEGER NOT NULL,
     currency TEXT NOT NULL DEFAULT 'usd',
     playbook_month TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed')),
     download_count INTEGER NOT NULL DEFAULT 0,
     last_downloaded_at TIMESTAMPTZ
   );

   -- Indexes
   CREATE INDEX IF NOT EXISTS idx_playbook_purchases_email_month ON playbook_purchases(email, playbook_month);
   CREATE INDEX IF NOT EXISTS idx_playbook_purchases_stripe_session_id ON playbook_purchases(stripe_session_id);
   CREATE INDEX IF NOT EXISTS idx_playbook_purchases_status ON playbook_purchases(status);

   -- RLS
   ALTER TABLE playbook_purchases ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "No public access to playbook purchases" ON playbook_purchases
     FOR ALL USING (false);
   ```

3. Verify the table was created:
   ```sql
   SELECT * FROM playbook_purchases LIMIT 1;
   ```

## 2. Environment Variables (Vercel/Production)

Ensure these are set in your Vercel project settings:

### Required Variables:
- ✅ `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_`)
- ✅ `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (starts with `whsec_`)
- ✅ `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., `https://yourdomain.com`)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server-side operations)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Already set
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Already set

### How to Get Stripe Webhook Secret:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint" or edit existing endpoint
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select event: `checkout.session.completed`
5. Copy the "Signing secret" (starts with `whsec_`)
6. Add it to Vercel as `STRIPE_WEBHOOK_SECRET`

## 3. Stripe Webhook Configuration

### In Stripe Dashboard:

1. **Webhook Endpoint URL:**
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```

2. **Events to Listen For:**
   - ✅ `checkout.session.completed` (required)
   - ✅ `payment_intent.succeeded` (optional, for additional verification)

3. **Test the Webhook:**
   - Use Stripe's "Send test webhook" feature
   - Or make a test purchase and verify the record appears in Supabase

## 4. Verify PDF File Location

Ensure the PDF file exists at:
```
/public/docs/Creator Playbook Website.pdf
```

If the filename has spaces, the download endpoint will handle it correctly.

## 5. Test the Flow

### Local Testing:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test checkout:**
   - Go to `/playbook`
   - Select an amount ($1, $2, or $3)
   - Enter email (or use logged-in user)
   - Click "Support"
   - Complete test payment in Stripe Checkout

3. **Verify webhook:**
   - Check Stripe Dashboard → Webhooks → Recent events
   - Check Supabase → `playbook_purchases` table for new record

4. **Test download:**
   - After payment, you should be redirected to `/playbook?success=1&session_id=cs_...`
   - Download button should unlock after verification
   - Click download and verify PDF is served

### Production Testing:

1. Deploy to Vercel
2. Make a real test purchase ($1)
3. Verify webhook fires and creates record
4. Test download functionality
5. Check download count increments in database

## 6. Monitoring & Debugging

### Check Webhook Logs:

- **Stripe Dashboard:** Developers → Webhooks → [Your endpoint] → Recent events
- Look for successful `200` responses

### Check Database:

```sql
-- View recent purchases
SELECT * FROM playbook_purchases 
ORDER BY created_at DESC 
LIMIT 10;

-- Check download counts
SELECT email, playbook_month, download_count, last_downloaded_at 
FROM playbook_purchases 
WHERE status = 'paid';
```

### Common Issues:

1. **Webhook not firing:**
   - Check webhook URL is correct in Stripe
   - Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
   - Check Vercel function logs

2. **Purchase not found:**
   - Verify webhook created the record
   - Check `playbook_month` matches current month (YYYY-MM)
   - Verify `status = 'paid'`

3. **Download fails:**
   - Check PDF file exists at `/public/docs/Creator Playbook Website.pdf`
   - Verify file permissions
   - Check Vercel function logs for errors

## 7. Optional Enhancements

### Add Success Toast:
Replace `console.log('Support payment successful!')` with a toast notification library.

### Add Email Notifications:
Send confirmation email when purchase is verified (via webhook).

### Add Download History:
Show users their download history in account page.

### Add Monthly Reset:
Consider how to handle new months (current implementation uses current month).

## 8. Security Checklist

- ✅ RLS enabled on `playbook_purchases` (no public access)
- ✅ All database operations use service role (server-side only)
- ✅ Download endpoint verifies payment before serving
- ✅ Session ID validation (must start with `cs_`)
- ✅ Webhook signature verification
- ✅ No client-side checks unlock downloads

## Next Steps

1. ✅ Run database migration
2. ✅ Set environment variables in Vercel
3. ✅ Configure Stripe webhook
4. ✅ Test the full flow
5. ✅ Monitor webhook events
6. ✅ Deploy to production

---

**Note:** The system is designed so that support payments ($1/$2/$3) automatically unlock downloads. The webhook creates a purchase record when a support payment is completed, which enables the download button.
