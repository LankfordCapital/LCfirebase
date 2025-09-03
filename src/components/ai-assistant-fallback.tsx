'use client';

import { AlertTriangle } from 'lucide-react';

interface AIAssistantFallbackProps {
  error?: Error;
}

export function AIAssistantFallback({ error }: AIAssistantFallbackProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-destructive text-destructive-foreground rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">AI Assistant Unavailable</span>
        </div>
        <p className="text-sm opacity-90">
          {error?.message || 'The AI assistant is temporarily unavailable. Please try again later.'}
        </p>
      </div>
    </div>
  );
}
