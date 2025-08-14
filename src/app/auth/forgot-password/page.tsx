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
import { useAuth } from "@/contexts/auth-context";
import { useState, FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { CustomLoader } from "@/components/ui/custom-loader";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { sendPasswordReset, checkEmailExists } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Rate limiting: prevent more than 5 attempts per session
    if (attemptCount >= 5) {
      toast({
        variant: 'destructive',
        title: 'Too Many Attempts',
        description: 'You have exceeded the maximum number of password reset attempts. Please try again later.',
      });
      return;
    }
    
    setIsLoading(true);
    setAttemptCount(prev => prev + 1);
    
    try {
      // First check if the email exists in the system
      const emailExists = await checkEmailExists(email);
      
      if (!emailExists) {
        toast({
          variant: 'destructive',
          title: 'Email Not Found',
          description: 'No account found with this email address. Please check your email or sign up for a new account.',
        });
        setIsLoading(false);
        return;
      }

      // If email exists, send the password reset email
      await sendPasswordReset(email);
      setIsSuccess(true);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for password reset instructions.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: error.message || 'Failed to send password reset email',
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
                <CardTitle className="font-headline text-3xl font-semibold text-green-600 mb-2">✓ Email Sent!</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  We've sent password reset instructions to your email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Please check your email and follow the link to reset your password. 
                  The link will expire in 1 hour for security reasons.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Didn't receive the email?</strong><br />
                    Check your spam folder or try again with a different email address.
                  </p>
                </div>
                {attemptCount > 0 && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Security Notice:</strong> You have {5 - attemptCount} password reset attempts remaining in this session.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  className="w-full h-12 text-base font-medium"
                >
                  Try Again
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
                <CardTitle className="font-headline text-3xl font-semibold text-gray-900 mb-2">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
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
                  Send Reset Email
                </Button>
                <div className="flex flex-col space-y-2 text-center text-sm text-gray-600">
                  <div>
                    Remember your password?{" "}
                    <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                      Sign in
                    </Link>
                  </div>
                  <div>
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                      Sign up
                    </Link>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

