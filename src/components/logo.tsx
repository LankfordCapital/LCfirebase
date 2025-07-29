import React from 'react';

export function Logo({ className }: { className?: string }) {
  // A simple, stylized text-based logo
  return (
    <div className={className}>
      <span className="text-2xl font-bold font-headline text-primary tracking-tight">
        Lankford Capital
      </span>
    </div>
  );
}
