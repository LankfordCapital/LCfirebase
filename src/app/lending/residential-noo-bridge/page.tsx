import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Rates starting at 9.5% and 2 points",
    "Minimum FICO score of 650",
    "No experience required",
    "Up to 70% of the as-is market value",
    "Fast funding for time-sensitive acquisitions",
    "Short-term financing from 12-24 months",
    "Interest-only payments to maximize cash flow",
    "Clear path to permanent financing"
];

export default function ResidentialNooBridgePage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Residential NOO Bridge Lending</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Bridge the gap to your next residential investment property.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Secure Opportunities Quickly</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Our Residential NOO (Non-Owner Occupied) Bridge Loans provide fast, short-term financing to help investors seize opportunities quickly. Whether you're acquiring a new property before long-term financing is in place or need to close a deal fast, our bridge loans provide the capital you need.
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
              <Link href="/dashboard">Apply for a Bridge Loan</Link>
            </Button>
          </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="House keys on a blueprint" layout="fill" objectFit="cover" data-ai-hint="house investment" />
          </div>
        </div>
      </section>
    </div>
  );
}
