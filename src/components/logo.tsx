import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-10 w-40", className)}>
        <Image
            src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Secondary%20Logo%20V1.png?alt=media&token=beae4c39-c288-4f32-870e-9d716a6da952"
            alt="Lankford Capital Logo"
            layout="fill"
            objectFit="contain"
            priority
        />
    </div>
  );
}
