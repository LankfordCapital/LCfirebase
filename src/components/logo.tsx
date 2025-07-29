
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
       <Image 
        src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Logo%20Gold%20Transparent.svg?alt=media&token=e95ad3f0-466a-40a2-a734-78393e8a49c2" 
        alt="Lankford Capital Logo"
        width={200}
        height={56}
        className="h-14"
      />
    </div>
  );
}
