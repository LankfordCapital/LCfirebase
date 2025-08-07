
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Minimum FICO score of 650",
    "No experience required; better terms with more completed deals",
    "Rates starting at 9.5% and 1.5 points",
    "Terms from 12-24 months with no prepayment penalty",
    "Rehab budgets can exceed purchase price",
    "Close in as little as 10 days",
    "Financing for single-family, 2-4 units, condos, and townhomes",
    "Loan amounts from $100,000 to $3.5M (case-by-case for higher)",
    "1st lien position required",
    "Purchase and refinance options available"
];

export default function ResidentialNOOFixAndFlipPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_3707052671.mp4?alt=media&token=f40dd8b7-4cde-4a0a-94f1-51c2b399226d" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Fix and Flip Loans</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Capitalize on your next renovation project with our flexible financing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Fix and Flip Lending</h2>
            <p className="mt-4 text-lg text-foreground/70">
              Our Fix and Flip loans provide real estate investors with the short-term financing needed to purchase and renovate properties. With competitive leverage and interest-only payment structures, we empower you to maximize your returns and move quickly in a competitive market.
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
              <Link href="/dashboard">Fund Your Flip</Link>
            </Button>
          </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="Home under renovation" layout="fill" objectFit="cover" data-ai-hint="home renovation" />
          </div>
        </div>
      </section>
    </div>
  );
}
