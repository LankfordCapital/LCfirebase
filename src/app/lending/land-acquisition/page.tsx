
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Financing for raw and entitled land",
    "Loans for horizontal development and infrastructure",
    "Flexible terms to match project timelines",
    "Expertise in zoning and entitlement processes",
    "Seamless transition to construction financing"
];

export default function LandAcquisitionPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_3610652399.mp4?alt=media&token=e3d9722d-1b03-4c8e-9b91-ce5da80c04e1" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-white md:text-5xl">Land <span className="text-primary">Acquisition</span> & Development</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Secure the foundation for your next great project.
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
            <h2 className="font-headline text-3xl font-bold text-primary">From <span className="text-foreground">Raw Land</span> to Ready Site</h2>
            <p className="mt-4 text-lg text-foreground/70">
                We provide specialized financing for the acquisition and development of land, empowering builders and developers to create value from the ground up. Our flexible loan structures are designed to support your project from initial purchase through to site readiness.
            </p>
            <ul className="mt-6 space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <Check className="h-6 w-6 text-accent p-1 bg-accent/10 rounded-full" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
             <Button asChild size="lg" className="mt-8">
              <Link href="/dashboard">Start Your Application</Link>
            </Button>
          </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/shutterstock_2156251239.jpg?alt=media&token=b110baae-7e12-4f5d-89c5-cefcebdf0a0c" alt="Developer reviewing land development plans" layout="fill" objectFit="cover" data-ai-hint="development plans" />
          </div>
        </div>
      </section>
    </div>
  );
}
