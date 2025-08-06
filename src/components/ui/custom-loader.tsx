import { cn } from "@/lib/utils";
import Image from "next/image";

export function CustomLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-6 w-6", className)}>
      <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image 
          src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" 
          alt="Loading" 
          width={16} 
          height={16}
          className="h-4 w-4"
        />
      </div>
    </div>
  );
}
