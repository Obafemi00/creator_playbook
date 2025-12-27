-- Migration: Unify purchases, playbook_purchases, and playbook_supports into single purchases table
-- Date: 2025-01-XX
-- Description: Consolidates all payment-related tables into one unified purchases table

-- Step 1: Create unified purchases table
CREATE TABLE IF NOT EXISTS purchases_unified (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Payment identification
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  
  -- Purchase type and linkage
  volume_id UUID REFERENCES volumes(id) ON DELETE SET NULL, -- NULL for support payments, set for volume purchases
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for guest purchases
  
  -- Buyer information
  email TEXT NOT NULL,
  
  -- Payment details
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Download tracking (for playbook/volume downloads)
  download_count INTEGER NOT NULL DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  
  -- Additional metadata (store month, product type, etc.)
  metadata JSONB
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchases_unified_stripe_session_id ON purchases_unified(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_unified_stripe_payment_intent_id ON purchases_unified(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_purchases_unified_volume_id ON purchases_unified(volume_id);
CREATE INDEX IF NOT EXISTS idx_purchases_unified_user_id ON purchases_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_unified_email ON purchases_unified(email);
CREATE INDEX IF NOT EXISTS idx_purchases_unified_status ON purchases_unified(status);
CREATE INDEX IF NOT EXISTS idx_purchases_unified_email_volume ON purchases_unified(email, volume_id) WHERE volume_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_purchases_unified_created_at ON purchases_unified(created_at);

-- Step 3: Migrate data from old tables to unified table

-- Migrate from purchases table (volume purchases)
-- Only migrate records with valid stripe_session_id to avoid conflicts
INSERT INTO purchases_unified (
  id,
  created_at,
  stripe_session_id,
  volume_id,
  email,
  amount,
  currency,
  status,
  metadata
)
SELECT 
  p.id,
  p.created_at,
  p.stripe_session_id,
  p.volume_id,
  p.email,
  COALESCE(v.price_cents, 100) as amount, -- Default to 100 cents if volume not found
  'usd' as currency,
  CASE WHEN p.paid THEN 'paid' ELSE 'pending' END as status,
  jsonb_build_object('source', 'legacy_purchases', 'migrated_at', NOW()) as metadata
FROM purchases p
LEFT JOIN volumes v ON p.volume_id = v.id
WHERE p.stripe_session_id IS NOT NULL
  AND p.stripe_session_id NOT IN (SELECT stripe_session_id FROM purchases_unified WHERE stripe_session_id IS NOT NULL)
ON CONFLICT (stripe_session_id) DO NOTHING;

-- Migrate from playbook_purchases table
INSERT INTO purchases_unified (
  id,
  created_at,
  stripe_session_id,
  stripe_payment_intent_id,
  email,
  amount,
  currency,
  status,
  download_count,
  last_downloaded_at,
  metadata
)
SELECT 
  pp.id,
  pp.created_at,
  pp.stripe_session_id,
  pp.stripe_payment_intent_id,
  pp.email,
  pp.amount,
  pp.currency,
  CASE 
    WHEN pp.status = 'paid' THEN 'paid'
    WHEN pp.status = 'pending' THEN 'pending'
    ELSE 'failed'
  END as status,
  pp.download_count,
  pp.last_downloaded_at,
  jsonb_build_object(
    'source', 'legacy_playbook_purchases',
    'playbook_month', pp.playbook_month,
    'migrated_at', NOW()
  ) as metadata
FROM playbook_purchases pp
WHERE pp.stripe_session_id NOT IN (SELECT stripe_session_id FROM purchases_unified WHERE stripe_session_id IS NOT NULL)
ON CONFLICT (stripe_session_id) DO NOTHING;

-- Migrate from playbook_supports table (support payments)
INSERT INTO purchases_unified (
  id,
  created_at,
  updated_at,
  stripe_session_id,
  stripe_payment_intent_id,
  user_id,
  email,
  amount,
  currency,
  status,
  metadata
)
SELECT 
  ps.id,
  ps.created_at,
  ps.updated_at,
  ps.stripe_checkout_session_id as stripe_session_id,
  ps.stripe_payment_intent_id,
  ps.user_id,
  COALESCE(ps.buyer_email, '') as email,
  ps.amount,
  ps.currency,
  CASE 
    WHEN ps.status = 'completed' THEN 'paid'
    WHEN ps.status = 'pending' THEN 'pending'
    ELSE 'failed'
  END as status,
  jsonb_build_object(
    'source', 'legacy_playbook_supports',
    'month', ps.month,
    'product', ps.product,
    'original_metadata', ps.metadata,
    'migrated_at', NOW()
  ) as metadata
FROM playbook_supports ps
WHERE ps.stripe_checkout_session_id IS NOT NULL
  AND COALESCE(ps.buyer_email, '') != ''
  AND ps.stripe_checkout_session_id NOT IN (SELECT stripe_session_id FROM purchases_unified WHERE stripe_session_id IS NOT NULL)
ON CONFLICT (stripe_session_id) DO NOTHING;

-- Step 4: Enable RLS and set policies (server-only access)
ALTER TABLE purchases_unified ENABLE ROW LEVEL SECURITY;

-- Block all public access - server-only via service role
CREATE POLICY "No public access to purchases_unified" ON purchases_unified
  FOR ALL USING (false);

-- Step 5: Add trigger for updated_at
CREATE TRIGGER update_purchases_unified_updated_at BEFORE UPDATE ON purchases_unified
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Backup old purchases table and rename unified table
-- NOTE: Run this only after verifying the migration above and updating code
-- 
-- Option A: If you want to keep old purchases as backup temporarily:
-- ALTER TABLE purchases RENAME TO purchases_old;
-- ALTER TABLE purchases_unified RENAME TO purchases;
--
-- Option B: If you're confident in the migration:
-- DROP TABLE IF EXISTS purchases CASCADE;
-- ALTER TABLE purchases_unified RENAME TO purchases;
--
-- Then rename indexes:
-- ALTER INDEX idx_purchases_unified_stripe_session_id RENAME TO idx_purchases_stripe_session_id;
-- ALTER INDEX idx_purchases_unified_stripe_payment_intent_id RENAME TO idx_purchases_stripe_payment_intent_id;
-- ALTER INDEX idx_purchases_unified_volume_id RENAME TO idx_purchases_volume_id;
-- ALTER INDEX idx_purchases_unified_user_id RENAME TO idx_purchases_user_id;
-- ALTER INDEX idx_purchases_unified_email RENAME TO idx_purchases_email;
-- ALTER INDEX idx_purchases_unified_status RENAME TO idx_purchases_status;
-- ALTER INDEX idx_purchases_unified_email_volume RENAME TO idx_purchases_email_volume;
-- ALTER INDEX idx_purchases_unified_created_at RENAME TO idx_purchases_created_at;
--
-- Update policy:
-- DROP POLICY "No public access to purchases_unified" ON purchases;
-- CREATE POLICY "No public access to purchases" ON purchases FOR ALL USING (false);

-- Step 7: Drop old tables (ONLY after verifying migration and updating code)
-- DROP TABLE IF EXISTS purchases_old CASCADE;  -- If you used Option A
-- DROP TABLE IF EXISTS playbook_purchases CASCADE;
-- DROP TABLE IF EXISTS playbook_supports CASCADE;
