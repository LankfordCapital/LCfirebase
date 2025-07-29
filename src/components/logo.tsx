
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
       <Image 
        src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" 
        alt="Lankford Capital Logo"
        width={48}
        height={48}
        className="h-12 w-12"
      />
      <div className="flex items-baseline gap-1 font-headline text-2xl tracking-tight">
        <span className="text-primary font-bold">
          Lankford
        </span>
        <span className="text-foreground">
          Capital
        </span>
      </div>
    </div>
  );
}
