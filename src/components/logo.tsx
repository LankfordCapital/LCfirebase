
import React from 'react';
import { cn } from "@/lib/utils";
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <div className="flex items-baseline text-3xl">
        <span className="text-primary font-bold">Lankford</span>
        <span id="logo-capital" className="text-black font-bold">Capital</span>
      </div>
    </Link>
  );
}
