import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Government-backed loans with favorable terms",
    "Lower down payments and longer repayment terms",
    "Financing for real estate, equipment, and working capital",
    "SBA 7(a) and 504 loan programs available",
    "Ideal for business acquisition, expansion, or startup",
    "Expert guidance through the SBA application process"
];

export default function SBALoansPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">SBA Loans</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Fuel your small business growth with government-guaranteed financing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="Small business storefront with an open sign" layout="fill" objectFit="cover" data-ai-hint="small business" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Your Partner in Small Business Success</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Lankford Capital is proud to facilitate Small Business Administration (SBA) loans to help entrepreneurs and small business owners achieve their goals. These government-backed loans offer more flexible terms and lower down payments than conventional loans, making them an excellent choice for a variety of business needs.
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
              <Link href="/dashboard">Apply for an SBA Loan</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
