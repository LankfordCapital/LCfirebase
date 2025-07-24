import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const loanPrograms = [
  {
    title: "SBA 7(a) Loans",
    description: "The most common and flexible SBA loan, ideal for working capital, expansion, and equipment purchases.",
  },
  {
    title: "SBA 504 Loans",
    description: "Provides long-term, fixed-rate financing for major fixed assets that promote business growth and job creation.",
  },
];

export default function SbaLoansPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">SBA Loans</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Government-backed financing to help your small business thrive.
          </p>
        </div>
      </section>

       <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary">Explore SBA Loan Programs</h2>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {loanPrograms.map((loan) => (
              <Card key={loan.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{loan.title}</CardTitle>
                  <CardDescription>{loan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <Button asChild className="w-full mt-4">
                    <Link href="/dashboard">Get Started</Link>
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
             <Image src="https://placehold.co/600x400.png" alt="Small business owner in their shop" layout="fill" objectFit="cover" data-ai-hint="small business" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Benefits of an SBA Loan</h2>
            <p className="mt-4 text-lg text-foreground/70">
              With competitive terms, lower down payments, and flexible overhead requirements, SBA loans are designed to make financing more accessible for small businesses.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/auth/signup">Check Your Eligibility</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
