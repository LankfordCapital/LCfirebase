import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline text-2xl font-bold tracking-tight", className)}>
      <span className="text-accent">
        Lankford
      </span>
      <span className="text-foreground">
        Capital
      </span>
    </div>
  );
}
