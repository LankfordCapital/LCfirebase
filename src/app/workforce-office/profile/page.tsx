'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from '@/components/ui/custom-loader';

export default function ProfilePage() {
  const { user, userProfile, addPasswordToGoogleAccount, canSignInWithPassword } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canUsePassword, setCanUsePassword] = useState<boolean | null>(null);

  // Check if user can sign in with password
  const checkPasswordSignIn = async () => {
    if (user?.email) {
      const canUse = await canSignInWithPassword(user.email);
      setCanUsePassword(canUse);
    }
  };

  // Add password to Google account
  const handleAddPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same.',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await addPasswordToGoogleAccount(password);
      toast({
        title: 'Password added successfully!',
        description: 'You can now sign in with your email and password.',
      });
      setPassword('');
      setConfirmPassword('');
      // Recheck password sign-in capability
      await checkPasswordSignIn();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to add password',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check password capability on component mount
  useState(() => {
    checkPasswordSignIn();
  });

  if (!user || !userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CustomLoader className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and authentication methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <div>
              <Label>Full Name</Label>
              <p className="text-sm text-gray-600">{userProfile.fullName}</p>
            </div>
            <div>
              <Label>Role</Label>
              <p className="text-sm text-gray-600 capitalize">{userProfile.role}</p>
            </div>
            <div>
              <Label>Authentication Method</Label>
              <p className="text-sm text-gray-600 capitalize">{userProfile.authProvider || 'email'}</p>
            </div>
            <div>
              <Label>Can Sign In with Password</Label>
              <p className="text-sm text-gray-600">
                {canUsePassword === null ? 'Checking...' : canUsePassword ? 'Yes' : 'No'}
              </p>
            </div>
          </CardContent>
        </Card>

        {userProfile.authProvider === 'google' && (
          <Card>
            <CardHeader>
              <CardTitle>Add Password to Google Account</CardTitle>
              <CardDescription>
                Add a password to your Google account so you can sign in with email and password as well.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPassword} className="space-y-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a new password"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <CustomLoader className="mr-2 h-4 w-4" />}
                  Add Password to Account
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
