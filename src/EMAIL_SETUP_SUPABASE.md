# 📧 Supabase Email Notification Setup Guide

This guide will help you set up email notifications using Supabase's built-in email functionality instead of external services like Resend. This approach uses your organization's existing email infrastructure and Supabase's auth system.

## 🏢 Option 1: Using Supabase Built-in Email (Recommended)

### ✅ **Advantages:**
- **No additional cost** - included with Supabase
- **No external API keys needed** 
- **Integrated with your auth system**
- **Uses your organization's email domain**
- **Simpler setup and maintenance**

### ⚠️ **Limitations:**
- **Limited customization** compared to dedicated email services
- **Basic templates only**
- **Suitable for simple admin notifications**

---

## 🚀 Step 1: Configure Supabase Email Settings

### 1.1 Access Email Settings
1. **Log in** to your Supabase project dashboard
2. Go to **"Authentication"** in the sidebar
3. Click **"Settings"** tab
4. Scroll to **"SMTP Settings"** section

### 1.2 Option A: Use Supabase Default Email (Quickest)
For development and testing:
- **Leave SMTP settings blank** to use Supabase's default email service
- **Emails will come from**: `noreply@supabase.io`
- **Good for**: Testing and small-scale deployments

### 1.3 Option B: Use Your Organization's Email (Professional)
For production with your organization's domain:

**Required Information from Your IT Department:**
```
SMTP Host: mail.yourorganization.gov.my (example)
SMTP Port: 587 (or 25, 465)
SMTP Username: notifications@yourorganization.gov.my
SMTP Password: [your email password]
Sender Name: NBDAC Project System
Sender Email: notifications@yourorganization.gov.my
```

**Configuration Steps:**
1. **SMTP Host**: Enter your organization's mail server
2. **SMTP Port**: Usually 587 for TLS or 25 for standard
3. **SMTP Username**: Email account for sending notifications
4. **SMTP Password**: Password for the email account
5. **Sender Name**: `Sistem Permohonan Projek NBDAC`
6. **Sender Email**: Your organization's notification email
7. Click **"Save"**

---

## ✅ Step 2: Server Configuration (Already Updated)

### 2.1 Email Service Selection
The server now automatically uses the best available option:

1. **Organization Email API** (if `ORG_EMAIL_API_URL` is set)
2. **Supabase Email** (built-in fallback)
3. **Console Logging** (development fallback)

### 2.2 Environment Variables (Optional)
For your organization's email API:
```bash
# Only needed if you have an organization email API
ORG_EMAIL_API_URL=https://your-org-email-api.gov.my/send
ORG_EMAIL_API_KEY=your-organization-api-key
```

If these are not set, the system uses Supabase email automatically.

---

## 🧪 Step 3: Test Email Configuration

### 3.1 Test Supabase Email Settings
1. **Go to** Supabase Dashboard > **Authentication** > **Users**
2. **Click** "Invite User"
3. **Enter** a test email address
4. **Send** the invitation
5. **Check** if the email is received correctly

### 3.2 Test with Project Submission
1. **Create** a test submission in the Guest Portal:
   ```
   Tarikh: [Today's date]
   Bahagian: IT Department
   Nama Projek: Test Email Notification
   Tujuan Projek: Testing the email notification system
   Laman Web: 1. Test: https://www.example.com
   Kekerapan Kutipan Data: one-off
   Nama Pengawai: [Your name]
   Email: [Your email]
   ```
2. **Submit** the application
3. **Check** admin email inbox (or server logs for fallback)

### 3.3 Check Server Logs
1. In Supabase dashboard: **"Edge Functions" > "server" > "Logs"**
2. Look for messages like:
   ```
   📧 Attempting to send email via Supabase to: admin@example.com
   ✅ Email sent via Supabase
   📧 EMAIL NOTIFICATION (Fallback): { to: 'admin@example.com', subject: '...' }
   ```

---

## 🔧 Step 4: For Organizations With Email APIs

### 4.1 If Your Organization Has an Email API
Some government organizations provide internal email APIs. If available:

1. **Get API details** from your IT department:
   - API endpoint URL
   - Authentication method (usually Bearer token)
   - Required headers and payload format

2. **Set environment variables** in Supabase:
   ```bash
   ORG_EMAIL_API_URL=https://email-api.yourorg.gov.my/send
   ORG_EMAIL_API_KEY=your-api-key-here
   ```

3. **Test the configuration** by submitting a test application

### 4.2 Common Government Email APIs
Different organizations may have:
- **Microsoft Exchange APIs**
- **Custom internal email services**
- **Secure email gateways**

Contact your IT department for specific details.

---

## 📊 Step 5: Monitoring and Verification

### 5.1 Email Delivery Check
- **Admin notifications** should arrive within 1-2 minutes
- **Check spam/junk folders** initially
- **Verify sender address** matches your configuration

### 5.2 Server Logs Monitoring
Monitor these log messages:
```
✅ Email sent via Supabase: [success]
📧 Email notifications sent: 2/2 successful
⚠️ No organization email API configured, using Supabase fallback
```

### 5.3 Fallback Behavior
The system is designed to be resilient:
- **Primary**: Organization email API (if configured)
- **Secondary**: Supabase email service
- **Tertiary**: Console logging (for development)
- **System continues**: Even if all email fails, submissions still work

---

## 🎯 **Quick Setup Summary:**

### **For Basic Setup (5 minutes):**
1. ✅ **Use Supabase default email** (no configuration needed)
2. ✅ **Test with sample submission**
3. ✅ **Check server logs** for email delivery

### **For Professional Setup (15 minutes):**
1. 🔧 **Configure SMTP** in Supabase with organization email
2. 🧪 **Test email sending** via Supabase dashboard
3. 📝 **Submit test application** and verify admin notification
4. 📊 **Monitor server logs** for delivery confirmation

### **For Organization Integration (30 minutes):**
1. 📞 **Contact IT department** for email API details
2. 🔑 **Set environment variables** for organization API
3. 🧪 **Test both API and Supabase fallback**
4. 🔍 **Verify monitoring and logging**

---

## 🛠️ **Troubleshooting**

### ❌ **No Email Received?**

**Check 1: Supabase Configuration**
- Verify SMTP settings in Supabase dashboard
- Test with "Invite User" feature
- Check spam/junk folders

**Check 2: Server Logs**
Look for these in Supabase Edge Function logs:
```
📧 Attempting to send email via Supabase to: admin@example.com
✅ Email sent via Supabase
📧 Found 2 admin emails for notification
```

**Check 3: Admin Users**
- Ensure admin users exist with `role: 'admin'` 
- Verify admin email addresses are valid
- Check user metadata in Supabase Auth dashboard

### 🔧 **Common Solutions**

**Solution 1: Reset Email Configuration**
1. Clear SMTP settings in Supabase
2. Save (to use default Supabase email)
3. Test with invite user feature

**Solution 2: Verify Admin Setup**
```bash
# Check admin users via API
curl -X GET "https://your-project.supabase.co/functions/v1/make-server-764b8bb4/list-admins" \
  -H "Authorization: Bearer your-anon-key"
```

**Solution 3: Check Environment Variables**
- Remove any old `RESEND_API_KEY` variables
- Add `ORG_EMAIL_API_URL` only if you have organization API
- Re-deploy edge functions if changes made

---

## 🎉 **Success Indicators**

You'll know the setup is working when:

- ✅ **Supabase email test**: "Invite User" emails are delivered
- ✅ **Server logs**: Show successful email delivery messages
- ✅ **Admin notifications**: Arrive within 1-2 minutes of submission
- ✅ **System resilience**: Works even if email temporarily fails

---

## 💡 **Pro Tips**

- **Email filtering**: Set up rules to organize NBDAC notifications
- **Multiple admin users**: System automatically notifies all admins
- **Fallback logging**: Check server logs if emails don't arrive
- **Organization integration**: Coordinate with IT for best email setup

---

## 🆘 **Support**

If you encounter issues:

1. **Check Supabase email**: Test with "Invite User" first
2. **Review server logs**: Look for detailed error messages
3. **Verify admin users**: Ensure they have correct metadata
4. **Contact IT**: For organization-specific email configuration

**Remember**: The system works regardless of email configuration - notifications enhance the experience but don't break core functionality! 🚀

---

## 🔄 **Migration from Resend**

If you were previously using Resend:

1. ✅ **Remove** `RESEND_API_KEY` environment variable
2. ✅ **Server updated** to use Supabase email automatically  
3. ✅ **Test new setup** with sample submission
4. ✅ **No code changes needed** - seamless transition

Your NBDAC system now uses Supabase's built-in email service with your organization's email infrastructure! 🎊