
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check, FileText, GanttChartSquare, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
    "Financing for property acquisition and renovation costs",
    "Ideal for value-add and repositioning strategies",
    "Cover both hard and soft costs for expansion or modernization",
    "Flexible terms for various project scopes",
    "Increase efficiency and capacity of your facilities",
];

const processSteps = [
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Submit Plan",
        description: "Provide the property details and your renovation/expansion plan."
    },
    {
        icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
        title: "Underwriting & Valuation",
        description: "We assess the project's feasibility and after-renovation value (ARV)."
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: "Loan Approval",
        description: "Receive a competitive term sheet for your industrial rehab project."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Fund & Renovate",
        description: "Close the loan and begin your renovation with structured funding draws."
    }
];


export default function IndustrialRehabExpansionLoansPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_1101919271.mp4?alt=media&token=4a2f076e-7f73-4796-8edd-57f973f7ebd6" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl"><span className="text-primary">Industrial</span> <span className="text-white">Rehab & Expansion Loans</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Funding the transformation and growth of your industrial properties.
          </p>
           <Button asChild size="lg" className="mt-8">
              <Link href="/dashboard/application">Apply Now</Link>
            </Button>
        </div>
        <Image
            src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5"
            alt="Lankford Capital Icon"
            width={64}
            height={64}
            className="absolute bottom-4 right-4 z-20"
        />
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Unlock Your Property's Potential</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Our industrial rehab and expansion loans are designed for businesses looking to renovate, modernize, or expand their facilities. Whether you're upgrading machinery, adding square footage, or improving logistics, we provide the necessary capital to boost your property's value and operational efficiency.
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
              <Link href="/dashboard">Finance Your Project</Link>
            </Button>
          </div>
        </div>
      </section>

       <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-3xl font-bold">How It <span className="text-primary">Works</span></h2>
                 <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our streamlined process for industrial rehab and expansion financing.</p>
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
