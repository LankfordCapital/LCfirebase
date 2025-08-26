
import React from 'react';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className }: { className?: string; href?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
       <Image 
          src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" 
          alt="Lankford Capital Icon"
          width={48}
          height={48}
        />
      <div className="flex items-baseline text-2xl">
        <span className="text-primary font-bold">Lankford</span>
        <span id="logo-capital" className="text-black font-bold">Capital</span>
      </div>
    </div>
  );
}
