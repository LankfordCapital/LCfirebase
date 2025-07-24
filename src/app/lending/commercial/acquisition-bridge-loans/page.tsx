import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Fast access to capital for time-sensitive acquisitions",
    "Bridge financing gaps between purchase and long-term loans",
    "Solutions for complex or non-traditional transactions",
    "Flexible terms tailored to your specific needs",
    "Interest-only payment options available"
];

export default function CommercialAcquisitionBridgeLoansPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Acquisition & Bridge Loans</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Seize opportunities with fast and flexible short-term financing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Move Quickly and Confidently</h2>
            <p className="mt-4 text-lg text-foreground/70">
                In the fast-paced world of commercial real estate, speed is critical. Our acquisition and bridge loans provide the short-term capital needed to acquire properties quickly, execute on a business plan, or bridge a gap until permanent financing is secured.
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
              <Link href="/dashboard">Secure a Bridge Loan</Link>
            </Button>
          </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="A bridge connecting two pieces of land" layout="fill" objectFit="cover" data-ai-hint="bridge" />
          </div>
        </div>
      </section>
    </div>
  );
}
