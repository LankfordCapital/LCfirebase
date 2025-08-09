
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Zap, Rocket } from "lucide-react";

export default function MobilizationFundingPage() {
  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center text-white py-20 md:py-28">
         <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_1058475664%20(1).mp4?alt=media&token=8ccb373f-4c35-4f78-abe8-f059193863d6" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            <span className="text-primary">Mobilization</span> <span className="text-white">Funding</span>
            </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Get the upfront capital you need to start your projects.
          </p>
           <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/auth/signup">Apply Now</Link>
                </Button>
            </div>
        </div>
        <Image
            src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5"
            alt="Lankford Capital Icon"
            width={64}
            height={64}
            className="absolute bottom-4 right-4 z-20"
        />
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary"><span className="text-foreground">Kickstart</span> Your Operations</h2>
            <p className="mt-4 text-lg text-foreground/70">
              Mobilization funding provides essential upfront capital for contractors and service providers to cover initial project costs like equipment, materials, and labor before the first payment from the client is received. This funding ensures your project starts on time and runs smoothly from day one.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/dashboard">Secure Funding Now</Link>
            </Button>
          </div>
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
            <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/shutterstock_2359333313.jpg?alt=media&token=e7f4ac89-3c9b-42cd-8413-8c94a277f02f" alt="Shipping containers at a port, representing logistics and mobilization" fill className="object-cover" data-ai-hint="shipping containers" />
          </div>
        </div>
      </section>
    </div>
  );
}
