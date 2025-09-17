'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, RefreshCw, AlertTriangle, Info, Heart, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
// Removed health check imports to simplify auth system

export function AuthDebugPanel() {
  const { clearAuthCache, clearAllAuthCache, debugAuthState, user, userProfile } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development or for admins (or when no user on login page)
  const shouldShow = process.env.NODE_ENV === 'development' || userProfile?.role === 'admin' || !user;

  if (!shouldShow) {
    return null;
  }

  const handleClearAuthCache = () => {
    if (confirm('This will clear authentication cache. You may need to sign in again. Continue?')) {
      clearAuthCache();
    }
  };

  const handleClearAllCache = () => {
    if (confirm('This will clear ALL browser cache and reload the page. This is a nuclear option. Continue?')) {
      clearAllAuthCache();
    }
  };

  const handleDebugAuth = () => {
    debugAuthState();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          <Info className="h-4 w-4 mr-2" />
          Auth Debug
        </Button>
      ) : (
        <Card className="w-96 bg-background/95 backdrop-blur-sm border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
              Authentication Debug Panel
            </CardTitle>
            <CardDescription className="text-xs">
              Use these tools to troubleshoot authentication issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Button
                onClick={handleDebugAuth}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Debug Auth State
              </Button>
              
              <Button
                onClick={handleClearAuthCache}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Auth Cache
              </Button>
              
              <Button
                onClick={handleClearAllCache}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear ALL Cache
              </Button>
            </div>
            
            <div className="pt-2 border-t text-xs text-muted-foreground">
              <p><strong>Current User:</strong> {user?.email || 'Not signed in'}</p>
              <p><strong>Role:</strong> {userProfile?.role || 'Not available'}</p>
              <p><strong>Status:</strong> {userProfile?.status || 'Not available'}</p>
            </div>
            
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="w-full mt-2"
            >
              Hide Panel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
