'use client';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CustomLoader } from "@/components/ui/custom-loader";
import Image from "next/image";
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Get the oobCode from URL parameters (Firebase sends this in the reset email)
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, [oobCode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords Do Not Match',
        description: 'Please make sure both passwords are identical.',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }

    if (!oobCode) {
      toast({
        variant: 'destructive',
        title: 'Invalid Reset Link',
        description: 'Please request a new password reset link.',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setIsSuccess(true);
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been updated. You can now sign in with your new password.',
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to reset password.';
      
      if (error.code === 'auth/invalid-action-code') {
        errorMessage = 'This password reset link has expired or is invalid. Please request a new one.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Logo in top left */}
        <div className="absolute top-8 left-8">
          <Link href="/">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5"
              alt="Lankford Capital Logo"
              width={60}
              height={60}
              className="hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Centered content */}
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="font-headline text-3xl font-semibold text-green-600 mb-2">✓ Password Updated!</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Your password has been successfully reset.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  You can now sign in to your account using your new password.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
                <Button 
                  onClick={() => router.push('/auth/signin')}
                  className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </Button>
                <div className="text-center text-sm">
                  <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                    Back to Home
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Logo in top left */}
        <div className="absolute top-8 left-8">
          <Link href="/">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5"
              alt="Lankford Capital Logo"
              width={120}
              height={120}
              className="hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Centered content */}
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="font-headline text-3xl font-semibold text-red-600 mb-2">Invalid Reset Link</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  This password reset link is invalid or has expired.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  {error}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
                <Button 
                  variant="outline"
                  onClick={() => router.push('/auth/forgot-password')}
                  className="w-full h-12 text-base font-medium"
                >
                  Request New Reset Link
                </Button>
                <div className="text-center text-sm">
                  <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                    Back to Sign In
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Logo in top left */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5"
            alt="Lankford Capital Logo"
            width={160}
            height={160}
            className="hover:scale-105 transition-transform duration-200"
          />
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <form onSubmit={handleSubmit}>
              <CardHeader className="text-center pb-6">
                <CardTitle className="font-headline text-3xl font-semibold text-gray-900 mb-2">Reset Your Password</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Enter your new password below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    New password
                  </Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter new password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters long.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                    Confirm new password
                  </Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm new password" 
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
                <Button 
                  className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading && <CustomLoader className="mr-2 h-5 w-5" />}
                  Update Password
                </Button>
                <div className="text-center text-sm">
                  <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                    Back to Sign In
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

