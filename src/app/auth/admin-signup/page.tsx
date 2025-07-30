
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

export default function AdminSignUpPage() {
  const [fullName, setFullName] = useState('Admin User');
  const [email, setEmail] = useState('admin@lankfordcapital.com');
  const [password, setPassword] = useState('');
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
      if (error.code === 'auth/user-not-found') {
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
                description: signUpError.message,
            });
        }
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
           toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description: "The password is incorrect. If you have forgotten the password, you may need to manage users in the Firebase console.",
        });
      }
      else {
         toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description: error.message,
        });
      }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-2xl mx-auto">
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
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
