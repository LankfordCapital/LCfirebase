'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, User, Phone, Mail, MapPin, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BorrowerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  propertyAddress?: string;
  companyName?: string;
}

interface BorrowerInfoModalProps {
  trigger?: React.ReactNode;
  onBorrowerAdded?: (borrowerInfo: BorrowerInfo) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BorrowerInfoModal({ trigger, onBorrowerAdded, open: externalOpen, onOpenChange }: BorrowerInfoModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [borrowerInfo, setBorrowerInfo] = useState<BorrowerInfo>({
    fullName: '',
    phoneNumber: '',
    email: '',
    propertyAddress: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (field: keyof BorrowerInfo, value: string) => {
    setBorrowerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!borrowerInfo.fullName.trim() || !borrowerInfo.phoneNumber.trim() || !borrowerInfo.email.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in all required fields (Full Name, Phone Number, Email).',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(borrowerInfo.email)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, save borrower info to database
      const borrowerResponse = await fetch('/api/borrowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...borrowerInfo,
          createdBy: 'broker' // You can get the actual broker ID from auth context
        }),
      });

      if (!borrowerResponse.ok) {
        const errorData = await borrowerResponse.json();
        throw new Error(errorData.error || 'Failed to save borrower');
      }

      const borrowerResult = await borrowerResponse.json();

      // Then create initial loan application (this will be done by the parent component)
      // Store borrower ID in sessionStorage for the application flow
      sessionStorage.setItem('currentBorrowerId', borrowerResult.borrowerId);
      
      // Call the callback if provided with the full result including the borrower ID
      if (onBorrowerAdded) {
        onBorrowerAdded({
          ...borrowerInfo,
          id: borrowerResult.borrowerId,
          borrowerData: borrowerResult.borrower
        });
      }

      toast({
        title: 'Borrower Added Successfully',
        description: `${borrowerInfo.fullName} has been added to the system.`,
      });

      // Close the modal
      setOpen(false);

    } catch (error) {
      console.error('Error adding borrower:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add borrower. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBorrowerInfo({
      fullName: '',
      phoneNumber: '',
      email: '',
      propertyAddress: '',
      companyName: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4"/>
            Start New Application
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add Borrower Information
          </DialogTitle>
          <DialogDescription>
            Enter the borrower's information to create a new loan application. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter borrower's full name"
                value={borrowerInfo.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="(555) 123-4567"
                value={borrowerInfo.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="borrower@example.com"
                value={borrowerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Company name (optional)"
                value={borrowerInfo.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>
          </div>

          {/* Property Address */}
          <div className="space-y-2">
            <Label htmlFor="propertyAddress" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Property Address
            </Label>
            <Input
              id="propertyAddress"
              type="text"
              placeholder="123 Main St, City, State ZIP"
              value={borrowerInfo.propertyAddress}
              onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
            />
          </div>

          {/* Summary Card */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Borrower Summary</CardTitle>
              <CardDescription>Review the information before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{borrowerInfo.fullName || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{borrowerInfo.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{borrowerInfo.email || 'Not provided'}</span>
              </div>
              {borrowerInfo.companyName && (
                <div className="flex justify-between">
                  <span className="font-medium">Company:</span>
                  <span>{borrowerInfo.companyName}</span>
                </div>
              )}
              {borrowerInfo.propertyAddress && (
                <div className="flex justify-between">
                  <span className="font-medium">Property:</span>
                  <span>{borrowerInfo.propertyAddress}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Borrower...' : 'Add Borrower & Continue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
