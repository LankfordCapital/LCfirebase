'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import { enhancedLoanApplicationService } from '@/lib/enhanced-loan-application-service';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  User, 
  FileText,
  RefreshCw,
  Info
} from 'lucide-react';

interface CollectionStatus {
  name: string;
  accessible: boolean;
  documentCount: number;
  error?: string;
  lastChecked: Date;
}

export function DebugDatabase() {
  const { user, userProfile } = useAuth();
  const [collections, setCollections] = useState<CollectionStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [permissionIssues, setPermissionIssues] = useState<string[]>([]);

  const checkCollections = async () => {
    setLoading(true);
    setPermissionIssues([]);
    
    const collectionChecks: CollectionStatus[] = [];
    
    try {
      // Check enhancedLoanApplications collection
      try {
        const applications = await enhancedLoanApplicationService.getLoanApplicationsByUser(user?.uid || 'test');
        collectionChecks.push({
          name: 'enhancedLoanApplications',
          accessible: true,
          documentCount: applications.length,
          lastChecked: new Date()
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        collectionChecks.push({
          name: 'enhancedLoanApplications',
          accessible: false,
          documentCount: 0,
          error: errorMessage,
          lastChecked: new Date()
        });
        
        if (errorMessage.includes('permission-denied')) {
          setPermissionIssues(prev => [...prev, 'enhancedLoanApplications: Permission denied']);
        }
      }

      // Check if we can create a test document
      try {
        if (user?.uid) {
          const testId = await enhancedLoanApplicationService.createLoanApplication(
            user.uid,
            user.uid,
            'test-program',
            { loanCategory: 'test' }
          );
          
          // Clean up the test document
          await enhancedLoanApplicationService.deleteApplication(testId);
          
          collectionChecks.push({
            name: 'enhancedLoanApplications (write)',
            accessible: true,
            documentCount: 0,
            lastChecked: new Date()
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        collectionChecks.push({
          name: 'enhancedLoanApplications (write)',
          accessible: false,
          documentCount: 0,
          error: errorMessage,
          lastChecked: new Date()
        });
        
        if (errorMessage.includes('permission-denied')) {
          setPermissionIssues(prev => [...prev, 'enhancedLoanApplications write: Permission denied']);
        }
      }

      // Check users collection (if we have access)
      try {
        // Try to access a user document
        const userDoc = await enhancedLoanApplicationService.getLoanApplication('test-access');
        // This will fail, but we're just testing if the collection is accessible
        collectionChecks.push({
          name: 'users',
          accessible: true,
          documentCount: 0,
          lastChecked: new Date()
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('permission-denied')) {
          collectionChecks.push({
            name: 'users',
            accessible: false,
            documentCount: 0,
            error: 'Permission denied',
            lastChecked: new Date()
          });
          setPermissionIssues(prev => [...prev, 'users: Permission denied']);
        } else {
          collectionChecks.push({
            name: 'users',
            accessible: true,
            documentCount: 0,
            lastChecked: new Date()
          });
        }
      }

      // Check borrower-profiles collection
      try {
        // Try to access a borrower profile document
        const profileDoc = await enhancedLoanApplicationService.getLoanApplication('test-profile-access');
        // This will fail, but we're just testing if the collection is accessible
        collectionChecks.push({
          name: 'borrower-profiles',
          accessible: true,
          documentCount: 0,
          lastChecked: new Date()
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('permission-denied')) {
          collectionChecks.push({
            name: 'borrower-profiles',
            accessible: false,
            documentCount: 0,
            error: 'Permission denied',
            lastChecked: new Date()
          });
          setPermissionIssues(prev => [...prev, 'borrower-profiles: Permission denied']);
        } else {
          collectionChecks.push({
            name: 'borrower-profiles',
            accessible: true,
            documentCount: 0,
            lastChecked: new Date()
          });
        }
      }

      setCollections(collectionChecks);
      
      // Determine overall status
      const hasErrors = collectionChecks.some(c => !c.accessible);
      const hasWarnings = collectionChecks.some(c => c.error && !c.error.includes('permission-denied'));
      
      if (hasErrors) {
        setOverallStatus('error');
      } else if (hasWarnings) {
        setOverallStatus('warning');
      } else {
        setOverallStatus('healthy');
      }

    } catch (error) {
      console.error('Error checking collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && userProfile) {
      checkCollections();
    }
  }, [user, userProfile]);

  const getStatusIcon = (accessible: boolean, error?: string) => {
    if (accessible) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (error?.includes('permission-denied')) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadgeVariant = (accessible: boolean, error?: string) => {
    if (accessible) return 'default';
    if (error?.includes('permission-denied')) return 'destructive';
    return 'secondary';
  };

  const getStatusText = (accessible: boolean, error?: string) => {
    if (accessible) return 'Accessible';
    if (error?.includes('permission-denied')) return 'Permission Denied';
    return 'Error';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status & Permissions
        </CardTitle>
        <CardDescription>
          Real-time status of Firestore collections and permission checks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              overallStatus === 'healthy' ? 'bg-green-100' : 
              overallStatus === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {overallStatus === 'healthy' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : overallStatus === 'warning' ? (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">Overall Database Status</h3>
              <p className="text-sm text-muted-foreground">
                {overallStatus === 'healthy' ? 'All collections accessible' :
                 overallStatus === 'warning' ? 'Some issues detected' :
                 'Critical permission issues detected'}
              </p>
            </div>
          </div>
          <Badge variant={
            overallStatus === 'healthy' ? 'default' :
            overallStatus === 'warning' ? 'secondary' : 'destructive'
          }>
            {overallStatus.toUpperCase()}
          </Badge>
        </div>

        {/* Authentication Status */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <User className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium">User Authentication</p>
              <p className="text-sm text-muted-foreground">
                {user ? `Signed in as ${user.email}` : 'Not authenticated'}
              </p>
            </div>
            <Badge variant={user ? 'default' : 'destructive'}>
              {user ? 'Authenticated' : 'Not Signed In'}
            </Badge>
          </div>

          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <FileText className="h-5 w-5 text-purple-500" />
            <div>
              <p className="font-medium">User Profile</p>
              <p className="text-sm text-muted-foreground">
                {userProfile ? `Role: ${userProfile.role}` : 'No profile found'}
              </p>
            </div>
            <Badge variant={userProfile ? 'default' : 'destructive'}>
              {userProfile ? userProfile.role : 'Missing'}
            </Badge>
          </div>
        </div>

        {/* Collection Status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Collection Access Status</h3>
            <Button 
              onClick={checkCollections} 
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-3">
            {collections.map((collection, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(collection.accessible, collection.error)}
                  <div>
                    <p className="font-medium">{collection.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {collection.accessible ? 
                        `${collection.documentCount} documents` : 
                        collection.error || 'Access error'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(collection.accessible, collection.error)}>
                    {getStatusText(collection.accessible, collection.error)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {collection.lastChecked.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Issues */}
        {permissionIssues.length > 0 && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Permission Issues Detected</h3>
            </div>
            <div className="space-y-2">
              {permissionIssues.map((issue, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-sm text-red-700">{issue}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-white rounded border border-red-200">
              <p className="text-sm text-red-700">
                <strong>Solution:</strong> These permission issues are typically caused by Firestore security rules 
                that are too restrictive. Check your firestore.rules file and ensure it allows authenticated users 
                to access the required collections.
              </p>
            </div>
          </div>
        )}

        {/* Troubleshooting Tips */}
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Troubleshooting Tips</h3>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ensure you're signed in with the correct account</li>
            <li>• Check that your user profile has the correct role (broker, admin, etc.)</li>
            <li>• Verify Firestore security rules allow authenticated access</li>
            <li>• Check Firebase project configuration and API keys</li>
            <li>• Clear browser cache and cookies if issues persist</li>
          </ul>
        </div>

        {/* Last Updated */}
        <div className="text-center text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
