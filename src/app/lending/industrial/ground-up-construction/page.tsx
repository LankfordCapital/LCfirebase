import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Customized financing for new builds",
    "Competitive interest rates and terms",
    "Flexible draw schedules to match construction milestones",
    "Expert support from experienced industrial lenders",
    "Financing for a variety of property types like warehouses and manufacturing plants",
];

export default function IndustrialGroundUpConstructionPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Industrial Ground Up Construction</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Building your industrial vision from the ground up with tailored financing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Comprehensive Construction Financing</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Our Ground Up Construction loans provide the capital you need to take your industrial project from concept to completion. We offer structured financing solutions designed to support every phase of your new build, ensuring a smooth process from groundbreaking to full operation.
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
             <Image src="https://placehold.co/600x400.png" alt="Industrial construction site with cranes" layout="fill" objectFit="cover" data-ai-hint="industrial construction" />
          </div>
        </div>
      </section>
    </div>
  );
}
