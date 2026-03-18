-- Migration 003: Add IP address and user-agent to download logs
-- This strengthens the audit trail so that in case of a leak,
-- we can identify not just the user but the device/location.

ALTER TABLE public.downloads
  ADD COLUMN IF NOT EXISTS ip_address  TEXT,
  ADD COLUMN IF NOT EXISTS user_agent  TEXT;
