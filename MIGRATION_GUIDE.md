# Purchases Table Unification - Migration Guide

## Overview

This migration consolidates three purchase-related tables into one unified `purchases` table:
- `purchases` (volume purchases)
- `playbook_purchases` (playbook downloads)
- `playbook_supports` (support payments)

## Tables to Delete (After Migration)

1. **`purchases`** - Old volume purchases table (will be replaced by unified `purchases`)
2. **`playbook_purchases`** - Old playbook downloads table  
3. **`playbook_supports`** - Old support payments table

**Note:** The unified table is also named `purchases`, so the old `purchases` table will be dropped and replaced.

## Field Mapping

### From `purchases` table:
```
purchases.id                    → purchases.id
purchases.created_at           → purchases.created_at
purchases.stripe_session_id     → purchases.stripe_session_id
purchases.volume_id             → purchases.volume_id
purchases.email                 → purchases.email
volumes.price_cents             → purchases.amount
'usd'                           → purchases.currency
purchases.paid (boolean)        → purchases.status ('paid' or 'pending')
```

### From `playbook_purchases` table:
```
playbook_purchases.id                    → purchases.id
playbook_purchases.created_at            → purchases.created_at
playbook_purchases.stripe_session_id     → purchases.stripe_session_id
playbook_purchases.stripe_payment_intent_id → purchases.stripe_payment_intent_id
playbook_purchases.email                 → purchases.email
playbook_purchases.amount                → purchases.amount
playbook_purchases.currency              → purchases.currency
playbook_purchases.status                → purchases.status (mapped: 'paid'→'paid', 'pending'→'pending', 'failed'→'failed')
playbook_purchases.download_count         → purchases.download_count
playbook_purchases.last_downloaded_at    → purchases.last_downloaded_at
playbook_purchases.playbook_month        → purchases.metadata->>'playbook_month'
```

### From `playbook_supports` table:
```
playbook_supports.id                          → purchases.id
playbook_supports.created_at                  → purchases.created_at
playbook_supports.updated_at                  → purchases.updated_at
playbook_supports.stripe_checkout_session_id  → purchases.stripe_session_id
playbook_supports.stripe_payment_intent_id    → purchases.stripe_payment_intent_id
playbook_supports.user_id                     → purchases.user_id
playbook_supports.buyer_email                 → purchases.email
playbook_supports.amount                      → purchases.amount
playbook_supports.currency                    → purchases.currency
playbook_supports.status                      → purchases.status (mapped: 'completed'→'paid', 'pending'→'pending', 'failed'→'failed')
playbook_supports.month                       → purchases.metadata->>'month'
playbook_supports.product                     → purchases.metadata->>'product'
playbook_supports.metadata                    → purchases.metadata->>'original_metadata'
```

## New Unified Table Structure

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Payment identification
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  
  -- Purchase type and linkage
  volume_id UUID REFERENCES volumes(id) ON DELETE SET NULL, -- NULL for support, set for volume purchases
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for guest purchases
  
  -- Buyer information
  email TEXT NOT NULL,
  
  -- Payment details
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Download tracking
  download_count INTEGER NOT NULL DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  
  -- Additional metadata
  metadata JSONB
);
```

## Migration Steps

### Phase 1: Create and Migrate (Safe - No Data Loss)

1. Run `supabase/migrations/unify_purchases.sql` in Supabase SQL Editor
2. Verify data migration:
   ```sql
   -- Check counts match
   SELECT 
     (SELECT COUNT(*) FROM purchases) as old_purchases,
     (SELECT COUNT(*) FROM playbook_purchases) as old_playbook_purchases,
     (SELECT COUNT(*) FROM playbook_supports WHERE stripe_checkout_session_id IS NOT NULL) as old_supports,
     (SELECT COUNT(*) FROM purchases_unified) as new_unified;
   ```

3. Verify sample records:
   ```sql
   SELECT * FROM purchases_unified ORDER BY created_at DESC LIMIT 10;
   ```

### Phase 2: Update Code (Update All References)

Update these files to use the new unified table:

1. **`app/api/webhooks/stripe/route.ts`**
   - Change `from('purchases')` → `from('purchases_unified')` (temporarily)
   - Change `from('playbook_purchases')` → `from('purchases_unified')`
   - Change `from('playbook_supports')` → `from('purchases_unified')`
   - Update field mappings (see code changes below)

2. **`app/api/purchases/status/route.ts`**
   - Change `from('playbook_purchases')` → `from('purchases_unified')`
   - Update query to use `volume_id IS NULL` for support payments
   - For playbook_month, check `metadata->>'playbook_month'` or derive from volume

3. **`app/api/playbook/download/route.ts`**
   - Change `from('playbook_purchases')` → `from('purchases_unified')`
   - Update query logic

4. **`app/actions/stripe.ts`**
   - Change `from('purchases')` → `from('purchases_unified')`
   - Change `from('playbook_supports')` → `from('purchases_unified')`
   - Update field mappings

5. **`components/VolumeCard.tsx`**
   - Change `from('purchases')` → `from('purchases_unified')`
   - Update query to check `volume_id` and `status = 'paid'`

6. **`app/admin/page.tsx`**
   - Change `from('purchases')` → `from('purchases_unified')`

### Phase 3: Finalize Migration (After Code Update)

1. Rename table:
   ```sql
   DROP TABLE IF EXISTS purchases CASCADE;
   ALTER TABLE purchases_unified RENAME TO purchases;
   ```

2. Rename indexes (see migration file for full list)

3. Drop old tables:
   ```sql
   DROP TABLE IF EXISTS playbook_purchases CASCADE;
   DROP TABLE IF EXISTS playbook_supports CASCADE;
   ```

## Code Changes Required

### Webhook Handler Updates

**Old:**
```typescript
await supabase.from('purchases').insert({
  volume_id: session.metadata.volume_id,
  email: session.customer_email,
  stripe_session_id: session.id,
  paid: session.payment_status === 'paid',
})
```

**New:**
```typescript
await supabase.from('purchases').insert({
  volume_id: session.metadata.volume_id || null,
  email: session.customer_email,
  stripe_session_id: session.id,
  amount: session.amount_total || 0,
  currency: session.currency || 'usd',
  status: session.payment_status === 'paid' ? 'paid' : 'pending',
})
```

### Status Check Updates

**Old:**
```typescript
.from('playbook_purchases')
.select('email, status, playbook_month')
.eq('stripe_session_id', sessionId)
.eq('playbook_month', currentMonth)
```

**New:**
```typescript
.from('purchases')
.select('email, status, volume_id, metadata')
.eq('stripe_session_id', sessionId)
.eq('status', 'paid')
// For current month: check metadata->>'playbook_month' OR derive from volume.event_date
```

### Download Check Updates

**Old:**
```typescript
.from('playbook_purchases')
.eq('stripe_session_id', sessionId)
.eq('playbook_month', currentMonth)
.eq('status', 'paid')
```

**New:**
```typescript
.from('purchases')
.eq('stripe_session_id', sessionId)
.eq('status', 'paid')
// For playbook downloads: volume_id IS NULL OR check metadata
// For volume downloads: volume_id = specific volume
```

## Important Notes

1. **UUID Consistency**: All tables now use `uuid_generate_v4()` from `uuid-ossp` extension
2. **Status Values**: Unified to `'pending' | 'paid' | 'failed' | 'refunded'`
3. **Volume Linkage**: 
   - Volume purchases: `volume_id` is set
   - Support payments: `volume_id` is NULL
4. **Download Tracking**: Only relevant for purchases with downloads (volumes or playbook)
5. **Metadata**: Store month, product type, and other flexible data in JSONB `metadata` field

## Rollback Plan

If migration fails:

1. Keep `purchases_unified` table for reference
2. Old tables remain intact
3. Revert code changes
4. Drop `purchases_unified` table

## Testing Checklist

- [ ] Verify all data migrated correctly
- [ ] Test volume purchase flow
- [ ] Test support payment flow  
- [ ] Test download verification
- [ ] Test webhook creates records correctly
- [ ] Test status endpoint returns correct data
- [ ] Test download endpoint serves files
- [ ] Verify admin dashboard shows purchases
- [ ] Check RLS policies block public access
