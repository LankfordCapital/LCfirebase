# Email Service Setup Guide

## Overview
We've replaced the complex Firebase extension email system with a simple Mailgun-based email service. This is much more reliable and easier to set up.

## Setup Steps

### 1. Get Mailgun API Key
1. Go to [https://www.mailgun.com](https://www.mailgun.com)
2. Sign up for a free account (10,000 emails/month free)
3. Go to API Keys section
4. Copy your Private API Key
5. Note your Mailgun domain (e.g., `sandbox-123.mailgun.org` for testing)

### 2. Add Environment Variables
Create a `.env.local` file in your project root and add:
```bash
MAILGUN_API_KEY=your_private_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
```

### 3. Verify Setup
The email service is now ready to use! You can test it by calling the API endpoint:

```bash
# Test the email service
curl -X POST http://localhost:3000/api/test-mailgun \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email from Mailgun",
    "message": "Hello from Lankford Lending via Mailgun!",
    "testType": "simple"
  }'
```

Or test different email types:
```bash
# Test template email
curl -X POST http://localhost:3000/api/test-mailgun \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Template Test",
    "testType": "template"
  }'

# Test full email with all features
curl -X POST http://localhost:3000/api/test-mailgun \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Full Test",
    "message": "Testing all Mailgun features",
    "testType": "full"
  }'
```

## Chat Invitation System

### What's Included
✅ **Complete invitation workflow** - From sending to acceptance
✅ **Beautiful email templates** - Professional-looking invitation emails
✅ **Firestore integration** - Stores invitation data and status
✅ **User management** - Adds users to chat rooms upon acceptance
✅ **Expiration handling** - Invitations expire after 7 days
✅ **Test page** - `/test-chat-invitation` to test the system

### How It Works
1. **Send Invitation**: User fills out invitation form
2. **Create Record**: Invitation stored in Firestore with 7-day expiration
3. **Send Email**: Beautiful HTML email sent via Resend
4. **User Clicks Link**: User clicks signup/signin link in email
5. **Accept Invitation**: User automatically added to chat room
6. **Update Status**: Invitation marked as accepted

### Test the Chat Invitation System
Visit `/test-chat-invitation` to test the complete workflow:
- Fill out the invitation form
- Send invitation to your email
- Check your email for the invitation
- Click the links to test the flow

## Usage Examples

### Simple Email
```typescript
import { sendSimpleEmail } from '@/lib/email-service';

await sendSimpleEmail(
  'user@example.com',
  'Welcome!',
  'Thank you for joining Lankford Lending!'
);
```

### HTML Email with Template
```typescript
import { sendTemplateEmail } from '@/lib/email-service';

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

### Full Email with CC/BCC
```typescript
import { sendEmail } from '@/lib/email-service';

await sendEmail({
  to: ['user@example.com'],
  cc: ['manager@lankfordlending.com'],
  subject: 'Loan Application Update',
  html: '<h1>Your application has been approved!</h1>',
  from: 'loans@lankfordlending.com'
});
```

### Chat Invitation (Automatic)
The chat invitation system automatically uses the email service when you call the invitation API:

```typescript
// This automatically sends a beautiful invitation email
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

## Benefits of This Approach

✅ **No complex Firebase permissions needed**
✅ **No IAM role management**
✅ **Immediate setup - just add API key**
✅ **Reliable delivery**
✅ **Better error handling**
✅ **Free tier available (100 emails/day)**
✅ **Simple API**
✅ **Complete chat invitation workflow**
✅ **Beautiful email templates**
✅ **Automatic user management**

## Troubleshooting

- **API Key Error**: Make sure your `.env.local` file has the correct `RESEND_API_KEY`
- **Rate Limits**: Free tier allows 100 emails/day
- **Domain Verification**: For production, verify your domain with Resend
- **Spam Filters**: Use proper authentication and avoid spam trigger words
- **Invitation Not Working**: Check that the invitation API is properly configured
- **Email Not Received**: Check spam folder and verify Resend API key

## Next Steps

1. Add your Resend API key to `.env.local`
2. Test with the `/api/test-email` endpoint
3. Test the chat invitation system at `/test-chat-invitation`
4. Integrate the email functions into your existing code
5. Remove any Firebase extension email code
6. Start using the chat invitation system in your app
