# Unified Purchases Table - Summary

## ✅ Deliverables

### 1. New SQL Migration File
**File:** `supabase/migrations/unify_purchases.sql`

This migration:
- Creates `purchases_unified` table with all required fields
- Migrates data from 3 old tables
- Sets up indexes and RLS policies
- Includes commented steps for final table rename

### 2. Tables to Delete (After Migration)

1. **`purchases`** (old) - Will be replaced by unified `purchases` table
2. **`playbook_purchases`** - Consolidated into unified table
3. **`playbook_supports`** - Consolidated into unified table

### 3. Field Mapping

#### From `purchases` → `purchases` (unified):
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `id` | `id` | Preserved |
| `created_at` | `created_at` | Preserved |
| `stripe_session_id` | `stripe_session_id` | Now NOT NULL, UNIQUE |
| `volume_id` | `volume_id` | Preserved |
| `email` | `email` | Preserved |
| `paid` (boolean) | `status` | Mapped: `true` → `'paid'`, `false` → `'pending'` |
| `volumes.price_cents` | `amount` | Joined from volumes table |
| - | `currency` | Default: `'usd'` |
| - | `metadata` | Stores `{'source': 'legacy_purchases'}` |

#### From `playbook_purchases` → `purchases` (unified):
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `id` | `id` | Preserved |
| `created_at` | `created_at` | Preserved |
| `stripe_session_id` | `stripe_session_id` | Preserved |
| `stripe_payment_intent_id` | `stripe_payment_intent_id` | Preserved |
| `email` | `email` | Preserved |
| `amount` | `amount` | Preserved |
| `currency` | `currency` | Preserved |
| `status` | `status` | Direct mapping: `'paid'`→`'paid'`, `'pending'`→`'pending'`, `'failed'`→`'failed'` |
| `download_count` | `download_count` | Preserved |
| `last_downloaded_at` | `last_downloaded_at` | Preserved |
| `playbook_month` | `metadata->>'playbook_month'` | Stored in JSONB metadata |
| - | `volume_id` | NULL (support payments) |

#### From `playbook_supports` → `purchases` (unified):
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `id` | `id` | Preserved |
| `created_at` | `created_at` | Preserved |
| `updated_at` | `updated_at` | Preserved |
| `stripe_checkout_session_id` | `stripe_session_id` | Renamed field |
| `stripe_payment_intent_id` | `stripe_payment_intent_id` | Preserved |
| `user_id` | `user_id` | Preserved |
| `buyer_email` | `email` | Renamed field |
| `amount` | `amount` | Preserved |
| `currency` | `currency` | Preserved |
| `status` | `status` | Mapped: `'completed'`→`'paid'`, `'pending'`→`'pending'`, `'failed'`→`'failed'` |
| `month` | `metadata->>'month'` | Stored in JSONB metadata |
| `product` | `metadata->>'product'` | Stored in JSONB metadata |
| `metadata` | `metadata->>'original_metadata'` | Nested in new metadata |
| - | `volume_id` | NULL (support payments) |

## New Unified Table Structure

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Payment identification (REQUIRED)
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  
  -- Purchase type and linkage
  volume_id UUID REFERENCES volumes(id) ON DELETE SET NULL, -- NULL = support, set = volume purchase
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL = guest, set = logged in
  
  -- Buyer information
  email TEXT NOT NULL,
  
  -- Payment details
  amount INTEGER NOT NULL, -- Cents (100, 200, 300, or volume price)
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Download tracking
  download_count INTEGER NOT NULL DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  
  -- Flexible metadata
  metadata JSONB
);
```

## Key Design Decisions

1. **Single Table**: All payment types in one table for simplicity
2. **volume_id NULL = Support**: Support payments have `volume_id = NULL`
3. **volume_id Set = Purchase**: Volume purchases have `volume_id` set
4. **Status Values**: Unified to `'pending' | 'paid' | 'failed' | 'refunded'`
5. **UUID Consistency**: All use `uuid_generate_v4()` from `uuid-ossp`
6. **Server-Only Access**: RLS blocks all public access; service role only
7. **Metadata Flexibility**: JSONB stores month, product type, and other dynamic data

## Usage Patterns

### Volume Purchase:
```sql
INSERT INTO purchases (stripe_session_id, volume_id, email, amount, status)
VALUES ('cs_...', 'volume-uuid', 'user@email.com', 100, 'paid');
```

### Support Payment:
```sql
INSERT INTO purchases (stripe_session_id, email, amount, status, metadata)
VALUES ('cs_...', 'user@email.com', 200, 'paid', '{"month": "2025-01", "product": "playbook"}');
```

### Query Examples:

**Check if user purchased a volume:**
```sql
SELECT * FROM purchases 
WHERE volume_id = 'volume-uuid' 
  AND email = 'user@email.com' 
  AND status = 'paid';
```

**Check if user has current month support:**
```sql
SELECT * FROM purchases 
WHERE volume_id IS NULL 
  AND email = 'user@email.com' 
  AND status = 'paid'
  AND metadata->>'month' = '2025-01';
```

**Get all purchases for a user:**
```sql
SELECT * FROM purchases 
WHERE email = 'user@email.com' 
ORDER BY created_at DESC;
```

## Next Steps

1. Review `supabase/migrations/unify_purchases.sql`
2. Run migration in Supabase SQL Editor
3. Verify data migration (see MIGRATION_GUIDE.md)
4. Update code references (see MIGRATION_GUIDE.md)
5. Test all purchase flows
6. Finalize migration (rename table, drop old tables)
