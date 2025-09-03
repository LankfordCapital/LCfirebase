# Firebase Hosting Deployment Guide

## 🚀 Quick Start

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase (if not already done)
```bash
firebase init
```

### 4. Deploy Your App
```bash
# Deploy everything (hosting + app hosting)
npm run firebase:deploy:all

# Or deploy individually
npm run firebase:deploy:hosting    # Frontend only
npm run firebase:deploy:apphosting # Backend only
```

## 📋 Pre-Deployment Checklist

### Environment Variables Setup
You need to set up these secrets in Google Secret Manager:

1. **GEMINI_API_KEY** - Your Gemini AI API key
2. **FIREBASE_SERVICE_ACCOUNT_KEY** - Your Firebase service account JSON
3. **RESEND_API_KEY** - Your Resend email API key

### Set up secrets in Google Cloud Console:
```bash
# Install Google Cloud CLI first
# Then run these commands:

# Set GEMINI_API_KEY
gcloud secrets create GEMINI_API_KEY --data-file=- <<< "your-gemini-api-key"

# Set FIREBASE_SERVICE_ACCOUNT_KEY
gcloud secrets create FIREBASE_SERVICE_ACCOUNT_KEY --data-file=service-account-key.json

# Set RESEND_API_KEY
gcloud secrets create RESEND_API_KEY --data-file=- <<< "your-resend-api-key"
```

## 🔧 Configuration Files

### firebase.json
- ✅ Configured for Next.js hosting
- ✅ App Hosting backend setup
- ✅ Firestore rules included

### apphosting.yaml
- ✅ Environment variables configured
- ✅ Secrets configured
- ✅ Max instances set to 3

### package.json
- ✅ Firebase deployment scripts added
- ✅ Node.js 20.x engine specified

## 🚀 Deployment Commands

```bash
# Build and deploy everything
npm run firebase:deploy:all

# Deploy only hosting (frontend)
npm run firebase:deploy:hosting

# Deploy only app hosting (backend)
npm run firebase:deploy:apphosting

# Serve locally with Firebase
npm run firebase:serve

# Start Firebase emulators
npm run firebase:emulators
```

## 🌐 URLs After Deployment

- **Frontend**: https://lankford-lending.web.app
- **Backend API**: https://your-backend-id-uc.a.run.app

## 🔍 Troubleshooting

### Common Issues:

1. **Build Errors**: Check TypeScript errors with `npm run typecheck`
2. **Environment Variables**: Ensure secrets are set in Google Secret Manager
3. **Firebase Permissions**: Make sure you're logged in with `firebase login`
4. **Project ID**: Verify you're using the correct Firebase project

### Debug Commands:
```bash
# Check Firebase project
firebase projects:list

# Check current project
firebase use

# View logs
firebase functions:log
```

## 📊 Monitoring

After deployment, monitor your app:
- Firebase Console: https://console.firebase.google.com
- Google Cloud Console: https://console.cloud.google.com
- App Hosting Dashboard: Available in Firebase Console

## 🔄 CI/CD Setup (Optional)

For automatic deployments, you can set up GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: lankford-lending
```

## 🎯 Next Steps

1. Set up secrets in Google Secret Manager
2. Run `npm run firebase:deploy:all`
3. Test your deployed application
4. Set up custom domain (optional)
5. Configure monitoring and alerts
