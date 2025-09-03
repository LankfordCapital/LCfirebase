'use client';

import { useEffect } from 'react';

export function ChunkErrorHandler() {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('Loading chunk') || 
          event.error?.message?.includes('ChunkLoadError')) {
        console.error('Chunk loading error detected:', event.error);
        
        // Optionally reload the page after a short delay
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Loading chunk') || 
          event.reason?.message?.includes('ChunkLoadError')) {
        console.error('Chunk loading promise rejection:', event.reason);
      }
    };

    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
