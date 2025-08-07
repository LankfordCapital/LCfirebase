
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check, FileText, GanttChartSquare, TrendingUp, CheckCircle } from "lucide-react";

const features = [
    "Rates starting at 9.5% and 2 points",
    "Minimum FICO score of 650",
    "No experience required",
    "Up to 70% of the as-is market value",
    "Loan amounts from $100,000 to $3.5M (case-by-case for higher)",
    "Fast funding for time-sensitive acquisitions",
    "Short-term financing from 12-24 months",
    "Interest-only payments to maximize cash flow",
    "Clear path to permanent financing"
];

const processSteps = [
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Submit Deal",
        description: "Provide the property and deal information in our simple application."
    },
    {
        icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
        title: "Get Terms",
        description: "Receive a competitive term sheet from us within 24-48 hours."
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: "Underwriting & Approval",
        description: "Our in-house team quickly processes your file for a final approval."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Fund & Close",
        description: "Close your loan quickly and secure your next investment property."
    }
];

export default function ResidentialNOOBridgePage() {
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
            <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_3655280819.mp4?alt=media&token=f0020949-ec41-4aae-8606-966abcf8e776" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl"><span className="text-white">Residential NOO</span> <span className="text-primary">Bridge Lending</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Bridge the gap to your next residential investment property.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Secure Opportunities Quickly</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Our Residential NOO (Non-Owner Occupied) Bridge Loans provide fast, short-term financing to help investors seize opportunities quickly. Whether you're acquiring a new property before long-term financing is in place or need to close a deal fast, our bridge loans provide the capital you need.
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
              <Link href="/dashboard">Apply for a Bridge Loan</Link>
            </Button>
          </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x400.png" alt="House keys on a blueprint" layout="fill" objectFit="cover" data-ai-hint="house investment" />
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-3xl font-bold">How It <span className="text-primary">Works</span></h2>
                 <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our bridge loan process is designed for speed and efficiency to help you secure properties fast.</p>
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
