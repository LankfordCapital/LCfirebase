import React from 'react';
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("items-baseline gap-1", className)}>
      <span className="text-primary font-bold">Lankford</span>
      <span className="text-foreground font-bold">Capital</span>
    </div>
  );
}
