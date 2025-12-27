-- Migration: Add event_registrations table
-- Date: 2025-01-XX
-- Description: Table for storing event registration submissions

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  event_slug TEXT NULL,
  user_agent TEXT NULL,
  ip TEXT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_slug ON event_registrations(event_slug);

-- Composite index for deduplication check
CREATE INDEX IF NOT EXISTS idx_event_registrations_email_event_slug 
ON event_registrations(email, event_slug) 
WHERE event_slug IS NOT NULL;

-- Unique constraint: prevent duplicate registrations per event
-- Only applies when event_slug is not null
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_registrations_unique_event_email 
ON event_registrations(event_slug, email) 
WHERE event_slug IS NOT NULL;

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: No public access (server-only via service role)
-- Service role key bypasses RLS, so this is safe
CREATE POLICY "No public access to event_registrations" ON event_registrations
  FOR ALL USING (false);
