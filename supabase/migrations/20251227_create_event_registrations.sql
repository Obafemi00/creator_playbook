-- Migration: Create event_registrations table
-- Date: 2025-12-27
-- Description: Table for storing event registration form submissions
-- This table is server-only (RLS blocks public access, service role bypasses RLS)

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at 
  ON public.event_registrations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_registrations_email 
  ON public.event_registrations(email);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_slug 
  ON public.event_registrations(event_slug);

-- Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Block all public access
-- Service role (used by API route) bypasses RLS, so inserts will work from server
-- This ensures no client-side direct access to the table
CREATE POLICY "No public access to event_registrations" 
  ON public.event_registrations
  FOR ALL 
  USING (false);

-- Optional: Allow admins to read (if admin_profiles table exists)
-- Uncomment if you want admins to view registrations in Supabase dashboard
-- CREATE POLICY "Admins can read event registrations" 
--   ON public.event_registrations
--   FOR SELECT 
--   USING (
--     EXISTS (
--       SELECT 1 FROM admin_profiles
--       WHERE admin_profiles.user_id = auth.uid()
--     )
--   );
