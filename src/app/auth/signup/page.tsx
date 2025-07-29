
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
import { Loader2 } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { Logo } from "@/components/logo";

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signUp(email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      router.push('/dashboard');
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
    <div className="grid md:grid-cols-2 h-screen">
       <div className="flex flex-col items-center justify-center p-8 bg-primary/5">
         <div className="w-full max-w-sm mb-8">
            <Link href="/" className="flex items-center gap-2 text-3xl">
                <Logo />
            </Link>
         </div>
        <Card className="w-full max-w-sm shadow-2xl">
          <form onSubmit={handleSubmit}>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
              <CardDescription>
                Join Lankford Capital to start your application.
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                    <Link href="/auth/signin" className="underline">
                    Sign in
                    </Link>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
       <div className="hidden md:block relative">
        <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_3599048629.mp4?alt=media&token=a42649e7-9a18-4028-b277-b60390039ee2" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
      </div>
    </div>
  )
}
