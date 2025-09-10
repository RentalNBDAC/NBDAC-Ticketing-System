# 📧 EMAIL NOTIFICATIONS SYSTEM - How It Works

## 🎯 System Overview

Your NBDAC system has a **two-tier email system**:

1. **Authentication Emails** (Supabase Auth) - For login/signup
2. **Notification Emails** (Custom Service) - For admin alerts

## 🔄 How Email Notifications Work

### Step 1: Admin Users in Supabase Auth
```javascript
// Admins are created via setupAdmin() and stored in Supabase Auth
setupAdmin("admin@nbdac.gov.my", "password", "Admin Name")

// This creates a user with:
{
  email: "admin@nbdac.gov.my",
  user_metadata: { 
    name: "Admin Name",
    role: "admin"  // Important: This marks them as notification recipients
  }
}
```

### Step 2: Getting Admin Emails for Notifications
```javascript
// Your server automatically finds admin emails like this:
const getAdminEmails = async () => {
  const { data } = await supabase.auth.admin.listUsers();
  
  // Filter for users with admin role
  const adminUsers = data.users.filter(user => 
    user.user_metadata?.role === 'admin'
  );
  
  // Extract emails
  return adminUsers.map(user => user.email);
}
```

### Step 3: Sending Notifications When New Submissions Arrive
```javascript
// When someone submits a project request:
app.post('/submissions', async (c) => {
  // 1. Save the submission
  const submission = await saveSubmission(requestData);
  
  // 2. Get all admin emails from Supabase Auth
  const adminEmails = await getAdminEmails();
  
  // 3. Send notification to all admins
  await sendAdminNotification(submission, adminEmails);
});
```

## 🏗️ Current Email Service Architecture

### Primary: Supabase Email Service
```javascript
const sendSupabaseEmail = async (to, subject, htmlContent) => {
  // Uses Supabase's built-in email service
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(to, {
    redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify`,
    data: { subject, type: 'admin_notification' }
  });
}
```

### Fallback: Organization Email API
```javascript
const sendOrganizationEmail = async (to, subject, htmlContent) => {
  // If you configure ORG_EMAIL_API_URL, it uses your organization's email service
  const response = await fetch(orgEmailApi, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${orgEmailKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: [to],
      subject: subject,
      html: htmlContent,
      from: 'notifications@nbdac.gov.my'
    })
  });
}
```

## 📩 Email Notification Content

When a new project submission is received, admins get an email like this:

```html
Subject: Permohonan Projek Baru - [Project Name]

📋 Permohonan Projek Baru

Maklumat Permohonan:
• Nama Projek: [Project Name]
• Bahagian: [Department]
• Nama Pegawai: [Officer Name]
• Email: [Email]
• Tarikh: [Date]
• Status: ⏱️ Menunggu

Tindakan Diperlukan:
Sila log masuk ke sistem untuk menyemak dan menguruskan permohonan ini.

Sistem Permohonan Projek Web Scraping NBDAC
Mesej automatik - tidak perlu balas
```

## 🔧 Current Configuration Options

### Option 1: Supabase Email (Current Default)
- **Pros**: No additional setup needed, works out of the box
- **Cons**: Limited customization, uses Supabase branding
- **Status**: ✅ Working now

### Option 2: Organization Email API
- **Setup**: Add environment variables:
  ```
  ORG_EMAIL_API_URL=https://your-org-email-service.com/send
  ORG_EMAIL_API_KEY=your-api-key
  ```
- **Pros**: Full branding control, professional appearance
- **Cons**: Requires email service setup
- **Status**: 🟡 Available if configured

## 🚀 How to Test Email Notifications

### 1. Create Admin Users
```javascript
// In browser console:
setupAdmin("admin1@nbdac.gov.my", "password123", "Admin One")
setupAdmin("admin2@nbdac.gov.my", "password123", "Admin Two")
```

### 2. Check Admin Email Status
```javascript
// In browser console:
listAdminEmails()
// This shows all admin users who will receive notifications
```

### 3. Test Email Notifications
```javascript
// In browser console:
testAdminEmails()
// This sends a test notification to all admin users
```

### 4. Submit a Real Request
- Go to Guest Portal > Permohonan Baru
- Fill out the form
- Submit
- Check admin email inboxes

## 📊 Email Service Status Indicators

### ✅ Working Correctly
```
📧 Email notifications sent: 2/2 successful
✅ Admin users: 2 user(s)
✅ Email Notifications: Enabled
```

### ⚠️ Issues Detected
```
⚠️ No admin emails found, skipping notification
❌ Admin Users: 0 user(s)
❌ Email Notifications: Disabled
```

## 🔍 Troubleshooting Email Notifications

### Issue: No emails being sent
**Solution:**
```javascript
// Check if admin users exist
listAdminEmails()

// If no admins, create them
setupAdmin("admin@nbdac.gov.my", "password", "Admin")
```

### Issue: Emails not reaching inbox
**Solutions:**
1. **Check spam folder** - Supabase emails might go to spam
2. **Verify admin email addresses** - Ensure they're correct
3. **Use organization email service** - Set up ORG_EMAIL_API_URL

### Issue: Admin users exist but no emails
**Check server logs:**
```javascript
// Submit a test request and check browser console for:
// "📧 Email notifications sent: X/Y successful"
```

## 🎛️ Advanced Email Configuration

### Custom Email Templates
Edit the email template in `/supabase/functions/server/index.tsx`:
```javascript
const htmlContent = `
  <!-- Your custom HTML email template -->
  <div style="font-family: Arial, sans-serif;">
    <!-- Email content -->
  </div>
`;
```

### Multiple Email Services
Your system automatically tries:
1. Organization email (if configured)
2. Supabase email (fallback)
3. Console logging (development fallback)

### Email Rate Limiting
Supabase has built-in rate limiting. For high volume:
- Use organization email API
- Implement batching for multiple admins

## 💡 Best Practices

### For Production Use:
1. **Use organization email service** for professional appearance
2. **Set up proper SPF/DKIM records** to avoid spam
3. **Monitor email delivery rates**
4. **Have backup admins** in case primary is unavailable

### For Development:
1. **Use console logging** for testing
2. **Check browser console** for email status
3. **Use test email addresses**

## 🔗 Integration with Authentication

The email notification system **depends on** your Supabase Auth system:

```
Supabase Auth Users (with role: 'admin')
    ↓
Auto-discovered by getAdminEmails()
    ↓
Used for notification recipients
    ↓
Emails sent when submissions received
```

This is why `setupAdmin()` is crucial - it creates the admin users that will receive notifications!