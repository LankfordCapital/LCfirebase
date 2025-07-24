import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const loanTypes = [
  {
    title: "Ground Up Construction",
    description: "Financing for new residential construction projects from the ground up.",
    features: ["Competitive rates", "Flexible draw schedules", "Experienced support"],
    href: "/lending/residential-noo-construction",
  },
  {
    title: "Fix and Flip",
    description: "Short-term loans for purchasing and renovating properties to sell for a profit.",
    features: ["Fast funding", "Up to 90% of purchase price", "Interest-only payments"],
    href: "/lending/residential-noo-fix-and-flip",
  },
  {
    title: "DSCR Loans",
    description: "Loans qualified based on property cash flow (Debt Service Coverage Ratio), not personal income.",
    features: ["No personal income verification", "Ideal for investors", "Streamlined process"],
    href: "/lending/residential-noo-dscr",
  },
  {
    title: "Bridge Loans",
    description: "Short-term financing to bridge the gap between property acquisitions.",
    features: ["Quick closing", "Flexible terms", "Secure opportunities fast"],
    href: "/lending/residential-noo-bridge",
  }
];

export default function ResidentialNooPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Residential Non-Owner Occupied Lending</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Tailored financing solutions for real estate investors.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loanTypes.map((loan) => (
              <Card key={loan.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{loan.title}</CardTitle>
                  <CardDescription>{loan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {loan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={loan.href}>Learn More</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/shutterstock_2494829643.jpg?alt=media&token=99af025c-48a0-4921-bb37-c28aeaffef5c" alt="Modern residential house" layout="fill" objectFit="cover" data-ai-hint="family home" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Partner with the Experts</h2>
            <p className="mt-4 text-lg text-foreground/70">
              Our team understands the nuances of investment property financing. We work with you to structure loans that align with your project timelines and profitability goals.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/auth/signup">Get Pre-Qualified</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

    