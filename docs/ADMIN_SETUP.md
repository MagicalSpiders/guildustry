# Admin Portal Setup Guide

## Overview

The admin portal provides comprehensive management capabilities for the Guildustry platform, including user management, job moderation, application tracking, and content management.

## Features

### 1. User Management
- View all candidates and employers
- Delete user accounts
- Search and filter users

### 2. Job Management
- Review pending job postings
- Approve or flag jobs
- Close job postings
- Filter by status (pending, open, flagged, closed)

### 3. Application Tracking
- View system-wide application statistics
- Track applications by trade
- Track applications by status
- Monitor candidate flow metrics

### 4. Content Management
- Manage trade content (Trade 101 section)
- Manage resources (downloadable guides, templates)
- Manage partner organizations
- Add/edit/delete content items

## Setting Up Admin Access

### Step 1: Create Admin User in Supabase

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add User" or "Invite User"
4. Create a user with email and password
5. After creation, click on the user to edit
6. In the "User Metadata" section, add:
   ```json
   {
     "user_type": "admin"
   }
   ```

Alternatively, you can use SQL to update an existing user:

```sql
-- Update user metadata to admin
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{user_type}',
  '"admin"'
)
WHERE email = 'admin@example.com';
```

### Step 2: Set Up Database Tables

Run the following SQL in your Supabase SQL Editor to create the content management tables:

```sql
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

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_trade_content_updated_at
  BEFORE UPDATE ON trade_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_content_updated_at
  BEFORE UPDATE ON resource_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_orgs_updated_at
  BEFORE UPDATE ON partner_orgs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE trade_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_orgs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin access only
-- Note: These policies allow only admin users to access these tables
-- You may need to adjust based on your RLS setup

-- Policy for trade_content (admin only)
CREATE POLICY "Admins can manage trade_content"
  ON trade_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type' = 'admin'
        OR auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Policy for resource_content (admin only)
CREATE POLICY "Admins can manage resource_content"
  ON resource_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type' = 'admin'
        OR auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Policy for partner_orgs (admin only)
CREATE POLICY "Admins can manage partner_orgs"
  ON partner_orgs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type' = 'admin'
        OR auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Public read access for candidates (for resources page)
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
```

### Step 3: Update Jobs Table (if needed)

Ensure the `jobs` table has a `status` column that can be `null` (for pending), `'open'`, `'closed'`, or `'flagged'`:

```sql
-- Check if status column exists and update if needed
ALTER TABLE jobs
  ALTER COLUMN status TYPE TEXT;

-- Ensure status can be null (for pending approval)
ALTER TABLE jobs
  ALTER COLUMN status DROP NOT NULL;
```

### Step 4: Access Admin Portal

1. Sign in with your admin account at `/auth/sign-in`
2. You will be automatically redirected to `/admin` dashboard
3. Navigate through the admin sections:
   - Dashboard: Overview statistics
   - Users: Manage candidates and employers
   - Jobs: Review and approve job postings
   - Applications: View application statistics
   - Content: Manage trade resources and partner organizations

## RLS Policies for Admin Functions

The admin functions use the `isAdmin()` check which verifies the user's role. However, you may need to create additional RLS policies or use service role keys for certain operations like deleting users from `auth.users`.

For production, consider:

1. **Service Role Key**: Use Supabase service role key for admin operations that require elevated privileges
2. **Database Functions**: Create PostgreSQL functions with `SECURITY DEFINER` for admin operations
3. **API Routes**: Create Next.js API routes that use service role key for sensitive operations

## Security Considerations

1. **Admin Role Verification**: Always verify admin role on both client and server side
2. **RLS Policies**: Ensure proper Row Level Security policies are in place
3. **Audit Logging**: Consider adding audit logs for admin actions
4. **Rate Limiting**: Implement rate limiting for admin endpoints
5. **Two-Factor Authentication**: Consider requiring 2FA for admin accounts

## Troubleshooting

### Admin user not recognized
- Verify `user_type` is set to `"admin"` in user metadata
- Check that the user is properly authenticated
- Clear browser cache and cookies

### Cannot access admin functions
- Verify RLS policies allow admin access
- Check that `isAdmin()` function is working correctly
- Ensure database tables exist and are accessible

### Content not showing on resources page
- Verify public read policies are in place
- Check that content items are properly inserted
- Ensure the resources page is querying the correct tables

## Next Steps

1. Migrate existing static content to database tables
2. Implement full CRUD forms for content management
3. Add image upload functionality for partner org logos
4. Add bulk operations (bulk approve/delete)
5. Implement admin activity logging
6. Add export functionality for statistics

