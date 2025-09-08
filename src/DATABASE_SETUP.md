# Database Setup Guide

## Issue: Missing Submissions Table

The system is trying to insert submissions into a database table that doesn't exist, causing it to fall back to KV store only.

## Quick Fix: Create the Submissions Table

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run this SQL to create the table:**

```sql
-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Form fields (using consistent naming)
    tarikh TEXT,
    bahagian TEXT,
    nama_projek TEXT,
    tujuan TEXT,
    laman_web TEXT,
    kekerapan_pengumpulan TEXT,
    nama_pegawai TEXT,
    email TEXT,
    nota TEXT,
    
    -- Status field
    status TEXT DEFAULT 'Menunggu'
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_submissions_updated_at 
    BEFORE UPDATE ON public.submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role can manage submissions" ON public.submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to read
CREATE POLICY "Authenticated users can read submissions" ON public.submissions
    FOR SELECT USING (auth.role() = 'authenticated');
```

4. **Click "Run" to execute the SQL**

### Option 2: Alternative - Disable Database Fallback

If you prefer to use only KV store, you can modify the server to skip database attempts.

## Admin User Setup

### Create Your First Admin User

1. **Open Browser Console** (F12 → Console tab)

2. **Run this command** (replace with your details):

```javascript
// Create admin user
await fetch(`https://${window.location.hostname.includes('localhost') ? 'your-project-id.supabase.co' : window.location.hostname.replace(/.*?\./, 'your-project-id.supabase.co')}/functions/v1/make-server-764b8bb4/create-admin`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'}`
  },
  body: JSON.stringify({
    email: 'admin@nbdac.gov.my',
    password: 'your-secure-password',
    name: 'Administrator',
    setupKey: 'nbdac-admin-setup-2025'  // Default setup key
  })
}).then(r => r.json()).then(console.log);
```

3. **Replace these values:**
   - `admin@nbdac.gov.my` → Your admin email
   - `your-secure-password` → A secure password
   - `your-project-id` → Your actual Supabase project ID
   - `your-anon-key` → Your Supabase anon key (if needed)

### Verify Admin Creation

```javascript
// List all admin users
await fetch(`https://your-project-id.supabase.co/functions/v1/make-server-764b8bb4/list-admins`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer your-anon-key`
  }
}).then(r => r.json()).then(console.log);
```

## Environment Variables Check

Make sure these are set in your Supabase project:

1. **Go to Project Settings → Environment Variables**

2. **Verify these exist:**
   - `SUPABASE_URL` - Your project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)
   - `SUPABASE_ANON_KEY` - Anon/public key
   - `ADMIN_SETUP_KEY` - Custom setup key (optional)

## Troubleshooting

### If database creation fails:
- Check if you have sufficient permissions
- Ensure you're using the correct project
- Try using the service role key instead of anon key

### If admin creation fails:
- Verify the setup key matches
- Check that email format is valid
- Ensure the server endpoint is accessible

### If emails still not working:
- Confirm admin users have `role: 'admin'` in user_metadata
- Check server logs for email sending attempts
- Verify Supabase auth is properly configured

## Next Steps

After running the database setup:
1. Create at least one admin user
2. Test form submission
3. Verify email notifications work
4. Check that data appears in both database and admin panel

The system will now use the database table as primary storage with KV store as backup.