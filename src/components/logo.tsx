import React from 'react';
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <>
      <span className="text-primary font-bold">Lankford</span>
      <span className="text-foreground font-bold">Capital</span>
    </>
  );
}
