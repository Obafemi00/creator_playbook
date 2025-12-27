-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Volumes table
CREATE TABLE IF NOT EXISTS volumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  event_date DATE NOT NULL,
  one_line_promise TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  price_cents INTEGER NOT NULL DEFAULT 100,
  pdf_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volume_id UUID NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  paid BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('OWNER', 'ADMIN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles table (for all users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Toolbox signups (simple email collection)
CREATE TABLE IF NOT EXISTS toolbox_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Playbook supports table (for monthly support payments)
CREATE TABLE IF NOT EXISTS playbook_supports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- Amount in cents (100 = $1.00)
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  buyer_email TEXT, -- Email of the buyer (from Stripe session)
  month TEXT, -- Format: YYYY-MM
  product TEXT NOT NULL DEFAULT 'playbook',
  metadata JSONB, -- Additional metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Playbook purchases table (for paid downloads)
CREATE TABLE IF NOT EXISTS playbook_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents (100, 200, or 300)
  currency TEXT NOT NULL DEFAULT 'usd',
  playbook_month TEXT NOT NULL, -- Format: YYYY-MM (e.g. "2025-01")
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed')),
  download_count INTEGER NOT NULL DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  event_slug TEXT NOT NULL DEFAULT 'current',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_volumes_status ON volumes(status);
CREATE INDEX IF NOT EXISTS idx_volumes_slug ON volumes(slug);
CREATE INDEX IF NOT EXISTS idx_volumes_event_date ON volumes(event_date);
CREATE INDEX IF NOT EXISTS idx_purchases_volume_id ON purchases(volume_id);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session_id ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_playbook_supports_user_id ON playbook_supports(user_id);
CREATE INDEX IF NOT EXISTS idx_playbook_supports_stripe_checkout_session_id ON playbook_supports(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_playbook_supports_buyer_email ON playbook_supports(buyer_email);
CREATE INDEX IF NOT EXISTS idx_playbook_supports_status ON playbook_supports(status);
CREATE INDEX IF NOT EXISTS idx_playbook_purchases_email_month ON playbook_purchases(email, playbook_month);
CREATE INDEX IF NOT EXISTS idx_playbook_purchases_stripe_session_id ON playbook_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_playbook_purchases_status ON playbook_purchases(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_slug ON event_registrations(event_slug);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at DESC);

-- RLS Policies

-- Enable RLS
ALTER TABLE volumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolbox_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbook_supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbook_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Volumes policies
CREATE POLICY "Public can read published volumes" ON volumes
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can read all volumes" ON volumes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can insert volumes" ON volumes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update volumes" ON volumes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete volumes" ON volumes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
    )
  );

-- Purchases policies (server-side checks recommended)
CREATE POLICY "Users can read own purchases" ON purchases
  FOR SELECT USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Admins can read all purchases" ON purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
    )
  );

-- Admin profiles policies
CREATE POLICY "Admins can read admin profiles" ON admin_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Only owners can insert admin profiles" ON admin_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.role = 'OWNER'
    )
  );

CREATE POLICY "Only owners can update admin profiles" ON admin_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
      AND admin_profiles.role = 'OWNER'
    )
  );

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Toolbox signups policies
CREATE POLICY "Anyone can insert toolbox signups" ON toolbox_signups
  FOR INSERT WITH CHECK (true);

-- Playbook supports policies
CREATE POLICY "Users can read own supports" ON playbook_supports
  FOR SELECT USING (
    user_id = auth.uid() OR user_id IS NULL
  );

CREATE POLICY "Anyone can insert playbook supports" ON playbook_supports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read all playbook supports" ON playbook_supports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.user_id = auth.uid()
    )
  );

-- Playbook purchases policies (server-side only, no public access)
-- RLS is enabled but no public policies - all access via service role
CREATE POLICY "No public access to playbook purchases" ON playbook_purchases
  FOR ALL USING (false);

-- Event registrations policies
-- Allow public INSERT (form submissions), disallow public SELECT
CREATE POLICY "Public can insert event registrations" ON event_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "No public SELECT on event_registrations" ON event_registrations
  FOR SELECT USING (false);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_volumes_updated_at BEFORE UPDATE ON volumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playbook_supports_updated_at BEFORE UPDATE ON playbook_supports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
