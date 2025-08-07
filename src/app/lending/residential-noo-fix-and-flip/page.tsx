
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check, FileText, GanttChartSquare, TrendingUp } from "lucide-react";

const features = [
    "Minimum FICO score of 650",
    "No experience required; better terms with more completed deals",
    "Rates starting at 9.5% and 1.5 points",
    "Terms from 12-24 months with no prepayment penalty",
    "Rehab budgets can exceed purchase price",
    "Close in as little as 10 days",
    "Financing for single-family, 2-4 units, condos, and townhomes",
    "Loan amounts from $100,000 to $3.5M (case-by-case for higher)",
    "1st lien position required",
    "Purchase and refinance options available"
];

const processSteps = [
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Submit Deal",
        description: "Provide property details and your rehab budget in our simple application."
    },
    {
        icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
        title: "Get Terms",
        description: "Receive a competitive term sheet from us within 24-48 hours."
    },
    {
        icon: <Check className="h-8 w-8 text-primary" />,
        title: "Underwriting & Approval",
        description: "Our in-house team quickly processes your file for a final approval."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Fund & Flip",
        description: "Close your loan quickly, get your funding, and start your renovation."
    }
];

export default function ResidentialNOOFixAndFlipPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_3707052671.mp4?alt=media&token=f40dd8b7-4cde-4a0a-94f1-51c2b399226d" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            <span className="text-white">Fix and Flip</span> <span className="text-primary">Loans</span>
            </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Capitalize on your next renovation project with our flexible financing.
          </p>
           <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/dashboard/application">Apply Now</Link>
                </Button>
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold"><span className="text-foreground">Fix and Flip</span> <span className="text-primary">Lending</span></h2>
            <p className="mt-4 text-lg text-foreground/70">
              Our Fix and Flip loans provide real estate investors with the short-term financing needed to purchase and renovate properties. With competitive leverage and interest-only payment structures, we empower you to maximize your returns and move quickly in a competitive market.
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
              <Link href="/dashboard">Fund Your Flip</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-3xl font-bold">How It <span className="text-primary">Works</span></h2>
                 <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our process is designed for speed and efficiency, getting you from application to your project faster.</p>
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
