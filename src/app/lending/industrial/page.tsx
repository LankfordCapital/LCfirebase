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
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Industrial Lending</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
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
             <Image src="https://placehold.co/600x400.png" alt="Large modern warehouse interior" layout="fill" objectFit="cover" data-ai-hint="warehouse" />
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
