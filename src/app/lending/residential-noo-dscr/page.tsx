import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "No personal income or DTI calculations required",
    "Qualify based on the property's cash flow",
    "Loans for purchase, rate/term refinance, and cash-out refinance",
    "Financing for short-term and long-term rental properties",
    "Streamlined process for experienced investors"
];

export default function ResidentialNooDscrPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">DSCR Loans for Investors</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Secure financing based on your property's income potential, not your personal income.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Invest with Intelligence</h2>
            <p className="mt-4 text-lg text-foreground/70">
              Our Debt Service Coverage Ratio (DSCR) loans are the perfect tool for savvy real estate investors. We assess loan eligibility based on the property's ability to generate enough income to cover its debt obligations. This approach simplifies the loan process and allows you to scale your rental portfolio more effectively.
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
              <Link href="/dashboard">Get a DSCR Loan</Link>
            </Button>
          </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="Calculator and keys on a rental agreement" layout="fill" objectFit="cover" data-ai-hint="rental investment" />
          </div>
        </div>
      </section>
    </div>
  );
}