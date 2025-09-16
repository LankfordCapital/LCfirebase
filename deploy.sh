#!/bin/bash

# 🚀 Lankford Capital Production Deployment Script
# This script deploys the application to Firebase App Hosting

echo "🚀 Starting Lankford Capital Production Deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase first:"
    echo "firebase login"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Firebase App Hosting
echo "🚀 Deploying to Firebase App Hosting..."
firebase deploy --only apphosting

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "🌐 Your application is now live at: https://lankfordcapital.com"
    echo ""
    echo "📋 Post-deployment checklist:"
    echo "  - [ ] Test user registration and login"
    echo "  - [ ] Verify AI assistant functionality"
    echo "  - [ ] Test document upload"
    echo "  - [ ] Check user management (admin)"
    echo "  - [ ] Verify email functionality"
    echo ""
    echo "🔍 Monitor your deployment:"
    echo "  - Firebase Console: https://console.firebase.google.com"
    echo "  - Google Cloud Console: https://console.cloud.google.com"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
