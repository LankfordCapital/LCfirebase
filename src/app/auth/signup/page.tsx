
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
import { updateProfile } from "firebase/auth";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

function SignUpForm() {
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get('role');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
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
      const userCredential = await signUp(email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      
      // Create user profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        fullName: fullName,
        role: role,
        status: 'pending', // All new users are pending approval
        createdAt: new Date(),
      });

      // Redirect to a pending approval page instead of the dashboard
      router.push('/auth/pending-approval');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
      setIsLoading(false);
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
