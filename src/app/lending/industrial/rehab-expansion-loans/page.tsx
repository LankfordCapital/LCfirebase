import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Financing for property acquisition and renovation costs",
    "Ideal for value-add and repositioning strategies",
    "Cover both hard and soft costs for expansion or modernization",
    "Flexible terms for various project scopes",
    "Increase efficiency and capacity of your facilities",
];

export default function IndustrialRehabExpansionLoansPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Industrial Rehab & Expansion Loans</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Funding the transformation and growth of your industrial properties.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="Interior of a large warehouse under renovation" layout="fill" objectFit="cover" data-ai-hint="industrial renovation" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Unlock Your Property's Potential</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Our industrial rehab and expansion loans are designed for businesses looking to renovate, modernize, or expand their facilities. Whether you're upgrading machinery, adding square footage, or improving logistics, we provide the necessary capital to boost your property's value and operational efficiency.
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
              <Link href="/dashboard">Finance Your Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
