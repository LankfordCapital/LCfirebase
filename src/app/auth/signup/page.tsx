
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
import { Loader2, CheckCircle } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { Logo } from "@/components/logo";

const benefits = [
    { text: "Centralized Organization" },
    { text: "Quicker Loan Processing" },
    { text: "Ease of Access" },
    { text: "Real-time Updates" }
]

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
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
         <div className="hidden lg:flex flex-col items-start justify-center p-12 bg-primary/5 relative">
            <div className="absolute top-8 left-8">
                <Logo />
            </div>
            <div className="space-y-6">
                <h1 className="font-headline text-4xl font-bold text-primary">Unlock Your Dashboard</h1>
                <p className="text-lg text-foreground/80">Experience the future of lending management.</p>
                <ul className="space-y-4">
                    {benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6 text-accent"/>
                            <span className="text-lg">{benefit.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="flex items-center justify-center p-8">
            <Card className="w-full max-w-md shadow-2xl">
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
    </div>
  )
}
