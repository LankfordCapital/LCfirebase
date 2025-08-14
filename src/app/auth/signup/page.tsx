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
import { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CustomLoader } from "@/components/ui/custom-loader";
import Image from "next/image";

function SignUpForm() {
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get('role');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signUp, signUpWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const isBrokerSignUp = roleFromQuery === 'broker';

  useEffect(() => {
    // Prefill for workforce creation if needed, you can expand this logic
    if (roleFromQuery === 'workforce') {
        // You might want to add more security around this
    }
  }, [roleFromQuery]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const role = isBrokerSignUp ? 'broker' : 'borrower';
    
    try {
      await signUp(email, password, fullName, role);
      
      toast({
        title: 'Sign Up Successful!',
        description: "Welcome to Lankford Capital.",
      });

      // Redirect to the appropriate dashboard
      if (role === 'broker') {
          router.push('/broker-office');
      } else {
          router.push('/dashboard');
      }

    } catch (error: any) {
      console.error("Sign Up Error:", error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    const role = isBrokerSignUp ? 'broker' : 'borrower';
    
    try {
      await signUpWithGoogle(role);
      
      toast({
        title: 'Sign Up Successful!',
        description: "Welcome to Lankford Capital.",
      });

      // Redirect to the appropriate dashboard
      if (role === 'broker') {
          router.push('/broker-office');
      } else {
          router.push('/dashboard');
      }

    } catch (error: any) {
      console.error("Google Sign Up Error:", error);
      toast({
        variant: 'destructive',
        title: 'Google Sign Up Failed',
        description: error.message || 'Failed to sign up with Google',
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
            <form onSubmit={handleSubmit}>
              <CardHeader className="text-center pb-6">
                <CardTitle className="font-headline text-3xl font-semibold text-gray-900 mb-2">
                  Create Account
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  {isBrokerSignUp ? 'Join Lankford Capital as a broker partner' : 'Start your lending journey with us'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Google Sign Up Button */}
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleGoogleSignUp}
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
                  {isGoogleLoading ? 'Creating account...' : `Continue with Google${isBrokerSignUp ? ' (Broker)' : ''}`}
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

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name" className="text-sm font-medium text-gray-700">
                      Full name
                    </Label>
                    <Input 
                      id="full-name" 
                      placeholder="Enter your full name" 
                      required 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
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
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Create a password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
                <Button 
                  className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading && <CustomLoader className="mr-2 h-5 w-5" />}
                  Create account
                </Button>
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href={isBrokerSignUp ? "/auth/broker-signin" : "/auth/signin"} className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpForm />
        </Suspense>
    )
}
