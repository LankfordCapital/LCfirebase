import React from 'react';
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-baseline", className)}>
      <span className="text-primary font-bold">Lankford</span>
      <span className="text-foreground font-bold">Capital</span>
    </div>
  );
}
