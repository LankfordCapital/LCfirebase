
import React from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import Link from 'next/link';

export function Logo({ className, href }: { className?: string, href?: string }) {
  const LogoContent = () => (
    <div className={cn("flex items-center gap-2", className)}>
       <Image 
          src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" 
          alt="Lankford Capital Icon"
          width={40}
          height={40}
          className="logo-fixed-size"
        />
      <div className="flex items-baseline text-2xl">
        <span className="text-primary font-bold">Lankford</span>
        <span id="logo-capital" className="text-foreground font-bold">Capital</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
          <LogoContent />
      </Link>
    )
  }

  return <LogoContent />;
}
