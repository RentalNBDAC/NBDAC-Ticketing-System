# 📧 EMAIL NOTIFICATIONS - Quick Reference

## 🚀 Essential Commands (Browser Console)

### Setup Admin Users (Required First Step)
```javascript
// Create admin who will receive email notifications
setupAdmin("admin@nbdac.gov.my", "password123", "Admin Name")

// Create multiple admins
setupAdmin("admin1@nbdac.gov.my", "pass1", "Admin One")
setupAdmin("admin2@nbdac.gov.my", "pass2", "Admin Two")
```

### Check Email System Status
```javascript
// See all admin users who will receive notifications
listAdminEmails()

// Test email notifications system
testAdminEmails()

// Full system health check
emergencySetup()
```

## 📊 Status Indicators

### ✅ Email System Working
```
✅ Admin users: 2 user(s)
✅ Email Notifications: Enabled
📧 Email notifications sent: 2/2 successful
```

### ❌ Email System Issues
```
❌ Admin Users: 0 user(s)
❌ Email Notifications: Disabled
⚠️ No admin emails found, skipping notification
```

## 🔄 Email Flow Diagram

```
New Submission → Server Receives → Get Admin Emails → Send Notifications
     ↓               ↓                    ↓                ↓
Guest Portal → /submissions API → Supabase Auth → Email Service
```

## 🛠️ Email Services Used

| Service | When Used | Setup Required |
|---------|-----------|----------------|
| **Supabase Email** | Default | ✅ None (automatic) |
| **Organization Email** | If configured | Set ORG_EMAIL_API_URL |
| **Console Logging** | Development fallback | ✅ None |

## 🎯 Key Points

1. **Admin users** in Supabase Auth = **Email recipients**
2. **No admin users** = **No email notifications**
3. **setupAdmin()** creates both login access AND email recipients
4. **Email notifications** are separate from **login authentication**
5. **System automatically finds** admin emails from Supabase Auth

## 🚨 Quick Fix for "No Admin Emails Found"

```javascript
// Option 1: Create specific admin
setupAdmin("your-email@domain.com", "your-password", "Your Name")

// Option 2: Emergency setup with defaults
emergencySetup()

// Option 3: Full system fix
fixNBDACSystem("admin@nbdac.gov.my", "secure-password", "NBDAC Admin")
```

## 📧 Email Content Preview

**Subject:** Permohonan Projek Baru - [Project Name]

**Body:** Professional HTML email with:
- Project details table
- Status indicator (Menunggu)
- Action required section
- NBDAC branding

## 🔗 Dependencies

Email notifications require:
- ✅ Supabase project active
- ✅ Server running (/make-server-764b8bb4)
- ✅ Admin users created via setupAdmin()
- ✅ Supabase Auth configured

## 💡 Remember

Your authentication system (login) and notification system (emails) are integrated but serve different purposes:

- **Authentication**: Who can log into admin portal
- **Notifications**: Who gets alerted about new submissions

Both use the same admin users from Supabase Auth! 🎯