# Content Management System - Complete Guide

## 🎯 Overview

Successfully implemented a comprehensive Content Management System for Aurum Vest platform with the following features:

1. **Email Template Management** - Create and manage reusable email templates
2. **Notification System** - Send in-app and push notifications to users
3. **CMS Content Manager** - Manage website content with SEO optimization
4. **Global Error Handling** - Robust error management throughout the application
5. **Input Validation & Sanitization** - Security-first approach to user inputs

---

## 🔗 Access Points

### Production URLs
- **Primary**: https://aurumvest.xyz/admin/content-management
- **Netlify**: https://aurumvest.netlify.app/admin/content-management

### Admin Navigation
1. Login as admin user
2. Go to Admin Dashboard (`/admin`)
3. Click "Content Management" button
4. Access three tabs: Email Templates | Notifications | CMS

---

## 📧 Email Template Manager

### Features
- Create, edit, delete email templates
- Dynamic variable support (e.g., `{{user_name}}`, `{{verification_link}}`)
- HTML content editor with sanitization
- Active/Inactive status toggle
- Template listing with search/filter

### How to Use

#### Creating a Template
1. Click "New Template" button
2. Fill in the form:
   - **Name**: Template identifier (e.g., "Welcome Email")
   - **Subject**: Email subject line (variables supported)
   - **HTML Content**: Full HTML email body
   - **Variables**: Comma-separated list (e.g., `user_name, action_url`)
   - **Active**: Toggle to enable/disable
3. Click "Create"

#### Example Template
```html
<h1>Welcome to Aurum Vest, {{user_name}}!</h1>
<p>We're excited to have you on board.</p>
<p>Click below to verify your account:</p>
<a href="{{verification_link}}">Verify Account</a>
```

Variables: `user_name, verification_link`

#### Sending Emails
Use the `send-email` edge function:
```typescript
await supabase.functions.invoke('send-email', {
  body: {
    to: 'user@example.com',
    template_id: 'template-uuid-here',
    variables: {
      user_name: 'John Doe',
      verification_link: 'https://aurumvest.xyz/verify?token=abc123'
    }
  }
});
```

---

## 🔔 Notification Manager

### Features
- Send to all users or specific user by email
- Multiple notification types (info, success, warning, error, signal, trade, kyc)
- Optional push notifications
- Link attachments
- Real-time delivery

### How to Use

#### Send Notification
1. Fill in the form:
   - **Title**: Notification title (max 100 chars)
   - **Message**: Notification content (max 1000 chars)
   - **Type**: Select type (affects icon/color)
   - **Link** (optional): URL for "View" button
   - **Push**: Toggle to send push notification
2. Choose recipients:
   - **Send to all users**: Toggle ON to broadcast
   - **Specific user**: Enter user email
3. Click "Send Notification"

#### Notification Types
- `info` - General information (blue)
- `success` - Success messages (green)
- `warning` - Warnings (yellow)
- `error` - Error alerts (red)
- `signal` - Trading signals (purple)
- `trade` - Trade notifications (cyan)
- `kyc` - KYC status updates (orange)

---

## 📄 CMS Content Manager

### Features
- Create and manage website content pages
- SEO-friendly slugs
- Meta descriptions & keywords
- Published/Draft status
- Category organization
- Markdown support
- Public access to published content

### How to Use

#### Creating Content
1. Click "New Content" button
2. Fill in the form:
   - **Title**: Page title
   - **Slug**: URL-friendly identifier (auto-generated from title)
   - **Category**: Content category (blog, guides, news, etc.)
   - **Content**: Markdown-supported content
   - **Meta Description**: SEO description (max 160 chars)
   - **Meta Keywords**: Comma-separated keywords
   - **Publish**: Toggle to publish immediately
3. Click "Create"

#### Example Content
```markdown
**Title**: Getting Started with Trading Bots
**Slug**: getting-started-trading-bots
**Category**: guides
**Content**:
# Introduction to Aurum Vest Trading Bots

Trading bots automate your crypto trading strategy...

## Features
- 24/7 automated trading
- Risk management
- Real-time analytics

[Learn more](/dashboard/bots)
```

#### Accessing Published Content
Public URL: `https://aurumvest.xyz/content/{slug}`

Example: `https://aurumvest.xyz/content/getting-started-trading-bots`

---

## 🔒 Security Features

### Input Validation
All forms use Zod schemas for validation:
- **Length limits**: Prevents database overflow
- **Type checking**: Ensures correct data types
- **Pattern matching**: Validates slugs, URLs, emails
- **Required fields**: Enforces mandatory data

### Input Sanitization
- **HTML sanitization**: Removes `<script>`, event handlers, `javascript:` URLs
- **Text sanitization**: Removes dangerous characters (`<`, `>`)
- **URL validation**: Checks valid URL format
- **Email validation**: Regex-based email verification

### Database Security
- **Row Level Security (RLS)**: All tables protected
- **Admin-only access**: Content management requires admin role
- **Public read access**: Published CMS content only
- **Audit logging**: All actions tracked with timestamps

---

## 🛠️ Technical Implementation

### Database Tables

#### email_templates
```sql
- id: UUID
- name: TEXT
- subject: TEXT
- html_content: TEXT
- variables: TEXT[]
- is_active: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### cms_content
```sql
- id: UUID
- title: TEXT
- slug: TEXT (UNIQUE)
- content: TEXT
- meta_description: TEXT
- meta_keywords: TEXT[]
- is_published: BOOLEAN
- publish_date: TIMESTAMPTZ
- category: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Edge Functions

#### send-email
**Endpoint**: `/functions/v1/send-email`
**Auth**: Required (JWT)
**Method**: POST

**Request Body**:
```json
{
  "to": "user@example.com",
  "template_id": "uuid-here",
  "variables": {
    "user_name": "John",
    "action_url": "https://..."
  },
  // OR send directly
  "subject": "Custom Subject",
  "html_content": "<h1>Custom HTML</h1>"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "email-id",
    "from": "Aurum Vest <noreply@aurumvest.xyz>",
    "to": ["user@example.com"]
  }
}
```

### File Structure
```
src/
├── lib/
│   ├── validation.ts          # Zod schemas & sanitization
│   ├── errorHandler.ts        # Global error handling
│   └── ...
├── pages/
│   └── admin/
│       └── ContentManagement.tsx  # Main page
├── components/
│   └── admin/
│       └── content/
│           ├── EmailTemplateManager.tsx
│           ├── NotificationManager.tsx
│           └── CMSManager.tsx
supabase/
└── functions/
    └── send-email/
        └── index.ts
```

---

## ⚙️ Configuration

### Required Secrets
Add in Supabase Dashboard → Settings → Edge Functions:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Get RESEND_API_KEY**:
1. Sign up: https://resend.com
2. Verify domain: https://resend.com/domains
3. Create API key: https://resend.com/api-keys

### Netlify Configuration
File: `netlify.toml` (already configured)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📊 Usage Examples

### Send Welcome Email
```typescript
// In your application code
import { supabase } from '@/integrations/supabase/client';

async function sendWelcomeEmail(userEmail: string, userName: string) {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      to: userEmail,
      template_id: 'welcome-template-id',
      variables: {
        user_name: userName,
        dashboard_url: 'https://aurumvest.xyz/dashboard'
      }
    }
  });

  if (error) {
    console.error('Failed to send email:', error);
  } else {
    console.log('Email sent successfully:', data);
  }
}
```

### Send Notification
```typescript
import { supabase } from '@/integrations/supabase/client';

async function notifyTradeComplete(userId: string, tradeDetails: any) {
  const { error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      title: 'Trade Completed',
      message: `Your ${tradeDetails.symbol} trade executed at $${tradeDetails.price}`,
      type: 'trade',
      link: '/dashboard/trades'
    }]);

  if (error) {
    console.error('Failed to send notification:', error);
  }
}
```

### Fetch Published Content
```typescript
import { supabase } from '@/integrations/supabase/client';

async function getPublishedContent(slug: string) {
  const { data, error } = await supabase
    .from('cms_content')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  return data;
}
```

---

## 🚀 Deployment Checklist

- ✅ Database tables created (email_templates, cms_content)
- ✅ RLS policies configured
- ✅ Edge function deployed (send-email)
- ✅ Admin routes protected
- ✅ RESEND_API_KEY configured
- ✅ Domain configured (aurumvest.xyz, aurumvest.netlify.app)
- ✅ SEO meta tags updated
- ✅ Input validation active
- ✅ Error handling integrated
- ✅ Build optimization enabled

---

## 🐛 Troubleshooting

### Email Not Sending
1. Check RESEND_API_KEY is set in Supabase
2. Verify domain is verified in Resend dashboard
3. Check edge function logs: [View Logs](https://supabase.com/dashboard/project/fapdrnwrkeivaxglyeiy/functions/send-email/logs)
4. Ensure template exists and is active

### Notification Not Appearing
1. Verify user exists in profiles table
2. Check RLS policies allow insert
3. Ensure user is subscribed to real-time changes
4. Check browser console for errors

### CMS Content Not Accessible
1. Verify content is published (`is_published = true`)
2. Check slug is correct and unique
3. Ensure RLS policy allows public read access
4. Verify route is configured in app

### Build Errors
1. Run `npm install` to ensure dependencies are updated
2. Check TypeScript errors in console
3. Verify Supabase types are regenerated after migration
4. Clear build cache if needed

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Resend API Docs](https://resend.com/docs)
- [Zod Documentation](https://zod.dev/)
- [React Query Docs](https://tanstack.com/query)

---

## 🎉 Success!

All features are now live and ready for use. Admins can:
- Manage email templates for consistent communication
- Send targeted notifications to users
- Create and publish SEO-optimized content
- Track and handle errors effectively
- Maintain security with validated inputs

**Next Steps**:
1. Create initial email templates (welcome, password reset, etc.)
2. Test notification delivery
3. Publish initial CMS content (about, FAQ, guides)
4. Monitor edge function logs for any issues

---

**Last Updated**: 2025-10-15
**Version**: 1.0.0
**Status**: ✅ Production Ready