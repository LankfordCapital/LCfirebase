import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Long-term financing for stabilized industrial properties",
    "Competitive fixed and variable interest rates",
    "Amortization periods up to 30 years",
    "Purchase or refinance options",
    "Suitable for a wide range of industrial property types",
];

export default function IndustrialLongTermDebtPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Industrial Long Term Debt</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Stable, reliable financing for your income-producing industrial assets.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="A modern logistics warehouse" layout="fill" objectFit="cover" data-ai-hint="logistics warehouse" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Secure Your Investment for the Long Haul</h2>
            <p className="mt-4 text-lg text-foreground/70">
                For stabilized, income-generating industrial properties, our conventional and long-term debt solutions provide the stability you need. Secure competitive rates and favorable terms to maximize your cash flow and hold your industrial assets for the long term.
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
              <Link href="/dashboard">Explore Long Term Options</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
