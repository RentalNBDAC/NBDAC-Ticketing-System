# NBDAC System Issues Fix Guide

## 🚨 Current Issues Detected

The following critical issues have been identified:

1. **❌ No admin emails found, skipping notification**
2. **❌ No admin emails found!**  
3. **❌ Database insert failed - Could not find table 'public.submissions'**

## 🔧 IMMEDIATE FIX (Recommended)

### Option 1: Emergency Auto-Fix (Fastest)

Open browser console (F12) and run:

```javascript
emergencySetup()
```

This will automatically:
- ✅ Create a default admin user (`admin@nbdac.gov.my`)
- ✅ Set up email notifications  
- ✅ Test the system end-to-end
- ✅ Provide status report

**Default credentials created:**
- Email: `admin@nbdac.gov.my`
- Password: `NBDACAdmin123!`
- Name: `NBDAC Administrator`

### Option 2: Custom Admin User

Create admin with your own email:

```javascript
fixNBDACSystem("your.email@nbdac.gov.my", "YourPassword123", "Your Name")
```

## 📋 Manual Fix Steps

If the auto-fix doesn't work, follow these manual steps:

### Step 1: Create Admin User

```javascript
setupAdmin("admin@nbdac.gov.my", "NBDACAdmin123!", "Admin Name")
```

### Step 2: Verify Admin Creation

```javascript
listAdminEmails()
```

### Step 3: Test Email Notifications

```javascript
testAdminEmails()
```

## 🗄️ Database Table Setup

The "Could not find table 'public.submissions'" error means the database table is missing. The system automatically falls back to KV store, but for production use, you should create the table:

### Option 1: Automatic (if you have SQL execution permissions)
The system will attempt to create tables automatically.

### Option 2: Manual Database Setup

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run this SQL:

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

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role can manage submissions" ON public.submissions
    FOR ALL USING (auth.role() = 'service_role');
```

## 🔍 System Diagnostics

### Check Current Status

```javascript
// Overall system health
fetch('https://your-project.supabase.co/functions/v1/make-server-764b8bb4/health')
  .then(r => r.json())
  .then(console.log)

// List admin users
listAdminEmails()

// Test notifications
testAdminEmails()
```

### Available Console Commands

```javascript
// EMERGENCY FIXES
emergencySetup()                                    // Fix everything with defaults
fixNBDACSystem("email", "password", "name")         // Fix with custom admin

// DIAGNOSTICS
listAdminEmails()                                   // Show admin users
testAdminEmails()                                   // Test email system
setupNBDAC("email", "password", "name")            // Legacy setup

// VERIFICATION
runComprehensiveSetup({
  adminEmail: "admin@nbdac.gov.my",
  adminPassword: "password123",
  adminName: "Admin Name"
})
```

## ✅ Verification Steps

After running the fix, verify everything works:

1. **Check Admin Users:**
   ```javascript
   listAdminEmails()
   ```
   Should show at least 1 admin user.

2. **Test Email Notifications:**
   ```javascript
   testAdminEmails()
   ```
   Should send test email to admin.

3. **Submit Test Request:**
   - Go to Guest Portal
   - Submit a test project request
   - Admin should receive email notification

4. **Check System Health:**
   ```javascript
   fetch('https://your-project.supabase.co/functions/v1/make-server-764b8bb4/health')
     .then(r => r.json())
     .then(data => {
       console.log('Database Ready:', data.database?.submissions_table_exists);
       console.log('Admin Users:', data.admin?.admin_users_found);
       console.log('Email Service:', data.email_service);
     })
   ```

## 🔧 Troubleshooting

### Issue: "emergencySetup is not defined"
**Solution:** Refresh the page and wait 2-3 seconds for scripts to load, then try again.

### Issue: Admin user creation fails
**Solutions:**
1. Check Supabase project is active
2. Verify environment variables are set
3. Check browser console for detailed errors
4. Try with a different email address

### Issue: Database table still missing
**Solutions:**
1. Run manual SQL in Supabase Dashboard (see above)
2. Check RLS policies are correctly set
3. Verify service role permissions

### Issue: Email notifications not working
**Solutions:**
1. Check admin user email is verified
2. Look for email in spam folder
3. Verify Supabase email service is configured
4. Check server logs for email send status

## 📞 Support

If issues persist:

1. **Check Server Logs:** Look at Supabase Functions logs
2. **Network Issues:** Verify internet connection and Supabase status
3. **Configuration:** Ensure all environment variables are set
4. **Manual Setup:** Follow DATABASE_SETUP.md for manual configuration

## 🎯 Expected Results

After successful fix:
- ✅ Admin users visible in system
- ✅ Email notifications working
- ✅ Database table created (or KV store working)
- ✅ New submissions trigger admin emails
- ✅ System ready for production use

The system will work with KV store as fallback even if database table creation fails, so email notifications are the critical component to fix.