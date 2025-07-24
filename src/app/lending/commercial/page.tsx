import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const loanTypes = [
  {
    title: "Ground Up Construction",
    description: "Comprehensive financing for new commercial building projects.",
    features: ["Loans for various property types", "Structured financing", "Expert project analysis"],
  },
  {
    title: "Rehab Loans",
    description: "Funding for the renovation and improvement of existing commercial properties.",
    features: ["Value-add opportunities", "Cover hard and soft costs", "Quick closing"],
  },
  {
    title: "Acquisition & Bridge Loans",
    description: "Short-term financing to acquire property or bridge funding gaps.",
    features: ["Fast access to capital", "Flexible terms", "Solutions for complex deals"],
  },
  {
    title: "Conventional / Long Term Debt",
    description: "Stable, long-term financing solutions for stabilized commercial properties.",
    features: ["Competitive fixed rates", "Amortization up to 30 years", "Refinancing options"],
  },
];

export default function CommercialLendingPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Commercial Lending</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Powering your commercial real estate ambitions with robust financing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary">Our Commercial Loan Products</h2>
            <p className="mt-2 text-muted-foreground">Versatile solutions for every stage of your investment.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loanTypes.map((loan) => (
              <Card key={loan.title} className="flex flex-col text-center items-center">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{loan.title}</CardTitle>
                  <CardDescription>{loan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2 text-left">
                    {loan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0 w-full">
                  <Button asChild className="w-full">
                    <Link href="/dashboard">Inquire Now</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
           <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Your Vision, Our Capital</h2>
            <p className="mt-4 text-lg text-foreground/70">
              From small business storefronts to large-scale developments, our commercial lending experts provide the capital and guidance necessary to bring your vision to life.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/auth/signup">Start a Conversation</Link>
            </Button>
          </div>
          <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="Skyscrapers in a city" layout="fill" objectFit="cover" data-ai-hint="skyscrapers" />
          </div>
        </div>
      </section>
    </div>
  );
}
