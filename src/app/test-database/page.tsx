'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { enhancedLoanApplicationService } from '@/lib/enhanced-loan-application-service';

export default function TestDatabasePage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [permissionIssues, setPermissionIssues] = useState<string[]>([]);
  const [existingApplications, setExistingApplications] = useState<any[]>([]);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const testDatabaseConnection = async () => {
    setLoading(true);
    setTestResult('Testing database connection...');
    setPermissionIssues([]);
    
    try {
      // Check authentication first
      if (!user || !userProfile) {
        setTestResult('❌ Authentication failed: User not signed in or profile missing');
        setPermissionIssues(['User not authenticated', 'Missing user profile']);
        return;
      }

      setTestResult(`✅ User authenticated: ${user.email} (Role: ${userProfile.role})`);
      
      // Test creating a simple document
      const testDoc = await enhancedLoanApplicationService.createLoanApplication(
        user.uid, // Use actual user ID
        user.uid, // Use actual user ID as broker
        'test-program',
        { 
          loanCategory: 'test',
          borrowerInfo: {
            fullName: 'Test Borrower',
            email: 'test@example.com'
          }
        }
      );
      
      setTestResult(`✅ Database connection successful! Created test application with ID: ${testDoc}`);
      setApplicationId(testDoc);
      
      toast({
        title: 'Database Test Successful',
        description: 'Database connection and write operations are working correctly.',
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Database test error:', error);
      
      if (errorMessage.includes('permission-denied') || errorMessage.includes('Missing or insufficient permissions')) {
        setTestResult(`❌ Database permission denied: ${errorMessage}`);
        setPermissionIssues([
          'Firestore rules blocking access',
          'User may not have required permissions',
          'Check Firestore security rules'
        ]);
        
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'Database access blocked by security rules. Check Firestore configuration.',
        });
      } else {
        setTestResult(`❌ Database connection failed: ${errorMessage}`);
        setPermissionIssues([
          'Database connection error',
          'Check Firebase configuration',
          'Verify project settings'
        ]);
        
        toast({
          variant: 'destructive',
          title: 'Database Test Failed',
          description: `Error: ${errorMessage}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const testReadApplication = async () => {
    if (!applicationId) {
      setTestResult('Please create a test application first');
      return;
    }
    
    setLoading(true);
    setTestResult('Testing application read...');
    
    try {
      const application = await enhancedLoanApplicationService.getLoanApplication(applicationId);
      
      if (application) {
        setTestResult(`✅ Application read successful! Application data: ${JSON.stringify(application, null, 2)}`);
        
        toast({
          title: 'Read Test Successful',
          description: 'Successfully retrieved the test application from the database.',
        });
      } else {
        setTestResult('❌ Application not found');
        
        toast({
          variant: 'destructive',
          title: 'Read Test Failed',
          description: 'Could not find the test application.',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Application read failed: ${errorMessage}`);
      
      toast({
        variant: 'destructive',
        title: 'Read Test Failed',
        description: `Error: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const testUpdateApplication = async () => {
    if (!applicationId) {
      setTestResult('Please create a test application first');
      return;
    }
    
    setLoading(true);
    setTestResult('Testing application update...');
    
    try {
      await enhancedLoanApplicationService.updateApplicationFields(applicationId, {
        testField: 'updated-value',
        updatedAt: new Date()
      });
      
      setTestResult('✅ Application update successful!');
      
      toast({
        title: 'Update Test Successful',
        description: 'Successfully updated the test application in the database.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Application update failed: ${errorMessage}`);
      
      toast({
        variant: 'destructive',
        title: 'Update Test Failed',
        description: `Error: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const testGetByBroker = async () => {
    if (!user) {
      setTestResult('Please sign in first');
      return;
    }
    
    setLoading(true);
    setTestResult('Testing getByBroker...');
    
    try {
      const applications = await enhancedLoanApplicationService.getLoanApplicationsByBroker(user.uid);
      setExistingApplications(applications);
      setTestResult(`✅ Found ${applications.length} applications for broker ${user.uid}`);
      
      toast({
        title: 'GetByBroker Test Successful',
        description: `Found ${applications.length} applications in the database.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ GetByBroker failed: ${errorMessage}`);
      
      toast({
        variant: 'destructive',
        title: 'GetByBroker Test Failed',
        description: `Error: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const cleanupTestData = async () => {
    if (!applicationId) {
      setTestResult('No test application to clean up');
      return;
    }
    
    setLoading(true);
    setTestResult('Cleaning up test data...');
    
    try {
      await enhancedLoanApplicationService.deleteApplication(applicationId);
      
      setTestResult('✅ Test data cleaned up successfully');
      setApplicationId('');
      
      toast({
        title: 'Cleanup Successful',
        description: 'Test application has been removed from the database.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Cleanup failed: ${errorMessage}`);
      
      toast({
        variant: 'destructive',
        title: 'Cleanup Failed',
        description: `Error: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Database Connection Test</h1>
        <p className="text-muted-foreground">
          Test the Firebase database connection and loan application operations
        </p>
      </div>

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>Current user authentication information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>User ID</Label>
              <Input value={user?.uid || 'Not authenticated'} readOnly />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user?.email || 'Not available'} readOnly />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={userProfile?.role || 'Unknown'} readOnly />
            </div>
            <div>
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant={user ? 'default' : 'destructive'}>
                  {user ? 'Authenticated' : 'Not Authenticated'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Tests</CardTitle>
            <CardDescription>
              Test various database operations to ensure everything is working
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testDatabaseConnection} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Database Connection'}
            </Button>
            
            <Button 
              onClick={testReadApplication} 
              disabled={loading || !applicationId}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Read Application'}
            </Button>
            
            <Button 
              onClick={testUpdateApplication} 
              disabled={loading || !applicationId}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Update Application'}
            </Button>
            
            <Button 
              onClick={testGetByBroker} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test GetByBroker'}
            </Button>
            
            <Button 
              onClick={cleanupTestData} 
              disabled={loading || !applicationId}
              variant="destructive"
              className="w-full"
            >
              {loading ? 'Cleaning...' : 'Cleanup Test Data'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              View the results of database operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="applicationId">Test Application ID</Label>
                <Input
                  id="applicationId"
                  value={applicationId}
                  placeholder="Will be populated after creation"
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="testResult">Test Result</Label>
                <div className="mt-2 p-3 bg-muted rounded-md min-h-[100px] whitespace-pre-wrap text-sm">
                  {testResult || 'No tests run yet'}
                </div>
              </div>

              {permissionIssues.length > 0 && (
                <div>
                  <Label>Permission Issues</Label>
                  <div className="mt-2 space-y-2">
                    {permissionIssues.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          Issue
                        </Badge>
                        <span className="text-red-600 text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Applications */}
      {existingApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Applications in Database</CardTitle>
            <CardDescription>
              Found {existingApplications.length} application(s) for this broker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {existingApplications.map((app, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <div className="grid gap-2 text-sm">
                    <div><strong>ID:</strong> {app.id}</div>
                    <div><strong>Program:</strong> {app.loanProgram}</div>
                    <div><strong>Status:</strong> {app.status}</div>
                    <div><strong>Created:</strong> {app.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</div>
                    <div><strong>Borrower:</strong> {app.borrowerInfo?.fullName || 'Not provided'}</div>
                    <div><strong>Email:</strong> {app.borrowerInfo?.email || 'No email'}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>What This Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Authentication:</strong> Verifies user is properly signed in</li>
            <li><strong>Database Connection:</strong> Tests if Firebase is properly configured and accessible</li>
            <li><strong>Write Operations:</strong> Tests creating new loan applications in the database</li>
            <li><strong>Read Operations:</strong> Tests retrieving loan applications from the database</li>
            <li><strong>Update Operations:</strong> Tests modifying existing loan applications</li>
            <li><strong>GetByBroker:</strong> Tests the specific query that was failing</li>
            <li><strong>Delete Operations:</strong> Tests removing test data (soft delete)</li>
            <li><strong>Collection Structure:</strong> Ensures the enhancedLoanApplications collection exists</li>
            <li><strong>Permission Issues:</strong> Identifies Firestore security rule problems</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-600">Permission Denied Errors</h4>
              <p className="text-sm text-muted-foreground">
                If you see "permission-denied" errors, the Firestore security rules are blocking access. 
                This usually means the rules need to be updated to allow the current user to access the collections.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-yellow-600">Authentication Issues</h4>
              <p className="text-sm text-muted-foreground">
                Ensure you are signed in and have the proper role (broker, admin, etc.) to access loan applications.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-600">Firestore Rules</h4>
              <p className="text-sm text-muted-foreground">
                Check the Firestore console to verify the security rules are properly configured and allow 
                authenticated users to access the enhancedLoanApplications collection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
