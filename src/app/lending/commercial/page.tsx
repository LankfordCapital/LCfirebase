
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
    href: "/lending/commercial/ground-up-construction"
  },
  {
    title: "Rehab Loans",
    description: "Funding for the renovation and improvement of existing commercial properties.",
    features: ["Value-add opportunities", "Cover hard and soft costs", "Quick closing"],
    href: "/lending/commercial/rehab-loans"
  },
  {
    title: "Acquisition & Bridge Loans",
    description: "Short-term financing to acquire property or bridge funding gaps.",
    features: ["Fast access to capital", "Flexible terms", "Solutions for complex deals"],
    href: "/lending/commercial/acquisition-bridge-loans"
  },
  {
    title: "Conventional / Long Term Debt",
    description: "Stable, long-term financing solutions for stabilized commercial properties.",
    features: ["Competitive fixed rates", "Amortization up to 30 years", "Refinancing options"],
    href: "/lending/commercial/conventional-long-term-debt"
  },
];

export default function CommercialLendingPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_3468943095.mp4?alt=media&token=a8e3dcf7-3d4a-4e89-b718-5c800156b625" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-white md:text-5xl">
            <span className="text-primary">Commercial</span> Lending
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
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
             <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/shutterstock_1712804041.jpg?alt=media&token=25df546e-1545-4d2f-9505-dd3162e41769" alt="Business handshake over documents" layout="fill" objectFit="cover" data-ai-hint="business handshake" />
          </div>
        </div>
      </section>
    </div>
  );
}
