# 📧 Email Notification Setup Guide

This guide will help you activate email notifications for new project submissions in the NBDAC Project Request System.

## 🚀 Step 1: Create a Resend Account

### 1.1 Sign Up for Resend
1. Visit [resend.com](https://resend.com)
2. Click **"Sign Up"** 
3. Create your account using:
   - **Email address** (use your organization email)
   - **Strong password**
4. Verify your email address

### 1.2 Choose Your Plan
- **Free Tier**: 3,000 emails/month (perfect for getting started)
- **Pro Tier**: $20/month for 50,000 emails/month (if you need more volume)

For most organizations, the **free tier is sufficient** for admin notifications.

---

## 🔑 Step 2: Get Your API Key

### 2.1 Access API Keys
1. **Log in** to your Resend dashboard
2. Navigate to **"API Keys"** in the sidebar
3. Click **"Create API Key"**

### 2.2 Create API Key
1. **Name**: `NBDAC-Admin-Notifications` (or any descriptive name)
2. **Permission**: Select **"Sending access"**
3. **Domain**: Leave as **"All domains"** (or specify if you have a custom domain)
4. Click **"Add"**

### 2.3 Copy Your API Key
⚠️ **IMPORTANT**: Copy the API key immediately - you won't be able to see it again!

The key will look like: `re_xxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🔧 Step 3: Add API Key to Your Project

### 3.1 Using Supabase Dashboard
1. **Open** your Supabase project dashboard
2. Go to **"Project Settings"** (gear icon)
3. Click **"Edge Functions"** in the sidebar
4. Scroll to **"Environment Variables"**
5. Click **"Add new variable"**
6. Set:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_xxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx` (your actual API key)
7. Click **"Save"**

### 3.2 Alternative: Using Supabase CLI (if you prefer)
```bash
# Set environment variable
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx

# Deploy to apply changes
supabase functions deploy server
```

---

## ✅ Step 4: Test Your Setup (Quick Method)

### Option A: Browser Console Test
1. **Open** your NBDAC application in the browser
2. **Right-click** and select "Inspect" or press **F12**
3. Go to the **"Console"** tab
4. **Copy and paste** this test command (replace with your details):

```javascript
// Test email configuration
const testConfig = {
  apiKey: 're_your_api_key_here',  // Replace with your actual API key
  testEmail: 'your-email@example.com'  // Replace with your email
};

// Import and run test utility
import('./utils/email-test.js').then(async (emailTest) => {
  await emailTest.runEmailTest(testConfig.apiKey, testConfig.testEmail);
});
```

5. **Press Enter** to run the test
6. **Check your email** for the test message (should arrive within 1-2 minutes)

### Option B: Manual API Test
```bash
# Test your API key with curl
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "NBDAC Test <notifications@resend.dev>",
    "to": ["your-email@example.com"],
    "subject": "Test Email - NBDAC Setup",
    "html": "<h2>✅ Your NBDAC email setup is working!</h2><p>This confirms your Resend API is configured correctly.</p>"
  }'
```

---

## 🧪 Step 5: Test with Real Submission

### 5.1 Create Test Admin User (if needed)
1. **Log in** to your system as admin
2. Go to **"Portal Dalaman"** (Internal Portal)
3. Ensure you have at least one admin user with a valid email

### 5.2 Submit Test Application
1. **Open** the Guest Portal
2. Click **"Permohonan Baru"** (New Application)
3. Fill in all required fields:
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
4. Click **"Hantar Permohonan"** (Submit Application)

### 5.3 Verify Email Receipt
1. **Check admin email inbox** (usually arrives within 1-2 minutes)
2. **Subject line** should be: `Permohonan Projek Baru - Test Email Notification`
3. **Email content** should include all project details

### 5.4 Check Server Logs for Confirmation
1. In Supabase dashboard: **"Edge Functions" > "server" > "Logs"**
2. Look for success messages like:
   ```
   ✅ Email sent successfully: [email-id]
   📧 Email notifications sent: 1/1 successful
   ```

---

## 🔍 Troubleshooting

### ❌ No Email Received?

**Check 1: API Key Configuration**
- Verify `RESEND_API_KEY` is set in Supabase environment variables
- Ensure the key starts with `re_`
- Re-deploy Edge Functions after adding the key

**Check 2: Server Logs**
Look for these error messages in Supabase Edge Function logs:
```
⚠️ RESEND_API_KEY not found, skipping email notification
Email API error: 401 [unauthorized]
Error sending email: [error details]
```

**Check 3: Email Settings**
- Check **spam/junk folder**
- Verify admin email addresses are correct
- Ensure your organization's email doesn't block external senders

**Check 4: Resend Dashboard**
1. Go to Resend dashboard > **"Logs"**
2. Check if emails are being sent but rejected
3. Look for delivery status and bounce rates

### 🔧 Common Fixes

**Fix 1: Re-deploy Edge Functions**
```bash
# If using Supabase CLI
supabase functions deploy server
```

**Fix 2: Verify Admin Users**
- Ensure admin users have valid email addresses
- Check user metadata contains `role: 'admin'`

**Fix 3: Force Refresh Environment Variables**
1. In Supabase dashboard, go to **"Edge Functions"**
2. Click on **"server"** function
3. Click **"Deploy"** to refresh environment variables

---

## 📧 Email Template Preview

When working correctly, admins will receive emails like this:

```
Subject: Permohonan Projek Baru - [Project Name]

📋 Permohonan Projek Baru

Maklumat Permohonan:
• Nama Projek: [Project Name]
• Bahagian: [Department]
• Nama Pegawai: [Officer Name]
• Email: [Officer Email]
• Tarikh: [Date]
• Status: ⏱️ Menunggu

Tindakan Diperlukan:
Sila log masuk ke sistem untuk menyemak dan menguruskan permohonan ini.

• Semak butiran lengkap permohonan
• Tukar status kepada "Sedang Diprocess" atau "Selesai"  
• Hubungi pemohon jika diperlukan

---
Sistem Permohonan Projek Web Scraping NBDAC
Mesej automatik - tidak perlu balas
```

---

## 🎯 Summary Checklist

Before going live, ensure:

- [ ] ✅ Resend account created and verified
- [ ] 🔑 API key generated and copied
- [ ] 🔧 `RESEND_API_KEY` added to Supabase environment variables
- [ ] 🧪 Quick test email sent successfully
- [ ] 👨‍💼 Admin users have valid email addresses  
- [ ] 📝 Test submission creates and sends notification
- [ ] 📊 Server logs show successful email delivery
- [ ] 📧 Admin inbox receives formatted notification

---

## 💡 Pro Tips

- **Custom Domain**: For professional emails, consider adding your domain to Resend
- **Email Filters**: Set up rules to auto-organize NBDAC notifications
- **Multiple Admins**: The system automatically sends to all admin users
- **Monitoring**: Check Resend analytics to track email performance
- **Backup**: The system still works even if email fails - notifications won't break submissions

## 🆘 Support

If you encounter issues:

1. **Use the browser console test** first for quick validation
2. **Check Supabase Edge Function logs** for detailed error messages
3. **Verify Resend dashboard** for delivery status  
4. **Contact support** with specific error messages from logs

**Remember**: Email notifications enhance the user experience but won't break core functionality if they fail. The system is designed to be resilient! 🚀

---

## 🎉 Success Indicators

You'll know everything is working when you see:

- ✅ **Browser console test**: Shows "Email sent successfully"
- ✅ **Server logs**: Show email delivery confirmations
- ✅ **Resend dashboard**: Shows sent emails with delivery status
- ✅ **Admin inbox**: Receives formatted notification emails
- ✅ **System continues**: Works normally even if email fails

**Congratulations!** Your NBDAC Project Request System now has full email notification capabilities! 🎊