import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="text-primary font-bold font-headline text-2xl tracking-tight">
        Lankford
      </span>
      <span className="text-foreground font-headline text-2xl tracking-tight">
        Capital
      </span>
    </div>
  );
}
