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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-primary/5 lg:flex items-center justify-center">
        <Link href="/">
            <Image
            src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5"
            alt="Lankford Capital Logo"
            width={200}
            height={200}
            className="animate-spin-y"
            />
        </Link>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <Card className="shadow-2xl">
                <form onSubmit={handleSubmit}>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">Create {isBrokerSignUp ? 'a Broker' : 'an'} Account</CardTitle>
                    <CardDescription>
                    {isBrokerSignUp ? 'Register to partner with us.' : 'Join Lankford Capital to start your application.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {/* Google Sign Up Button */}
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={handleGoogleSignUp}
                      disabled={isGoogleLoading}
                      className="w-full"
                    >
                      {isGoogleLoading ? (
                        <CustomLoader className="mr-2 h-4 w-4" />
                      ) : (
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                      {isGoogleLoading ? 'Creating account...' : `Sign up with Google${isBrokerSignUp ? ' (Broker)' : ''}`}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading && <CustomLoader className="mr-2 h-4 w-4" />}
                    Create account
                    </Button>
                    <div className="flex flex-col gap-2 text-center text-sm">
                    <div className="text-center text-sm">
                        By signing up, you agree to our{" "}
                        <Link href="/terms-of-service" className="underline">
                        Terms of Service
                        </Link>
                    </div>
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href={isBrokerSignUp ? "/auth/broker-signin" : "/auth/signin"} className="underline">
                        Sign in
                        </Link>
                    </div>
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
