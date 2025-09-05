
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CustomLoader } from '@/components/ui/custom-loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Building, Mail, Phone, Upload, Save, BarChart, DollarSign, X, Camera } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { PhotoUploadService } from '@/lib/photo-upload-service';

export default function BrokerProfilePage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile data
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [companyName, setCompanyName] = useState(userProfile?.company || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [state, setState] = useState(userProfile?.state || '');
  const [zipCode, setZipCode] = useState(userProfile?.zipCode || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || user?.photoURL || '');

  useEffect(() => {
      setFullName(userProfile?.fullName || '');
      setCompanyName(userProfile?.company || '');
      setPhone(userProfile?.phone || '');
      setBio(userProfile?.bio || '');
      setAddress(userProfile?.address || '');
      setCity(userProfile?.city || '');
      setState(userProfile?.state || '');
      setZipCode(userProfile?.zipCode || '');
      setPhotoURL(userProfile?.photoURL || user?.photoURL || '');
  }, [userProfile, user]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
        // Update Firebase Auth profile
        await updateProfile(user, { 
            displayName: fullName,
            photoURL: photoURL 
        });

        // Update Firestore profile
        const response = await fetch('/api/user-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: user.uid,
                profileData: {
                    fullName,
                    company: companyName,
                    phone,
                    bio,
                    address,
                    city,
                    state,
                    zipCode,
                    photoURL,
                }
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        
        toast({
            title: 'Profile Updated',
            description: 'Your information has been successfully saved.',
        });
        
        setIsEditing(false);
    } catch(error) {
        console.error('Error updating profile:', error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'There was an error updating your profile.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const validation = PhotoUploadService.validateFile(file);
    if (!validation.valid) {
        toast({
            variant: 'destructive',
            title: 'Invalid File',
            description: validation.error,
        });
        return;
    }

    setIsUploading(true);
    
    try {
        const result = await PhotoUploadService.uploadProfilePhoto(file, user.uid);
        
        if (result.success && result.url) {
            setPhotoURL(result.url);
            toast({
                title: 'Photo Uploaded',
                description: 'Your profile photo has been updated.',
            });
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Error uploading photo:', error);
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: 'There was an error uploading your photo.',
        });
    } finally {
        setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!photoURL || !user) return;
    
    try {
        await PhotoUploadService.deleteProfilePhoto(photoURL);
        setPhotoURL('');
        toast({
            title: 'Photo Removed',
            description: 'Your profile photo has been removed.',
        });
    } catch (error) {
        console.error('Error removing photo:', error);
        toast({
            variant: 'destructive',
            title: 'Remove Failed',
            description: 'There was an error removing your photo.',
        });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
        // Reset to original values
        setFullName(userProfile?.fullName || '');
        setCompanyName(userProfile?.company || '');
        setPhone(userProfile?.phone || '');
        setBio(userProfile?.bio || '');
        setAddress(userProfile?.address || '');
        setCity(userProfile?.city || '');
        setState(userProfile?.state || '');
        setZipCode(userProfile?.zipCode || '');
        setPhotoURL(userProfile?.photoURL || user?.photoURL || '');
    }
    setIsEditing(!isEditing);
  };

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
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/> Personal & Company Information</CardTitle>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" onClick={handleEditToggle}>
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                                            {isSaving ? <CustomLoader className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={handleEditToggle}>
                                        <User className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Photo Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={photoURL} />
                                    <AvatarFallback className="text-lg">{fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <CustomLoader className="h-6 w-6 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                        >
                                            <Camera className="mr-2 h-4 w-4" />
                                            {isUploading ? 'Uploading...' : 'Change Photo'}
                                        </Button>
                                        {photoURL && (
                                            <Button 
                                                variant="outline" 
                                                onClick={handleRemovePhoto}
                                                disabled={isUploading}
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Click "Edit Profile" to change your photo
                                    </p>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input 
                                    id="fullName" 
                                    value={fullName} 
                                    onChange={e => setFullName(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input 
                                    id="companyName" 
                                    value={companyName} 
                                    onChange={e => setCompanyName(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={user.email || ''} readOnly disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input 
                                    id="phone" 
                                    type="tel" 
                                    value={phone} 
                                    onChange={e => setPhone(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Address Information</h3>
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <Input 
                                    id="address" 
                                    value={address} 
                                    onChange={e => setAddress(e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="123 Main Street"
                                />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input 
                                        id="city" 
                                        value={city} 
                                        onChange={e => setCity(e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="City"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input 
                                        id="state" 
                                        value={state} 
                                        onChange={e => setState(e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="State"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">ZIP Code</Label>
                                    <Input 
                                        id="zipCode" 
                                        value={zipCode} 
                                        onChange={e => setZipCode(e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="12345"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea 
                                id="bio" 
                                value={bio} 
                                onChange={e => setBio(e.target.value)}
                                disabled={!isEditing}
                                placeholder="Tell us about yourself and your experience..."
                                rows={4}
                            />
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
