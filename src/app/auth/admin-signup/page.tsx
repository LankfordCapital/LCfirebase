
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
import { updateProfile } from "firebase/auth";
import Image from "next/image";

export default function AdminSignUpPage() {
  const [fullName, setFullName] = useState('Admin User');
  const [email, setEmail] = useState('admin@lankfordcapital.com');
  const [password, setPassword] = useState('Admin123');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        // If user doesn't exist or credential is bad (which happens on first try), attempt to sign up.
        try {
            const userCredential = await signUp(email, password);
            await updateProfile(userCredential.user, {
                displayName: fullName
            });
            toast({
                title: 'Admin User Created',
                description: `Successfully created and signed in as ${email}`,
            });
            router.push('/dashboard');
        } catch (signUpError: any) {
            toast({
                variant: 'destructive',
                title: 'Sign Up Failed',
                description: `Could not create admin account. ${signUpError.message}`,
            });
        }
      }
      else {
         toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description: `An unexpected error occurred: ${error.message}`,
        });
      }
    } finally {
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
                <form onSubmit={handleSignIn}>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">Admin Sign In</CardTitle>
                    <CardDescription>
                    Use the admin credentials to access all dashboards. The account will be created if it doesn't exist.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} readOnly />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} readOnly />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading && <CustomLoader className="mr-2 h-4 w-4" />}
                    Sign In or Create Admin
                    </Button>
                    <div className="text-center text-sm">
                        <Link href="/auth/signin" className="underline">
                            Back to Borrower Sign In
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
