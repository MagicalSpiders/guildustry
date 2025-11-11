# Supabase Setup Guide for Guildustry

This guide will help you set up Supabase for the Guildustry candidate authentication and profile management system.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- The Guildustry project cloned locally

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Guildustry (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize (takes ~2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the ⚙️ **Settings** icon in the sidebar
2. Click on **API** in the settings menu
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace `your-project-url-here` and `your-anon-key-here` with the values from Step 2.

**Important**: Never commit `.env.local` to git. It should already be in your `.gitignore`.

## Step 4: Create the Database Tables

1. In your Supabase dashboard, go to **SQL Editor** (database icon in sidebar)
2. Click "New query"
3. Paste and run the following SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  fullname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  state TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  city TEXT NOT NULL,
  primary_trade TEXT NOT NULL,
  shift_preference TEXT NOT NULL CHECK (shift_preference IN ('day', 'night', 'any')),
  years_of_experience INTEGER NOT NULL CHECK (years_of_experience >= 0 AND years_of_experience <= 60),
  has_valid_licence BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  resume_file_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('candidate', 'employer')),
  company_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX idx_profiles_email ON profiles(email);

-- Create an index on role for filtering
CREATE INDEX idx_profiles_role ON profiles(role);

-- Create a trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id AND auth.uid() = created_by);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" 
  ON profiles FOR DELETE 
  USING (auth.uid() = id);

-- Optional: Employers can view candidate profiles
CREATE POLICY "Employers can view candidate profiles" 
  ON profiles FOR SELECT 
  USING (
    role = 'candidate' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'employer'
    )
  );
```

4. Click "Run" to execute the query

## Step 5: Create Storage Bucket for Resumes

1. In your Supabase dashboard, go to **Storage** (folder icon in sidebar)
2. Click "Create a new bucket"
3. Fill in the bucket details:
   - **Name**: `resume`
   - **Public bucket**: Toggle ON (so resumes can be accessed via URL)
4. Click "Create bucket"

### Set up Storage Policies

1. Click on the `resume` bucket you just created
2. Click on "Policies" tab
3. Click "New Policy"
4. Create the following policies:

**Policy 1: Users can upload their own resume**
- Policy name: `Users can upload own resume`
- Target roles: `Authenticated`
- Policy command: `INSERT`
- Policy definition:
```sql
(bucket_id = 'resume' AND auth.uid()::text = (storage.foldername(name))[1])
```

**Policy 2: Users can update their own resume**
- Policy name: `Users can update own resume`
- Target roles: `Authenticated`
- Policy command: `UPDATE`
- Policy definition:
```sql
(bucket_id = 'resume' AND auth.uid()::text = (storage.foldername(name))[1])
```

**Policy 3: Users can delete their own resume**
- Policy name: `Users can delete own resume`
- Target roles: `Authenticated`
- Policy command: `DELETE`
- Policy definition:
```sql
(bucket_id = 'resume' AND auth.uid()::text = (storage.foldername(name))[1])
```

**Policy 4: Anyone can view resumes**
- Policy name: `Public resume access`
- Target roles: `Authenticated`
- Policy command: `SELECT`
- Policy definition:
```sql
bucket_id = 'resume'
```

## Step 6: Configure Authentication Settings

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Under "Email Auth", configure:
   - ✅ **Enable Email Signup**
   - ✅ **Enable Email Confirmations** (optional - recommended for production)
   - **Minimum Password Length**: 8 characters

3. Under "Auth Providers", ensure **Email** is enabled

## Step 7: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000/auth/sign-up`
3. Create a test account
4. Try creating a profile
5. Verify the data appears in your Supabase dashboard under **Table Editor** → **profiles**

## Step 8: Production Deployment

When deploying to production:

1. Add your environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Update your Supabase project settings:
   - Go to **Authentication** → **URL Configuration**
   - Add your production URLs to "Site URL" and "Redirect URLs"
3. Enable email confirmations for new signups (recommended)
4. Consider enabling additional authentication methods (Google, GitHub, etc.)

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure you're using the `anon` public key, not the service_role key
- Restart your development server after changing environment variables

### "Row Level Security policy violation" error
- Verify that RLS policies were created correctly
- Check that the user is authenticated
- Verify the user ID matches the profile ID

### Resume upload fails
- Check that the `resume` bucket exists
- Verify storage policies are set up correctly
- Ensure the bucket is public

### Email confirmation not working
- Check your email provider settings in Supabase
- For development, you can disable email confirmation in Auth settings

## Next Steps

✅ Your Supabase backend is now fully configured!

You can now:
- Sign up users
- Create and manage profiles
- Upload resumes
- View profile data in the dashboard

For more information, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [PROFILE_FUNCTIONS_README.md](./PROFILE_FUNCTIONS_README.md) for API usage
- [CANDIDATE_FLOW_README.md](./CANDIDATE_FLOW_README.md) for system architecture

## Database Schema Reference

```typescript
profiles {
  id: UUID (Primary Key, Foreign Key to auth.users)
  fullname: TEXT
  email: TEXT (Unique)
  state: TEXT
  phone_number: TEXT
  city: TEXT
  primary_trade: TEXT
  shift_preference: TEXT ('day' | 'night' | 'any')
  years_of_experience: INTEGER (0-60)
  has_valid_licence: BOOLEAN
  priority: INTEGER (1-5)
  resume_file_url: TEXT (nullable)
  created_by: UUID (Foreign Key to auth.users)
  role: TEXT ('candidate' | 'employer')
  company_id: UUID (nullable)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

