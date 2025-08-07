
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Factory, LandPlot, Layers, Truck, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const loanPrograms = [
  {
    icon: <Home className="h-8 w-8 text-primary" />,
    title: "Residential NOO",
    description: "Financing for non-owner occupied 1-4 unit investment properties.",
    href: "/lending/residential-noo",
  },
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: "Commercial Lending",
    description: "Loans for various commercial real estate assets.",
    href: "/lending/commercial",
  },
  {
    icon: <Factory className="h-8 w-8 text-primary" />,
    title: "Industrial Lending",
    description: "Specialized financing for industrial properties.",
    href: "/lending/industrial",
  },
  {
    icon: <LandPlot className="h-8 w-8 text-primary" />,
    title: "Land Acquisition",
    description: "Funding for the purchase and development of land.",
    href: "/lending/land-acquisition",
  },
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: "Mezzanine Loans",
    description: "Hybrid debt and equity financing to bridge funding gaps.",
    href: "/lending/mezzanine-loans",
  },
  {
    icon: <Truck className="h-8 w-8 text-primary" />,
    title: "Equipment Financing",
    description: "Secure funding for essential business equipment.",
    href: "/lending/equipment-financing",
  },
];

export default function LendingHubPage() {
  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center text-white py-20 md:py-28">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_2021639264.jpg?alt=media&token=45a49432-6ac0-4c30-9988-2c5cdb0c482b"
          alt="Financial district cityscape"
          layout="fill"
          objectFit="cover"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          data-ai-hint="financial district"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-white md:text-5xl">
            Explore <span className="text-primary">Flexible</span> Lending Solutions
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Tailored capital programs for residential, commercial, industrial, equipment, and land development needs.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="#programs">Browse Loan Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="programs" className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold"><span className="text-primary">Our Loan</span> <span className="text-foreground">Programs</span></h2>
            <p className="mt-2 text-muted-foreground">Find the perfect financing solution for your next project.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loanPrograms.map((program) => (
              <Card key={program.title} className="flex flex-col text-center items-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">{program.icon}</div>
                  <CardTitle className="font-headline text-2xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{program.description}</p>
                </CardContent>
                <div className="p-6 pt-0 w-full">
                  <Button asChild className="w-full">
                    <Link href={program.href}>Learn More</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold"><span className="text-foreground">Ready to</span> <span className="text-primary">Get Started?</span></h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/70">
                Our streamlined application process and dedicated team make it easy to secure the funding you need.
            </p>
             <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/dashboard/application">Start an Application</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">Schedule a Consultation</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
