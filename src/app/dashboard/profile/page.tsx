'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, PlusCircle, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type Deal = {
  id: number;
  address: string;
  purchasePrice: string;
  rehabAmount: string;
  disposition: string;
};

export default function ProfilePage() {
  const [deals, setDeals] = useState<Deal[]>([
    { id: 1, address: '', purchasePrice: '', rehabAmount: '', disposition: '' },
  ]);

  const handleAddDeal = () => {
    if (deals.length < 10) {
      setDeals([...deals, { id: Date.now(), address: '', purchasePrice: '', rehabAmount: '', disposition: '' }]);
    }
  };

  const handleRemoveDeal = (id: number) => {
    setDeals(deals.filter(deal => deal.id !== id));
  };

  const handleDealChange = (id: number, field: keyof Omit<Deal, 'id'>, value: string) => {
    setDeals(deals.map(deal => (deal.id === id ? { ...deal, [field]: value } : deal)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal and contact information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>This information will be used for your loan applications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://placehold.co/80x80.png" />
                  <AvatarFallback>BD</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Borrower" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="borrower@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="(123) 456-7890" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your business details and documents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="Acme Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Input id="companyAddress" placeholder="123 Business Rd." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input id="companyPhone" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEin">EIN #</Label>
                <Input id="companyEin" placeholder="12-3456789" />
              </div>
              
              <div className="space-y-3 pt-2">
                <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Formation Documentation</Button>
                <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Operating Agreement/Bylaws</Button>
                <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Partnership/Officer List</Button>
                <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Business License</Button>
                <Button variant="outline" className="w-full justify-start"><Upload className="mr-2" /> Certificate of Good Standing</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Deal History</CardTitle>
          <CardDescription>Please provide details on your past real estate deals (up to 10).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {deals.map((deal, index) => (
            <div key={deal.id} className="space-y-4 rounded-md border p-4 relative">
              <h4 className="font-semibold">Deal #{index + 1}</h4>
              {deals.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => handleRemoveDeal(deal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove Deal</span>
                </Button>
              )}
              <div className="space-y-2">
                <Label htmlFor={`address-${deal.id}`}>Property Address</Label>
                <Input id={`address-${deal.id}`} placeholder="123 Main St, Anytown, USA" value={deal.address} onChange={e => handleDealChange(deal.id, 'address', e.target.value)} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`purchasePrice-${deal.id}`}>Purchase Price</Label>
                  <Input id={`purchasePrice-${deal.id}`} type="number" placeholder="200000" value={deal.purchasePrice} onChange={e => handleDealChange(deal.id, 'purchasePrice', e.target.value)}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`rehabAmount-${deal.id}`}>Rehab Amount</Label>
                  <Input id={`rehabAmount-${deal.id}`} type="number" placeholder="50000" value={deal.rehabAmount} onChange={e => handleDealChange(deal.id, 'rehabAmount', e.target.value)} />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor={`disposition-${deal.id}`}>Disposition</Label>
                <Select value={deal.disposition} onValueChange={value => handleDealChange(deal.id, 'disposition', value)}>
                  <SelectTrigger id={`disposition-${deal.id}`}>
                    <SelectValue placeholder="Select disposition..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="refinance">Refinance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {index < deals.length - 1 && <Separator />}
            </div>
          ))}

          {deals.length < 10 && (
            <Button variant="outline" onClick={handleAddDeal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Deal
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
