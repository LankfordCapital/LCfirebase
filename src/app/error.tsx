'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  const isChunkLoadError = error.message.includes('Loading chunk') || error.message.includes('ChunkLoadError');

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {isChunkLoadError ? 'Loading Error' : 'Something went wrong'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {isChunkLoadError 
              ? 'There was an issue loading some parts of the application. This is usually temporary.'
              : 'An unexpected error occurred. Please try again.'
            }
          </p>
          {error.message && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm font-medium">Error details</summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        
        <div className="space-y-2">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Reload page
          </Button>
        </div>
      </div>
    </div>
  );
}
