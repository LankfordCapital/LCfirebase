import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-baseline", className)}>
      <span className="text-2xl font-bold font-headline text-primary tracking-tight">
        Lankford
      </span>
      <span className="text-xl font-semibold font-headline text-muted-foreground tracking-tight ml-1">
        Capital
      </span>
    </div>
  );
}
