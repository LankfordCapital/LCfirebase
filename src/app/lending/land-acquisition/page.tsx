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
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Land Acquisition & Development</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Secure the foundation for your next great project.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">From Raw Land to Ready Site</h2>
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
             <Image src="https://placehold.co/600x400.png" alt="Expansive plot of land ready for development" layout="fill" objectFit="cover" data-ai-hint="land development" />
          </div>
        </div>
      </section>
    </div>
  );
}
