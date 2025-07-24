import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Customized financing for new builds",
    "Competitive interest rates and terms",
    "Flexible draw schedules to match construction milestones",
    "Expert support from experienced commercial lenders",
    "Financing for a variety of property types",
    "No experience required",
    "660 minimum FICO Score",
    "Up to 80% loan to cost, with mezzanine financing up to 90% loan to cost",
    "Up to 70% of the after constructed value depending on collateral type",
    "Syndications are OK",
    "Available in 40 States"
];

export default function CommercialGroundUpConstructionPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Commercial Ground Up Construction</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Building your vision from the ground up with tailored financing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Comprehensive Construction Financing</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Our Ground Up Construction loans provide the capital you need to take your commercial project from concept to completion. We offer structured financing solutions designed to support every phase of your new build, ensuring a smooth process from groundbreaking to grand opening.
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
             <Image src="https://storage.googleapis.com/aip-dev-images-us-central1/public/11e54854-c8c7-4389-9a2e-461ca125e1fb" alt="Two construction workers reviewing blueprints on a laptop at a construction site." layout="fill" objectFit="cover" data-ai-hint="commercial construction" />
          </div>
        </div>
      </section>
    </div>
  );
}
