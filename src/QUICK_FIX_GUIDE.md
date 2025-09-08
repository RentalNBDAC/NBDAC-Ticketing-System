# 🚑 Quick Fix Guide - Admin & Database Issues

## Issues Being Fixed

1. **⚠️ No admin emails found, skipping notification**
2. **❌ Database insert failed, falling back to KV store: Could not find table 'public.submissions'**

## 🚀 Quick Fix (Browser Console Method)

### Step 1: Open Browser Console
- Press `F12` or right-click → "Inspect Element"
- Go to **Console** tab

### Step 2: Run Quick Setup
Copy and paste this command (replace with your details):

```javascript
// Quick setup - replace with your admin details
await window.setupNBDAC(
  'admin@nbdac.gov.my',     // Your admin email
  'YourSecurePassword123',   // Your admin password  
  'Administrator'            // Your admin name (optional)
);
```

This will:
- ✅ Create your first admin user
- ✅ Check system health
- ✅ Enable email notifications
- ⚠️ Alert you if database table needs manual setup

## 🛠️ Manual Fix (Step by Step)

### Part 1: Fix Database Table Issue

#### Option A: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in sidebar
   - Click "New Query"

3. **Run This SQL**
   ```sql
   -- Create submissions table
   CREATE TABLE IF NOT EXISTS public.submissions (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
       
       -- Form fields
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

   -- Create policies
   CREATE POLICY "Service role can manage submissions" ON public.submissions
       FOR ALL USING (auth.role() = 'service_role');

   CREATE POLICY "Authenticated users can read submissions" ON public.submissions
       FOR SELECT USING (auth.role() = 'authenticated');
   ```

4. **Click "Run"**

#### Option B: Skip Database (Use KV Store Only)

If you can't create the database table, the system will work fine with KV store only. No action needed.

### Part 2: Fix Admin Email Issue

#### Method 1: Browser Console (Easiest)

```javascript
// Create admin user
await fetch(window.location.origin + '/functions/v1/make-server-764b8bb4/create-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@nbdac.gov.my',        // Replace with your email
    password: 'YourSecurePassword123',   // Replace with secure password
    name: 'System Administrator',        // Replace with your name
    setupKey: 'nbdac-admin-setup-2025'  // Default setup key
  })
}).then(r => r.json()).then(console.log);
```

#### Method 2: Using Admin Setup Page

1. **Navigate to Admin Setup**
   - Go to: `your-site.com/admin-setup` (if available)
   - Or click "Admin Setup" in your app

2. **Fill in Details**
   - Email: Your admin email
   - Password: Secure password (8+ characters)
   - Name: Your display name
   - Setup Key: `nbdac-admin-setup-2025`

3. **Submit Form**

## 🔍 Verify Fixes

### Check System Health
```javascript
// Check if everything is working
await fetch(window.location.origin + '/functions/v1/make-server-764b8bb4/health')
  .then(r => r.json())
  .then(console.log);
```

You should see:
- ✅ `database.submissions_table_exists: true` (or KV store working)
- ✅ `admin.admin_users_found: 1` (or more)
- ✅ `admin.email_notifications: "Enabled"`

### Test Form Submission
1. Go to Guest Portal → Permohonan Baru
2. Fill out the form
3. Submit
4. Check that:
   - Submission succeeds
   - No database errors in console
   - Admin receives email notification (check logs)

## 🎯 Expected Results

After fixing both issues:

### ✅ Database Working
- New submissions save to database table
- KV store acts as backup
- No more "table not found" errors

### ✅ Admin Notifications Working  
- Admin users exist in system
- Email notifications send on new submissions
- No more "no admin emails found" warnings

### ✅ System Fully Operational
- Form submissions work properly
- Data persists correctly
- Notifications reach administrators
- Status updates work in Internal Portal

## 🆘 Troubleshooting

### Still Getting Database Errors?
- Verify you have correct permissions in Supabase
- Check that SQL executed successfully
- System will continue working with KV store if needed

### Admin Creation Fails?
- Verify setup key is correct: `nbdac-admin-setup-2025`
- Check email format is valid
- Ensure password is 8+ characters
- Try a different email if current one exists

### Need Help?
1. Check browser console for detailed error messages
2. Run health check to see current system status
3. Verify environment variables are set correctly
4. Contact system administrator if issues persist

## 📝 Notes

- **Database**: Optional but recommended for better performance
- **KV Store**: Always works as reliable fallback
- **Admin Users**: Required for email notifications
- **Setup Key**: Can be customized via environment variables

The system is designed to be resilient - it will work even if database setup fails, using KV store as the primary storage method.