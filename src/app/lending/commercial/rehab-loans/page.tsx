import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check, FileText, GanttChartSquare, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";


const features = [
    "Financing for property acquisition and renovation costs",
    "Ideal for value-add and repositioning strategies",
    "Cover both hard and soft costs",
    "Flexible terms for various project scopes",
    "Up to 80% loan to cost, up to 90% with mezzanine",
    "Up to 70% of the after-rehab value",
    "Available in 40 states",
    "Quick closings available",
    "Competitive rate and fee structure",
    "Syndications OK"
];

const processSteps = [
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Submit Deal & Rehab Plan",
        description: "Provide the property details and a comprehensive renovation budget."
    },
    {
        icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
        title: "Underwriting & Valuation",
        description: "Our team assesses the deal, including the 'as-is' and 'after-rehab' values."
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: "Loan Approval",
        description: "Receive a competitive term sheet outlining the loan structure for your project."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Fund & Renovate",
        description: "Close your loan, receive funding for the acquisition, and begin your renovation with structured draws."
    }
];

export default function CommercialRehabLoansPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Commercial Rehab Loans</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Funding the transformation of your commercial properties.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="Interior of a commercial building under renovation" layout="fill" objectFit="cover" data-ai-hint="commercial renovation" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Unlock Your Property's Potential</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Our commercial rehab loans are designed for investors looking to renovate, repair, or improve commercial properties. Whether you're undertaking a minor facelift or a major overhaul, we provide the necessary capital to increase your property's value and cash flow.
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
              <Link href="/dashboard">Finance Your Renovation</Link>
            </Button>
          </div>
        </div>
      </section>
      
        <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-3xl font-bold">How It <span className="text-primary">Works</span></h2>
                 <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our streamlined process for commercial rehab financing.</p>
                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {processSteps.map((step, index) => (
                        <Card key={index} className="text-center p-6 border-t-4 border-primary">
                            <div className="flex justify-center mb-4">{step.icon}</div>
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-muted-foreground mt-2">{step.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    </div>
  );
}
