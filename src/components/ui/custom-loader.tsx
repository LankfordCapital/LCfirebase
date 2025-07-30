import { cn } from "@/lib/utils";
import Image from "next/image";

export function CustomLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center h-6 w-6", className)}>
      <div className="absolute h-full w-full border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
      <Image 
        src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" 
        alt="Loading" 
        width={20} 
        height={20} 
        className="h-5 w-5"
      />
    </div>
  );
}
