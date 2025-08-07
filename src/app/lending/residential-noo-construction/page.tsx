
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Loan-to-Cost (LTC) up to 90%",
    "Up to 70% of After Constructed Value",
    "Terms from 12-24 months with extension options",
    "No prepayment penalty",
    "Minimum FICO score of 660",
    "3+ ground up deals or GC license with experience required",
    "Land acquisition can be included",
    "Fast Draws up to $50,000 with no inspection",
    "Interest reserves can be financed",
    "Rates starting at 9.99% and 2 points"
];

export default function ResidentialNOOConstructionPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">NOO Ground Up Construction</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Build your next investment property from the ground up.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Build and Grow Your Portfolio</h2>
            <p className="mt-4 text-lg text-foreground/70">
              Our Non-Owner Occupied Ground Up Construction loans are designed for investors and builders looking to expand their real estate portfolios. We provide the capital needed to take your project from blueprint to a finished residential property, with terms that make sense for your investment strategy.
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
              <Link href="/dashboard">Start Your Construction Loan</Link>
            </Button>
          </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="Residential construction site" layout="fill" objectFit="cover" data-ai-hint="home construction" />
          </div>
        </div>
      </section>
    </div>
  );
}
