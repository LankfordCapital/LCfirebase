import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Financing for a wide range of new and used equipment",
    "Competitive rates and flexible repayment terms",
    "Potential tax advantages through Section 179",
    "Preserve working capital for other business needs",
    "Simple and fast application process",
    "Leasing or a Loan Available",
    "Up to 97% of the purchase price available",
    "Minimum FICO Score of 660",
    "Low-doc, full-doc, and application-only options",
    "Fast approvals and funding"
];

export default function EquipmentFinancingPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Equipment Financing</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Acquire the tools you need to grow your business.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Power Your Operations</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Don't let a lack of equipment hold your business back. Our equipment financing and leasing options make it easy to acquire the machinery, vehicles, or technology you need with manageable payments, helping you scale operations and increase efficiency.
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
              <Link href="/dashboard">Finance Your Equipment</Link>
            </Button>
          </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="Heavy construction equipment on a worksite" layout="fill" objectFit="cover" data-ai-hint="heavy equipment" />
          </div>
        </div>
      </section>
    </div>
  );
}
