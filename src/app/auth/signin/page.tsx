
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

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
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

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-2xl mx-auto">
            <form onSubmit={handleSubmit}>
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Borrower Sign In</CardTitle>
                <CardDescription>Sign in to access your borrower dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                    </Link>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
                </Button>
                <div className="flex flex-col gap-2 text-center text-sm">
                <div>
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="underline">
                    Sign up
                    </Link>
                </div>
                <div className="mt-2">
                    <Link href="/auth/workforce-signin" className="underline">
                    Workforce Sign In
                    </Link>
                </div>
                </div>
            </CardFooter>
            </form>
        </Card>
      </div>
      <div className="hidden lg:block relative">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_1098239155.mp4?alt=media&token=40066233-852b-4fb5-bad0-dcdef71de9a8" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-primary/20" />
      </div>
    </div>
  )
}
