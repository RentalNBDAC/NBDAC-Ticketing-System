# Sistem Permohonan Projek NBDAC

## Project Overview

**Sistem Permohonan Projek NBDAC** is a comprehensive project booking and request management system built for the NBDAC (National Big Data Analytics Centre). The system features separate portals for internal staff and external guests, with full backend integration for data persistence, authentication, and email notifications.

### Key Features

- 🏢 **Dual Portal System**: Separate interfaces for internal staff and guest users
- 🔐 **Authentication System**: Secure admin authentication with Supabase Auth
- 📧 **Email Notifications**: Outlook-compatible email notifications via EmailJS
- 🗃️ **Data Persistence**: Full CRUD operations with Supabase backend
- 🌐 **Multilingual**: Malay language support for guest portal
- 📱 **Responsive Design**: Mobile-optimized interface
- ⚡ **Real-time Updates**: Live status updates and notifications
- 🛠️ **Admin Management**: Comprehensive admin panel for managing requests

### System Status Workflow

1. **Menunggu** (Pending) - Initial submission status
2. **Sedang Diproses** (In Progress) - Admin has started processing
3. **Selesai** (Completed) - Request has been completed

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library
- **Sonner** for toast notifications
- **React Hook Form** for form management

### Backend
- **Supabase** for database and authentication
- **Supabase Edge Functions** with Hono web framework
- **EmailJS** for client-side email notifications
- **Key-Value Store** for data persistence

### Deployment
- **Netlify** for frontend hosting
- **Supabase** for backend services

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Supabase Edge  │    │   Supabase DB   │
│   (Frontend)    │────│   Functions     │────│   (Backend)     │
│                 │    │   (Server)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    EmailJS      │
                    │  (Notifications)│
                    └─────────────────┘
```

### System Components

1. **Frontend (React App)**
   - User interfaces for guests and admins
   - Authentication handling
   - Form submissions and status management
   - Real-time notifications

2. **Backend (Supabase Edge Functions)**
   - API endpoints for CRUD operations
   - Email notification processing
   - Authentication management
   - Database operations

3. **Database (Supabase)**
   - User authentication
   - Project submissions storage
   - System configuration

4. **Email Service (EmailJS)**
   - Admin notifications
   - Outlook-compatible templates
   - Mobile-optimized layouts

## Installation & Setup

### Prerequisites

- Node.js 18+
- Supabase account
- EmailJS account (optional, for email notifications)

### Environment Setup

Create the following environment variables in your Supabase project:

```bash
# Supabase Configuration (Auto-configured)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# EmailJS Configuration (Optional)
EMAILJS_SERVICE_ID=your-service-id
EMAILJS_TEMPLATE_ID=your-template-id
EMAILJS_PUBLIC_KEY=your-public-key
EMAILJS_PRIVATE_KEY=your-private-key
EMAILJS_FROM_NAME=Sistem NBDAC
EMAILJS_FROM_EMAIL=noreply@nbdac.gov.my
```

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd sistem-permohonan-projek-nbdac
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Initialize System** (In browser console)
   ```javascript
   // Initialize the system with admin setup
   masterSystemFix()
   ```

### Netlify Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   Add the same environment variables in Netlify dashboard

3. **Deploy**
   - Deploy will be automatic on push to main branch

## System Configuration

### Admin Setup

The system includes a master configuration function accessible via browser console:

```javascript
// Complete system setup and admin creation
await masterSystemFix()
```

This function will:
- ✅ Set up database tables automatically
- ✅ Configure EmailJS integration
- ✅ Create admin users
- ✅ Initialize system settings
- ✅ Provide comprehensive status reporting

### EmailJS Configuration

1. **Create EmailJS Account** at https://emailjs.com
2. **Create Email Service** (Gmail, Outlook, etc.)
3. **Create Email Template** with these parameters:
   ```
   Subject: {{subject}}
   Content: {{{message_html}}}
   To: {{to_email}}
   From: {{from_name}}
   ```
4. **Configure via Console**:
   ```javascript
   goToEmailJSSetup()
   ```

## API Documentation

### Core Endpoints

All API endpoints are prefixed with `/make-server-764b8bb4/`

#### Submissions
- `GET /submissions` - Get all submissions (admin only)
- `POST /submissions` - Create new submission
- `PUT /submissions/:id` - Update submission status (admin only)
- `GET /submissions/by-email/:email` - Get submissions by email

#### Authentication
- `POST /admin-login` - Admin authentication
- `POST /admin-logout` - Admin logout
- `GET /admin-status` - Check admin authentication

#### Email System
- `GET /emailjs-status` - Check EmailJS configuration
- `POST /test-emailjs` - Test email notification
- `POST /send-notification` - Send admin notification

#### System Management
- `GET /health` - System health check
- `POST /system-setup` - Initialize system
- `GET /admin-emails` - Get admin email addresses

### Data Models

#### Submission
```typescript
interface Submission {
  id: string
  namaProjek: string        // Project name
  bahagian: string          // Department
  namaPegawai: string       // Officer name
  email: string            // Contact email
  tarikh: string           // Date
  tujuanProjek: string     // Project purpose
  websiteUrl?: string      // Website URL
  kutipanData: string      // Data collection frequency
  catatan?: string         // Additional notes
  status: 'Menunggu' | 'Sedang Diproses' | 'Selesai'
  created_at: string       // Creation timestamp
  updated_at: string       // Last update timestamp
}
```

#### Data Collection Frequencies
- `one-off` → "Satu kali sahaja"
- `daily` → "Harian"
- `weekly` → "Mingguan"
- `monthly` → "Bulanan"
- `quarterly` → "Suku Tahunan"
- `yearly` → "Tahunan"

## File Structure

```
src/
├── App.tsx                    # Main application component
├── components/
│   ├── AdminLoginPage.tsx     # Admin authentication
│   ├── AdminSetupPage.tsx     # Admin setup interface
│   ├── GuestPage.tsx          # Guest portal main page
│   ├── HomePage.tsx           # Application home page
│   ├── InternalPage.tsx       # Internal admin dashboard
│   ├── PermohonanBaruPage.tsx # New request form
│   ├── SemakStatusPage.tsx    # Status checking page
│   └── ui/                    # shadcn/ui components
├── hooks/
│   ├── useAuth.ts             # Authentication hook
│   └── useSubmissions.ts      # Submissions management hook
├── utils/
│   ├── api.ts                 # API client utilities
│   ├── auth.ts                # Authentication utilities
│   ├── email-helpers.ts       # Email template generation
│   ├── constants.ts           # Application constants
│   └── validation.ts          # Form validation utilities
├── supabase/functions/server/
│   ├── index.tsx              # Main server entry point
│   ├── admin-endpoints.tsx    # Admin API endpoints
│   ├── emailjs-endpoints.tsx  # Email notification endpoints
│   ├── database-setup.tsx     # Database initialization
│   └── email-template-sections.tsx # Email templates
└── styles/
    └── globals.css            # Global styles and Tailwind config
```

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Component-based architecture
- Custom hooks for state management

### Styling Guidelines
- Tailwind CSS v4 with custom design tokens
- Base font size: 14px
- Consistent spacing and typography
- Badge-style toast notifications
- Mobile-first responsive design

### Component Structure
```tsx
// Standard component structure
export default function ComponentName() {
  // Hooks
  const [state, setState] = useState()
  
  // Event handlers
  const handleEvent = () => {
    // Implementation
  }
  
  // Render
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  )
}
```

### Email Template Development
- Use table-based layouts for Outlook compatibility
- Include MSO conditional comments
- Specify bgcolor attributes on all table elements
- Use Arial font family for consistency
- Test in multiple email clients

## Security Considerations

### Authentication
- Supabase Auth for secure authentication
- Service role key kept server-side only
- Public anon key used for client operations

### Data Protection
- Input validation on all forms
- SQL injection prevention through Supabase client
- XSS protection through React's built-in escaping

### Email Security
- EmailJS for client-side email sending
- No sensitive data in email templates
- Admin email addresses retrieved securely

## Performance Optimization

### Frontend
- Code splitting with React lazy loading
- Optimized bundle size with tree shaking
- Efficient re-rendering with React hooks
- Toast notifications with proper cleanup

### Backend
- Supabase Edge Functions for fast response times
- Connection pooling for database operations
- Caching for frequently accessed data
- Optimized query patterns

### Email System
- Asynchronous email sending
- Fallback to console logging for development
- Mobile-optimized email templates
- Outlook-compatible table layouts

## Monitoring & Logging

### System Health
```javascript
// Check system health
await checkSystemHealth()

// Monitor notifications
await monitorNotifications()

// Get system statistics
await getNotificationStats()
```

### Development Tools
```javascript
// Available console commands
goHome()                    // Navigate to home
goToGuest()                // Navigate to guest portal
goToInternal()             // Navigate to internal portal
goToAdminLogin()           // Navigate to admin login
goToEmailJSSetup()         // Navigate to EmailJS setup
masterSystemFix()          // Complete system setup
testEmailJSConfiguration() // Test email system
```

## Troubleshooting

### Common Issues

1. **Authentication Problems**
   ```javascript
   // Clear auth state and restart
   await clearAuthState()
   await masterSystemFix()
   ```

2. **Email Notification Issues**
   ```javascript
   // Test email configuration
   await testEmailJSConfiguration("your@email.com")
   
   // Check EmailJS status
   await checkEmailJSStatus()
   ```

3. **Database Connection Issues**
   ```javascript
   // Reinitialize database
   await setupDatabase()
   
   // Check connection health
   await checkDatabaseHealth()
   ```

### Debug Commands

```javascript
// System diagnosis
await runSystemDiagnosis()

// Email system debug
await debugEmailSystem()

// Check all system components
await comprehensiveSystemCheck()
```

## Production Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] EmailJS service set up and tested
- [ ] Admin users created
- [ ] Database tables initialized
- [ ] Email templates tested in Outlook

### Netlify Configuration
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variables added
- [ ] Domain configured (if custom)
- [ ] HTTPS enabled

### Post-deployment
- [ ] System health check passed
- [ ] Email notifications working
- [ ] Authentication functioning
- [ ] All forms submitting correctly
- [ ] Mobile responsiveness verified

### Monitoring
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Email delivery monitoring
- [ ] User feedback collection

## Support & Maintenance

### Regular Tasks
- Monitor system performance
- Check email delivery rates
- Review error logs
- Update dependencies
- Backup configuration

### System Updates
- Test in development first
- Use staging environment for verification
- Schedule updates during low-usage periods
- Monitor system health post-update

### Contact & Support
For technical support or questions:
- Check browser console for debug information
- Use `masterSystemFix()` for automatic troubleshooting
- Review system logs in Supabase dashboard
- Test email system with built-in utilities

---

**Version**: 1.0.0  
**Last Updated**: September 2025  
**Maintainer**: NBDAC Rental/PI Team  
**License**: Internal Use Only  