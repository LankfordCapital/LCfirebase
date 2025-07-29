
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const loanTypes = [
  {
    title: "Ground Up Construction",
    description: "Financing for the construction of new warehouses, distribution centers, and manufacturing facilities.",
    href: "/lending/industrial/ground-up-construction",
  },
  {
    title: "Rehab & Expansion Loans",
    description: "Funding to renovate, expand, or modernize your existing industrial properties.",
    href: "/lending/industrial/rehab-expansion-loans",
  },
  {
    title: "Acquisition & Bridge Loans",
    description: "Secure capital quickly to acquire new industrial assets or bridge financing periods.",
    href: "/lending/industrial/acquisition-bridge-loans",
  },
  {
    title: "Long Term Debt",
    description: "Stable, long-term financing for your income-producing industrial portfolio.",
    href: "/lending/industrial/long-term-debt",
  },
];

export default function IndustrialLendingPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_3505661673.mp4?alt=media&token=0bf831ef-6f04-43d7-abcf-cfd0706a39d8" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-white md:text-5xl">
            <span className="text-primary">Industrial</span> Lending
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Specialized financing for the backbone of commerce.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary">Financing Industrial Growth</h2>
            <p className="mt-2 text-muted-foreground">Solutions for manufacturing, logistics, and warehousing.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loanTypes.map((loan) => (
              <Card key={loan.title}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{loan.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{loan.description}</p>
                   <Button asChild className="w-full mt-6">
                    <Link href={loan.href}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/shutterstock_2605496977.jpg?alt=media&token=57a23a29-1c77-4a49-bca0-61b47cbfa66e" alt="Large modern warehouse interior" layout="fill" objectFit="cover" data-ai-hint="warehouse" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Built for Industry</h2>
            <p className="mt-4 text-lg text-foreground/70">
              We provide robust financing solutions that understand the demands of the industrial sector, from complex supply chains to large-scale manufacturing.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/auth/signup">Contact a Specialist</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
