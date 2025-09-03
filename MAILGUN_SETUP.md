# Mailgun Email Service Setup Guide

## Overview
We've integrated Mailgun as the email service provider for sending invitations, notifications, and automated emails. Mailgun offers reliable email delivery with excellent deliverability rates.

## Setup Steps

### 1. Get Mailgun Account and API Key
1. Go to [https://www.mailgun.com](https://www.mailgun.com)
2. Sign up for a free account (10,000 emails/month free)
3. Go to API Keys section in your dashboard
4. Copy your Private API Key
5. Note your Mailgun domain (e.g., `sandbox-123.mailgun.org` for testing)

### 2. Add Environment Variables
Create or update your `.env.local` file in your project root and add:

```bash
# Mailgun Configuration
MAILGUN_API_KEY=your_private_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here

# For production, use your custom domain
# MAILGUN_DOMAIN=mail.yourdomain.com
```

### 3. Domain Setup (Production)
For production use, you'll want to use your own domain:

1. **Add your domain** in Mailgun dashboard
2. **Verify domain ownership** by adding DNS records
3. **Update environment variable** to use your custom domain
4. **Test domain** to ensure it's properly configured

### 4. Verify Setup
Test the email service by calling the API endpoint:

```bash
# Test the email service
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email from Mailgun",
    "message": "Hello from Lankford Lending via Mailgun!"
  }'
```

## Features Included

✅ **Complete invitation workflow** - From sending to acceptance  
✅ **Beautiful email templates** - Professional-looking invitation emails  
✅ **Firestore integration** - Stores invitation data and status  
✅ **User management** - Adds users to chat rooms upon acceptance  
✅ **Expiration handling** - Invitations expire after 7 days  
✅ **Email automation** - AI-powered email generation  
✅ **Bulk email support** - Send to multiple recipients  
✅ **Attachment support** - Send emails with file attachments  
✅ **Template variables** - Dynamic content replacement  
✅ **Email validation** - Built-in email format validation  

## Usage Examples

### Simple Email
```typescript
import { sendSimpleEmail } from '@/lib/mailgun-service';

await sendSimpleEmail(
  'user@example.com',
  'Welcome!',
  'Thank you for joining Lankford Lending!'
);
```

### HTML Email with Template Variables
```typescript
import { sendTemplateEmail } from '@/lib/mailgun-service';

const template = `
  <h1>Welcome {{name}}!</h1>
  <p>Your loan application ID is: {{applicationId}}</p>
  <p>We'll be in touch soon.</p>
`;

await sendTemplateEmail(
  'user@example.com',
  'Application Received',
  template,
  {
    name: 'John Doe',
    applicationId: 'APP-12345'
  }
);
```

### Full Email with CC/BCC and Tags
```typescript
import { sendEmail } from '@/lib/mailgun-service';

await sendEmail({
  to: ['user@example.com'],
  cc: ['manager@lankfordlending.com'],
  subject: 'Loan Application Update',
  html: '<h1>Your application has been approved!</h1>',
  from: 'loans@yourdomain.com',
  tags: ['loan-approval', 'automated'],
  variables: {
    applicationId: 'APP-12345',
    borrowerName: 'John Doe'
  }
});
```

### Bulk Email
```typescript
import { sendBulkEmail } from '@/lib/mailgun-service';

await sendBulkEmail(
  ['user1@example.com', 'user2@example.com', 'user3@example.com'],
  'Important Update',
  '<h1>System Maintenance Notice</h1><p>We will be performing maintenance...</p>'
);
```

### Email with Attachments
```typescript
import { sendEmailWithAttachments } from '@/lib/mailgun-service';

await sendEmailWithAttachments({
  to: ['user@example.com'],
  subject: 'Your Documents',
  html: '<p>Please find your documents attached.</p>',
  attachments: [
    {
      filename: 'contract.pdf',
      data: pdfBuffer,
      contentType: 'application/pdf'
    }
  ]
});
```

## Chat Invitation System

The chat invitation system automatically uses Mailgun when you call the invitation API:

```typescript
// This automatically sends a beautiful invitation email via Mailgun
const response = await fetch('/api/invitations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    roomId: 'project-chat',
    roomName: 'Project Discussion',
    invitedBy: 'Your Name'
  })
});
```

## Benefits of Mailgun

✅ **High deliverability rates** - Emails reach inboxes, not spam  
✅ **Reliable service** - 99.9% uptime SLA  
✅ **Detailed analytics** - Track opens, clicks, bounces  
✅ **Webhook support** - Real-time event notifications  
✅ **Template management** - Store and reuse email templates  
✅ **A/B testing** - Test different email versions  
✅ **Suppression lists** - Manage unsubscribes and bounces  
✅ **Free tier** - 10,000 emails/month free  
✅ **Easy integration** - Simple API and SDK  
✅ **Global infrastructure** - Fast delivery worldwide  

## Troubleshooting

### Common Issues

- **API Key Error**: Make sure your `.env.local` file has the correct `MAILGUN_API_KEY`
- **Domain Error**: Ensure `MAILGUN_DOMAIN` is set correctly
- **Rate Limits**: Free tier allows 10,000 emails/month
- **Domain Verification**: For production, verify your domain with Mailgun
- **DNS Issues**: Check that your domain's DNS records are properly configured

### Testing

1. **Use sandbox domain** for initial testing
2. **Check Mailgun logs** in your dashboard
3. **Verify email delivery** by checking recipient's inbox
4. **Test with different email providers** (Gmail, Outlook, etc.)

### Production Checklist

- [ ] Custom domain added and verified
- [ ] DNS records properly configured
- [ ] SPF record added
- [ ] DKIM signature configured
- [ ] DMARC policy set up
- [ ] Webhook endpoints configured (if needed)
- [ ] Suppression lists managed
- [ ] Monitoring and alerts set up

## Migration from Resend

If you were previously using Resend, the migration is complete! All email functionality now uses Mailgun:

- ✅ Invitation emails
- ✅ Email automation
- ✅ Test email endpoint
- ✅ All email templates

Simply update your environment variables and you're ready to go!
