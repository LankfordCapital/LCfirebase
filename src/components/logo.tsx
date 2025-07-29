import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="font-headline text-2xl font-bold tracking-tight">
        <span className="text-primary">Lankford</span>
        <span className="text-foreground ml-1">Capital</span>
      </span>
    </div>
  );
}
