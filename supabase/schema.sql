-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'public' CHECK (role IN ('admin', 'member', 'public')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'canceled', 'past_due', 'inactive')),
  current_period_end TIMESTAMPTZ,
  price_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  one_line_promise TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  idea_content TEXT,
  strategy_content TEXT,
  action_content TEXT,
  thumbnail_path TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tools table
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  gated_level TEXT NOT NULL DEFAULT 'member' CHECK (gated_level IN ('email', 'member')),
  type TEXT NOT NULL CHECK (type IN ('download', 'interactive', 'link')),
  file_path TEXT,
  tool_config JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email unlocks table
CREATE TABLE IF NOT EXISTS email_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email, tool_id)
);

-- Action completions table (optional)
CREATE TABLE IF NOT EXISTS action_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT,
  UNIQUE(user_id, event_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_stripe_customer_id ON memberships(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_email_unlocks_email ON email_unlocks(email);
CREATE INDEX IF NOT EXISTS idx_action_completions_user_id ON action_completions(user_id);

-- RLS Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_completions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Memberships policies
CREATE POLICY "Users can view own membership" ON memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all memberships" ON memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Events policies
CREATE POLICY "Public can read free preview events" ON events
  FOR SELECT USING (
    status = 'published' AND is_free_preview = true
  );

CREATE POLICY "Members can read all published events" ON events
  FOR SELECT USING (
    status = 'published' AND (
      is_free_preview = true OR
      EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.user_id = auth.uid() AND memberships.status = 'active'
      )
    )
  );

CREATE POLICY "Admins can read all events" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert events" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update events" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete events" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Tools policies
CREATE POLICY "Public can read email-gated tools if unlocked" ON tools
  FOR SELECT USING (
    status = 'published' AND (
      gated_level = 'email' AND EXISTS (
        SELECT 1 FROM email_unlocks
        WHERE email_unlocks.tool_id = tools.id
        AND email_unlocks.email = (SELECT email FROM profiles WHERE id = auth.uid() LIMIT 1)
      )
    )
  );

CREATE POLICY "Members can read member-gated tools" ON tools
  FOR SELECT USING (
    status = 'published' AND (
      gated_level = 'email' OR
      (gated_level = 'member' AND EXISTS (
        SELECT 1 FROM memberships
        WHERE memberships.user_id = auth.uid() AND memberships.status = 'active'
      ))
    )
  );

CREATE POLICY "Admins can read all tools" ON tools
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert tools" ON tools
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update tools" ON tools
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete tools" ON tools
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Email unlocks policies
CREATE POLICY "Anyone can insert email unlocks" ON email_unlocks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own email unlocks" ON email_unlocks
  FOR SELECT USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid() LIMIT 1)
  );

-- Action completions policies
CREATE POLICY "Users can view own completions" ON action_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON action_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completions" ON action_completions
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

