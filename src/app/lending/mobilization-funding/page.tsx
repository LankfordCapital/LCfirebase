import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Zap, Rocket } from "lucide-react";

export default function MobilizationFundingPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Mobilization Funding</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Get the upfront capital you need to start your projects.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Kickstart Your Operations</h2>
            <p className="mt-4 text-lg text-foreground/70">
              Mobilization funding provides essential upfront capital for contractors and service providers to cover initial project costs like equipment, materials, and labor before the first payment from the client is received. This funding ensures your project starts on time and runs smoothly from day one.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/dashboard">Secure Funding Now</Link>
            </Button>
          </div>
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
            <Image src="https://placehold.co/600x400.png" alt="Construction team starting a new project" layout="fill" objectFit="cover" data-ai-hint="construction site" />
          </div>
        </div>
      </section>
    </div>
  );
}
