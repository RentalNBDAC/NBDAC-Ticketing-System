# Supabase Auth Email Integration for NBDAC System

## Overview

The NBDAC Project Request System now fully integrates with Supabase Authentication for admin email notifications. This means admin emails are automatically retrieved from authenticated Supabase users, eliminating the need for separate email configuration.

## How It Works

### 1. Admin User Creation
Admin users are created in Supabase Auth with the `admin` role:

```javascript
// Browser console
setupAdmin("admin@nbdac.gov.my", "password123", "Admin Name")
```

### 2. Email Retrieval
The system automatically retrieves admin emails from Supabase Auth:

```javascript
// Server function gets all users with admin role
const adminUsers = await supabase.auth.admin.listUsers()
const adminEmails = adminUsers.filter(user => user.user_metadata?.role === 'admin')
```

### 3. Notification Flow
When a new submission is created:

1. **Submission received** → Server processes the request
2. **Get admin emails** → Server queries Supabase Auth for admin users
3. **Send notifications** → Email sent to all admin email addresses
4. **Delivery** → Admins receive notification in their inbox

## Benefits

### ✅ **Centralized Management**
- All admin users managed in one place (Supabase Auth)
- No separate email configuration required
- Consistent with authentication system

### ✅ **Automatic Email Discovery**
- System automatically finds admin emails
- No hardcoded email addresses
- Dynamic admin list updates

### ✅ **Secure & Scalable**
- Leverages Supabase's robust auth system
- Easy to add/remove admin users
- Email verification status tracking

### ✅ **Production Ready**
- Uses real authentication emails
- No demo or placeholder emails
- Integrated with existing login system

## Setup Instructions

### Quick Setup (Recommended)

1. **Create admin user**:
   ```javascript
   setupAdmin("admin@nbdac.gov.my", "password123", "Admin Name")
   ```

2. **Verify email integration**:
   ```javascript
   listAdminEmails()
   ```

3. **Test notifications**:
   ```javascript
   testAdminEmails()
   ```

### Manual Verification

1. **Check admin users in Supabase Auth**:
   ```javascript
   getAdminEmails()
   ```

2. **Send test submission**:
   ```javascript
   testEmail()
   ```

## Email Status Types

### ✅ **Verified Emails**
- Admin user has confirmed their email address
- Best delivery reliability
- Recommended for production

### ⚠️ **Unverified Emails**
- Admin user hasn't confirmed email yet
- Still receives notifications (best-effort delivery)
- Should verify email for better reliability

## Available Console Commands

### Admin Management
```javascript
setupAdmin(email, password, name)  // Create new admin user
listAdminEmails()                  // Show current admin users
getAdminEmails()                   // Get admin user details
```

### Email Testing
```javascript
testAdminEmails()                  // Test notification system
testEmail(adminEmail)              // Send test to specific admin
verifyEmail()                      // Check email configuration
```

### System Status
```javascript
setupNBDAC(email, password, name)  // Complete system setup
runQuickSetup()                    // Guided setup process
```

## Email Notification Details

### Subject Format
```
Permohonan Projek Baru - [Project Name]
```

### Content Includes
- **Project Details**: Name, department, officer, email
- **Submission Info**: Date, status (Menunggu)
- **Action Required**: Login instructions for admins
- **Professional Format**: Clean HTML email template

### Delivery Method
- **Primary**: Supabase email service
- **Fallback**: Organization email API (if configured)
- **Development**: Console logging for debugging

## Technical Implementation

### Server Side (`/supabase/functions/server/index.tsx`)

```javascript
// Get admin emails from Supabase Auth
const getAdminEmails = async (): Promise<string[]> => {
  const { data, error } = await supabase.auth.admin.listUsers();
  const adminUsers = data.users.filter(user => 
    user.user_metadata?.role === 'admin'
  );
  return adminUsers.map(user => user.email).filter(Boolean);
};

// Send notification to all admins
const sendAdminNotification = async (submission: any) => {
  const adminEmails = await getAdminEmails();
  adminEmails.forEach(email => sendEmail(email, subject, htmlContent));
};
```

### Client Side (`/utils/supabase-admin-emails.ts`)

```javascript
// Get admin users with details
export const getSupabaseAdminEmails = async (): Promise<AdminUser[]> => {
  const response = await fetch('/make-server-764b8bb4/list-admins');
  return response.json();
};

// Test email system
export const testAdminEmailNotification = async () => {
  // Creates test submission to trigger email
  // Returns test results and status
};
```

## Troubleshooting

### No Admin Users Found
```javascript
// Solution: Create admin users
setupAdmin("admin@nbdac.gov.my", "password123", "Admin Name")
```

### Email Not Received
1. **Check admin user exists**: `listAdminEmails()`
2. **Verify email address**: Check Supabase Auth dashboard
3. **Test notification**: `testAdminEmails()`
4. **Check server logs**: Look for email send status

### Email Verification Issues
1. **Unverified emails**: Admins should check email and click verification link
2. **Production setup**: Configure SMTP in Supabase dashboard
3. **Organization email**: Set `ORG_EMAIL_API_URL` environment variable

## Production Recommendations

### 1. Email Verification
- Ensure all admin users verify their email addresses
- Use organization email domain for admin accounts
- Monitor email delivery in server logs

### 2. Admin Management
- Use descriptive names for admin users
- Regularly review admin user list
- Remove inactive admin users

### 3. Email Configuration
- Configure organization SMTP in Supabase dashboard
- Set up custom email templates if needed
- Monitor email delivery rates

### 4. Monitoring
- Check `/health` endpoint for admin user status
- Review server logs for email send status
- Test notification system regularly

## Environment Variables

### Required (Already Configured)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side Supabase key
- `SUPABASE_ANON_KEY` - Client-side Supabase key

### Optional (For Enhanced Email)
- `ORG_EMAIL_API_URL` - Organization email service URL
- `ORG_EMAIL_API_KEY` - Organization email service key
- `ADMIN_SETUP_KEY` - Secure key for admin creation

## System Health Check

The `/health` endpoint provides email system status:

```json
{
  "status": "ok",
  "admin": {
    "admin_users_found": 2,
    "email_notifications": "Enabled"
  },
  "email_service": "Supabase + Organization Fallback"
}
```

## Summary

The Supabase Auth email integration provides:

- **Automatic email discovery** from authenticated admin users
- **No separate configuration** required
- **Production-ready notifications** using real email addresses
- **Centralized admin management** through Supabase Auth
- **Scalable and secure** email notification system

Admin emails are now seamlessly integrated with the authentication system, making the NBDAC system more maintainable and production-ready.