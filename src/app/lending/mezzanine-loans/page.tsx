
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";

export default function MezzanineLoansPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_1058475664%20(1).mp4?alt=media&token=8ccb373f-4c35-4f78-abe8-f059193863d6" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-white md:text-5xl">Mezzanine Loans</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Sophisticated capital solutions to bridge the funding gap.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/shutterstock_2605496977.jpg?alt=media&token=57a23a29-1c77-4a49-bca0-61b47cbfa66e" alt="Large modern warehouse interior" layout="fill" objectFit="cover" data-ai-hint="warehouse" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">What is Mezzanine Financing?</h2>
            <p className="mt-4 text-lg text-foreground/70">
              Mezzanine debt is a form of hybrid capital that sits between senior debt and equity in a company's capital structure. It's an ideal solution for developers and business owners looking to maximize leverage and minimize equity dilution for acquisitions, expansions, or recapitalizations.
            </p>
             <div className="mt-6 space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Key Benefit</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Higher Leverage</div>
                        <p className="text-xs text-muted-foreground">Reduce your equity contribution and retain more ownership.</p>
                    </CardContent>
                </Card>
            </div>
             <Button asChild size="lg" className="mt-8">
              <Link href="/dashboard">Discuss Your Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
