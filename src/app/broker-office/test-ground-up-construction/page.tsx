'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function TestGroundUpConstructionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createGroundUpConstructionApp = async () => {
    if (!user?.uid) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to test the application.',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-ground-up-construction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          brokerId: user.uid, // Using same ID for testing
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        toast({
          title: 'Success!',
          description: 'Ground Up Construction application created and saved to database!',
        });
      } else {
        throw new Error(data.error || 'Failed to create application');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create application',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Test Ground Up Construction Database Saving</h1>
        <p className="text-muted-foreground mt-2">
          This will create a comprehensive Ground Up Construction application and save it to the database
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Ground Up Construction Application</CardTitle>
          <CardDescription>
            Click the button below to create a test Ground Up Construction application with comprehensive data.
            This will test the new separate loan application type system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={createGroundUpConstructionApp}
              disabled={loading || !user}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Ground Up Construction App'}
            </Button>
          </div>

          {!user && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                Please sign in to test the Ground Up Construction application creation.
              </p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Application Created Successfully!
              </h3>
              <div className="space-y-2 text-green-700">
                <p><strong>Application ID:</strong> {result.data.applicationId}</p>
                <p><strong>Program:</strong> {result.data.program}</p>
                <p><strong>Borrower:</strong> {result.data.borrowerName}</p>
                <p><strong>Loan Amount:</strong> ${result.data.loanAmount.toLocaleString()}</p>
                <p><strong>Construction Budget:</strong> ${result.data.constructionBudget.toLocaleString()}</p>
                <p><strong>Timeline:</strong> {result.data.timeline}</p>
                <p><strong>After Construction Value:</strong> ${result.data.afterConstructionValue.toLocaleString()}</p>
              </div>
              <p className="text-green-600 mt-3">
                The application has been saved to the <code>residential-noo-applications</code> collection in Firestore.
                Check your database to see the complete data structure!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What This Test Does</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Creates Application Structure</h4>
              <p className="text-sm text-muted-foreground">
                Initializes a new Residential NOO Ground Up Construction application with all required fields
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2. Populates Borrower Information</h4>
              <p className="text-sm text-muted-foreground">
                Fills in complete borrower details including personal info, address, employment, and financial data
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">3. Sets Loan Details</h4>
              <p className="text-sm text-muted-foreground">
                Configures loan amount ($500k), term (18 months), down payment (20%), and construction budget ($400k)
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">4. Adds Property Information</h4>
              <p className="text-sm text-muted-foreground">
                Sets property type, square footage, lot size, and construction-specific details
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">5. Includes Construction-Specific Data</h4>
              <p className="text-sm text-muted-foreground">
                Adds contractor info, construction plans, budget breakdown, draw schedule, timeline, and insurance
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">6. Updates Progress Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Marks all relevant sections as completed and calculates overall progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
