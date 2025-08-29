
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from '@/components/ui/custom-loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Building, Mail, Phone, Upload, Save, BarChart, DollarSign } from 'lucide-react';
import { updateProfile } from 'firebase/auth';

export default function BrokerProfilePage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [companyName, setCompanyName] = useState(userProfile?.company || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');

  useEffect(() => {
      setFullName(userProfile?.fullName || '');
      setCompanyName(userProfile?.company || '');
      setPhone(userProfile?.phone || '');
  }, [userProfile]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
        await updateProfile(user, { displayName: fullName });
        // Here you would also update the user profile in your Firestore database
        // For example: await updateUserInDb({ uid: user.uid, fullName, companyName, phone });
        
        toast({
            title: 'Profile Updated',
            description: 'Your information has been successfully saved.',
        });
    } catch(error) {
         toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'There was an error updating your profile.',
        });
    } finally {
        setIsSaving(false);
    }
  }

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <CustomLoader className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your broker profile and compliance documents.</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/> Personal & Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.photoURL || ''} />
                                <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Change Photo</Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={user.email || ''} readOnly disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving ? <CustomLoader className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-primary"/> Broker Documents</CardTitle>
                        <CardDescription>Keep your compliance documents up to date.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Button variant="outline" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> W-9 (Broker)</Button>
                         <Button variant="outline" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> Wiring Instructions (Broker)</Button>
                         <Button variant="outline" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> ID/Driver's License (Broker)</Button>
                         <Button variant="outline" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" /> Signed Broker Agreement</Button>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5 text-primary"/> Performance Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                            <p className="font-medium">Total Funded Volume</p>
                            <p className="font-bold text-lg">$1.2M</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                            <p className="font-medium">Loans in Progress</p>
                            <p className="font-bold text-lg">3</p>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                            <p className="font-medium">Active Borrowers</p>
                            <p className="font-bold text-lg">5</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
