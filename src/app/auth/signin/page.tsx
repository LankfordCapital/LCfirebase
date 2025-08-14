
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CustomLoader } from "@/components/ui/custom-loader";
import Image from "next/image";

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign In Failed',
        description: error.message || 'Failed to sign in with Google',
      });
      setIsGoogleLoading(false);
    }
  };

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
            <CardHeader className="text-center pb-6">
              <CardTitle className="font-headline text-3xl font-semibold text-gray-900 mb-2">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Sign in to your Lankford Capital account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Sign In Button */}
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full h-12 text-base font-medium border-gray-300 hover:bg-gray-50"
              >
                {isGoogleLoading ? (
                  <CustomLoader className="mr-3 h-5 w-5" />
                ) : (
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">
                    or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <Button 
                  className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading && <CustomLoader className="mr-2 h-5 w-5" />}
                  Sign in
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </div>
              <div className="flex justify-center space-x-6 text-sm">
                <Link href="/auth/broker-signin" className="text-gray-600 hover:text-gray-900">
                  Broker Sign In
                </Link>
                <Link href="/auth/workforce-signin" className="text-gray-600 hover:text-gray-900">
                  Workforce Sign In
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
