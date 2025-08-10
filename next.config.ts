
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: 'AIzaSyCu0RxaSo1IKfWQ-as3xOLx8mSMm4CzrpI',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'lankford-lending.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'lankford-lending',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'lankford-lending.firebasestorage.app',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '940157326397',
    NEXT_PUBLIC_FIREBASE_APP_ID: '1:940157326397:web:02fbefc8cd0a13c2160654',
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: '',
  },
};

export default nextConfig;
