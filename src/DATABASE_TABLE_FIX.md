# 🗄️ DATABASE TABLE FIX - Quick Solution

## ❌ Current Error
```
Database insert failed, falling back to KV store: {
  code: "PGRST205",
  details: null,
  hint: null,
  message: "Could not find the table 'public.submissions' in the schema cache"
}
```

## ✅ Quick Fix (2 Minutes)

### Step 1: Go to Supabase SQL Editor
1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your NBDAC project
3. Click on "SQL Editor" in the left sidebar
4. Click "New query"

### Step 2: Run This SQL Command
Copy and paste this **exact SQL** into the editor and click "Run":

```sql
-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Basic info
  bahagian text,
  nama_projek text NOT NULL,
  email text NOT NULL,
  nama_pegawai text NOT NULL,
  tarikh date,
  
  -- Project details
  tujuan text,
  laman_web text,
  kekerapan_pengumpulan text,
  nota text,
  
  -- Status
  status text DEFAULT 'Menunggu'
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (allows server to read/write)
CREATE POLICY "Service role can do everything" ON public.submissions
FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users (optional - for future use)
CREATE POLICY "Users can view their own submissions" ON public.submissions
FOR SELECT USING (auth.email() = email);
```

### Step 3: Verify Table Creation
After running the SQL, you should see:
```
Success. No rows returned
```

### Step 4: Test the Fix
1. Go back to your NBDAC app
2. Submit a test project request through the Guest Portal
3. The error should be gone and data should save to the database

## 🎯 What This Fixes

- ✅ **Database Error**: Creates the missing `submissions` table
- ✅ **Data Storage**: Submissions will now save to the database instead of fallback KV store
- ✅ **Performance**: Database queries are faster than KV store
- ✅ **Reliability**: Proper relational database with ACID properties

## 🔍 Verification Commands

After creating the table, you can verify it works by running these in SQL Editor:

```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'submissions';

-- Check table structure
\d public.submissions;

-- View any existing data
SELECT * FROM public.submissions LIMIT 10;
```

## 💡 Alternative: Create via Browser Console

If you prefer to use the browser console, run:

```javascript
emergencySetup()
```

This will:
1. Create admin users (fixes email notification issue)
2. Provide the SQL commands to create the database table
3. Set up the complete system

## 🚨 Important Notes

1. **Run the SQL exactly as provided** - don't modify field names
2. **The table will be empty initially** - that's normal
3. **Existing KV store data will remain** - but new submissions will use the database
4. **This is a one-time fix** - you won't need to do this again

After this fix, your error logs should show:
```
✅ Submission saved to database
```

Instead of:
```
❌ Database insert failed, falling back to KV store
```