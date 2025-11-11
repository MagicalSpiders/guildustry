# Quick Start Guide - Supabase Integration

## 🚀 Get Started in 5 Minutes

This guide will get your Guildustry app running with Supabase authentication.

## Prerequisites

- ✅ Supabase dependencies installed (`@supabase/supabase-js`)
- ✅ Code updated with all field name changes
- ⏳ Need: Supabase project and credentials

## Step 1: Create Supabase Project (2 minutes)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign in
3. Click "New Project"
4. Fill in:
   - Name: `guildustry`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
5. Click "Create new project"
6. Wait ~2 minutes for initialization

## Step 2: Get Your Credentials (30 seconds)

1. In your project, go to **Settings** (⚙️ icon) → **API**
2. Copy these two values:
   - **Project URL**
   - **anon public** key

## Step 3: Add to Your App (30 seconds)

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

## Step 4: Set Up Database (1 minute)

1. In Supabase, go to **SQL Editor** → **New query**
2. Copy and paste this SQL:

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

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own profile
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);
```

3. Click "Run"

## Step 5: Create Storage Bucket (1 minute)

1. Go to **Storage** → **Create a new bucket**
2. Name: `resume`
3. Toggle **Public bucket** ON
4. Click "Create bucket"
5. Click on the `resume` bucket → **Policies** → **New Policy**
6. Click "Get started quickly" → **Allow public access**
7. Save

## Step 6: Test It! (30 seconds)

1. Restart your dev server:
```bash
npm run dev
```

2. Go to [http://localhost:3000/auth/sign-up](http://localhost:3000/auth/sign-up)
3. Create an account
4. Go to profile page and create your profile
5. ✅ Done! Your data is now in Supabase

## Verify It Works

Check your Supabase dashboard:
- **Authentication** → Users → Should see your user
- **Table Editor** → profiles → Should see your profile
- **Storage** → resume → Should see uploaded files

## Troubleshooting

### "Invalid API key"
- Check `.env.local` has correct values
- Restart dev server: `npm run dev`

### "Row Level Security policy violation"
- Run the RLS policy SQL from Step 4
- Make sure you're logged in

### Resume upload fails
- Verify storage bucket is public
- Check bucket name is `resume`

## What's Next?

✅ Your app is now connected to Supabase!

For more details:
- Full setup guide: [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)
- Implementation details: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- API reference: [PROFILE_FUNCTIONS_README.md](./PROFILE_FUNCTIONS_README.md)

## Production Deployment

When deploying:
1. Add environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Update Supabase Auth URLs in project settings
3. Enable email confirmations
4. Set up custom email templates

---

**Need help?** Check the full [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) for detailed instructions.

