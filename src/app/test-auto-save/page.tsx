'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function TestAutoSavePage() {
  const [applicationId, setApplicationId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [revenue, setRevenue] = useState('');
  const [loading, setLoading] = useState(false);

  // Create a new loan application
  const createApplication = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/enhanced-loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userId: 'demoUser',
          brokerId: 'demoUser',
          loanProgram: 'residential-noo-ground-up-construction'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setApplicationId(result.data.applicationId);
        console.log('Application created successfully:', result.data.applicationId);
      }
    } catch (error) {
      console.error('Failed to create application:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save all fields immediately (simulating "Continue to Next Page")
  const saveAllFields = async () => {
    if (!applicationId) {
      console.error('Please create an application first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/enhanced-loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateFields',
          applicationId,
          updates: {
            'borrowerInfo.fullName': fullName,
            'borrowerInfo.email': email,
            'businessInfo.revenue': parseFloat(revenue) || 0
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log('All fields saved to database successfully!');
      }
    } catch (error) {
      console.error('Failed to save data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load saved data
  const loadSavedData = async () => {
    if (!applicationId) return;
    
    try {
      const response = await fetch(`/api/enhanced-loan-applications?action=getByBroker&brokerId=demoUser`);
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        const app = result.data[0];
        setFullName(app.borrowerInfo?.fullName || '');
        setEmail(app.borrowerInfo?.email || '');
        setRevenue(app.businessInfo?.revenue?.toString() || '');
        
        console.log('Saved data loaded from database');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Auto-Save System Test</h1>
        <p className="text-muted-foreground">
          This page demonstrates how the auto-save system works in loan applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Create Application</CardTitle>
          <CardDescription>
            Create a new loan application to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={createApplication} disabled={loading}>
            {loading ? 'Creating...' : 'Create New Application'}
          </Button>
          {applicationId && (
            <p className="mt-2 text-sm text-muted-foreground">
              Application ID: {applicationId}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 2: Fill Out Form Fields</CardTitle>
          <CardDescription>
            Enter information in the fields below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="revenue">Monthly Revenue</Label>
            <Input
              id="revenue"
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="Enter monthly revenue"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 3: Save All Data</CardTitle>
          <CardDescription>
            This simulates clicking "Continue to Next Page" - all data is saved immediately
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={saveAllFields} disabled={loading || !applicationId}>
            {loading ? 'Saving...' : 'Save All Fields (Continue to Next Page)'}
          </Button>
          
          <Button onClick={loadSavedData} variant="outline" disabled={!applicationId}>
            Load Saved Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">✅ Real-time Auto-save:</h4>
            <p className="text-sm text-muted-foreground">
              In the actual loan application, each field automatically saves to the database as you type
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">✅ Navigation Save:</h4>
            <p className="text-sm text-muted-foreground">
              When you click "Continue to Next Page", all remaining data is saved immediately before navigation
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">✅ Data Persistence:</h4>
            <p className="text-sm text-muted-foreground">
              All user input is stored in the Firestore database and persists between page navigations
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            The system automatically tracks completion percentage and saves progress
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
