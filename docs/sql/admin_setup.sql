-- Admin Portal Database Setup
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- Content Management Tables
-- ============================================

-- Create trade_content table
CREATE TABLE IF NOT EXISTS trade_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  salary TEXT NOT NULL,
  overview TEXT NOT NULL,
  dayToDay TEXT NOT NULL,
  workingEnvironment TEXT NOT NULL,
  applications TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resource_content table
CREATE TABLE IF NOT EXISTS resource_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  buttonText TEXT NOT NULL,
  url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partner_orgs table
CREATE TABLE IF NOT EXISTS partner_orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Triggers for updated_at
-- ============================================

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_trade_content_updated_at ON trade_content;
CREATE TRIGGER update_trade_content_updated_at
  BEFORE UPDATE ON trade_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resource_content_updated_at ON resource_content;
CREATE TRIGGER update_resource_content_updated_at
  BEFORE UPDATE ON resource_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_orgs_updated_at ON partner_orgs;
CREATE TRIGGER update_partner_orgs_updated_at
  BEFORE UPDATE ON partner_orgs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE trade_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_orgs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage trade_content" ON trade_content;
DROP POLICY IF EXISTS "Anyone can read trade_content" ON trade_content;
DROP POLICY IF EXISTS "Admins can manage resource_content" ON resource_content;
DROP POLICY IF EXISTS "Anyone can read resource_content" ON resource_content;
DROP POLICY IF EXISTS "Admins can manage partner_orgs" ON partner_orgs;
DROP POLICY IF EXISTS "Anyone can read partner_orgs" ON partner_orgs;

-- RLS Policies for admin access
-- Admin can do everything
CREATE POLICY "Admins can manage trade_content"
  ON trade_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
        OR (auth.users.raw_user_meta_data->>'role')::text = 'admin'
      )
    )
  );

CREATE POLICY "Admins can manage resource_content"
  ON resource_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
        OR (auth.users.raw_user_meta_data->>'role')::text = 'admin'
      )
    )
  );

CREATE POLICY "Admins can manage partner_orgs"
  ON partner_orgs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
        OR (auth.users.raw_user_meta_data->>'role')::text = 'admin'
      )
    )
  );

-- Public read access (for resources page)
CREATE POLICY "Anyone can read trade_content"
  ON trade_content
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read resource_content"
  ON resource_content
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read partner_orgs"
  ON partner_orgs
  FOR SELECT
  USING (true);

-- ============================================
-- Jobs Table Updates
-- ============================================

-- Ensure jobs.status can be null and supports flagged status
-- This should already exist, but we'll make sure
DO $$
BEGIN
  -- Check if status column exists and is nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'status'
  ) THEN
    -- Make sure status can be null
    ALTER TABLE jobs ALTER COLUMN status DROP NOT NULL;
    
    -- Add check constraint for valid status values (if not exists)
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'jobs_status_check'
    ) THEN
      ALTER TABLE jobs 
      ADD CONSTRAINT jobs_status_check 
      CHECK (status IS NULL OR status IN ('open', 'closed', 'flagged'));
    END IF;
  END IF;
END $$;

-- ============================================
-- Indexes for Performance
-- ============================================

-- Indexes for content tables
CREATE INDEX IF NOT EXISTS idx_trade_content_title ON trade_content(title);
CREATE INDEX IF NOT EXISTS idx_resource_content_category ON resource_content(category);
CREATE INDEX IF NOT EXISTS idx_partner_orgs_category ON partner_orgs(category);

-- Indexes for jobs (if not exist)
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date);

-- ============================================
-- Sample Data (Optional)
-- ============================================

-- Uncomment to insert sample trade content
/*
INSERT INTO trade_content (title, icon, salary, overview, dayToDay, workingEnvironment, applications)
VALUES 
  (
    'Machining',
    'lucide:wrench',
    '$45,000 - $80,000+ annually',
    'Machinists use powerful computer-guided machines to cut, shape, and finish metal parts that go into cars, airplanes, and medical equipment.',
    'You''ll read blueprints, set up machines, check measurements, and make sure every part is exact.',
    'Usually indoors in bright, clean machine shops with strong safety standards.',
    'Aerospace components, car engines, medical devices, and custom metal parts.'
  );
*/

-- ============================================
-- Helper Function: Set User as Admin
-- ============================================

-- Function to set a user as admin
CREATE OR REPLACE FUNCTION set_user_as_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{user_type}',
    '"admin"'
  )
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage: SELECT set_user_as_admin('admin@example.com');

