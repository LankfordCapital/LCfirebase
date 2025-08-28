
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
import { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CustomLoader } from "@/components/ui/custom-loader";
import Image from "next/image";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get('role');
  const invitationId = searchParams.get('invitationId');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>(roleFromQuery || 'borrower');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [invitationDetails, setInvitationDetails] = useState<any>(null);
  const { signUp, signUpWithGoogle } = useAuth();
  const { toast } = useToast();

  // Fetch invitation details if invitationId is present
  useEffect(() => {
    if (invitationId) {
      fetchInvitationDetails();
    }
  }, [invitationId]);

  const fetchInvitationDetails = async () => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}`);
      if (response.ok) {
        const data = await response.json();
        setInvitationDetails(data);
        // Pre-fill the form with invitation data
        setFullName(data.fullName || '');
        setEmail(data.email || '');
      }
    } catch (error) {
      console.error('Error fetching invitation details:', error);
    }
  };

  const acceptInvitation = async (userId: string) => {
    if (!invitationId || !invitationDetails) return;
    
    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationId,
          userId,
          userEmail: email
        }),
      });

      if (response.ok) {
        toast({
          title: 'Invitation Accepted!',
          description: `You've been added to the ${invitationDetails.roomName} chat room.`,
        });
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signUp(email, password, fullName, role);
      
      // If this was an invitation signup, accept the invitation
      if (invitationId && invitationDetails && result?.user?.uid) {
        await acceptInvitation(result.user.uid);
      }
      
      toast({
        title: 'Sign Up Successful!',
        description: "Welcome to Lankford Capital. Please check for a verification email.",
      });

      // Let the automatic redirect handle routing

    } catch (error: any) {
      console.error("Sign Up Error:", error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    
    try {
      const result = await signUpWithGoogle(role);
       
      if (invitationId && invitationDetails && result?.user?.uid) {
        await acceptInvitation(result.user.uid);
      }

      toast({
        title: 'Sign Up Successful!',
        description: "Welcome to Lankford Capital.",
      });

      // Let the automatic redirect handle routing

    } catch (error: any) {
      console.error("Google Sign Up Error:", error);
      toast({
        variant: 'destructive',
        title: 'Google Sign Up Failed',
        description: error.message || 'Failed to sign up with Google',
      });
    } finally {
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
                Create Account
              </CardTitle>
              {invitationDetails && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-800">
                    🎉 You've been invited to join <strong>{invitationDetails.roomName}</strong>!
                  </p>
                </div>
              )}
              <CardDescription className="text-gray-600 text-base">
                Join Lankford Capital today
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Google Sign Up Button */}
              <Button 
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || isLoading}
                variant="outline" 
                className="w-full"
              >
                {isGoogleLoading && <CustomLoader className="mr-2 h-4 w-4" />}
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Sign up as</Label>
                  <div className="mt-2 space-y-3">
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        id="role-borrower"
                        name="role"
                        value="borrower"
                        checked={role === 'borrower'}
                        onChange={(e) => setRole(e.target.value)}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-900">Borrower</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        id="role-broker"
                        name="role"
                        value="broker"
                        checked={role === 'broker'}
                        onChange={(e) => setRole(e.target.value)}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-900">Broker</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={isLoading || isGoogleLoading} className="w-full">
                  {isLoading && <CustomLoader className="mr-2 h-4 w-4" />}
                  Create Account
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
