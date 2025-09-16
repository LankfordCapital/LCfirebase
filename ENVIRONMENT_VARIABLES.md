# 🔧 **Environment Variables Configuration**

## Required Environment Variables

### Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### AI Configuration
```bash
GEMINI_API_KEY=your_gemini_api_key
```

### Email Configuration
```bash
RESEND_API_KEY=your_resend_api_key
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

### Application Configuration
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Setup Instructions

1. **Create `.env.local` file** in the project root
2. **Copy the variables above** and replace with your actual values
3. **For production**, set these variables in your deployment platform:
   - Firebase App Hosting: Use Secret Manager
   - Vercel: Use Environment Variables in dashboard
   - Other platforms: Follow their environment variable setup

## Security Notes

- **Never commit** `.env.local` or `.env` files to version control
- **Use different values** for development, staging, and production
- **Rotate keys regularly** for security
- **Use Secret Manager** for production deployments when possible

## Current Defaults (Fallback)

If environment variables are not set, the system will use these fallback values:
- API Key: `AIzaSyCu0RxaSo1IKfWQ-as3xOLx8mSMm4CzrpI`
- Project ID: `lankford-lending`
- Auth Domain: `lankford-lending.firebaseapp.com`
- Storage Bucket: `lankford-lending.firebasestorage.app`
- Messaging Sender ID: `940157326397`
- App ID: `1:940157326397:web:02fbefc8cd0a13c2160654`
