import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
       <Image 
        src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" 
        alt="Lankford Capital Icon"
        width={48}
        height={48}
        className="h-12 w-auto"
      />
      <span className="font-headline text-2xl font-bold tracking-tight">
        <span className="text-primary">Lankford</span>
        <span className="text-foreground ml-1">Capital</span>
      </span>
    </div>
  );
}
