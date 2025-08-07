
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check, FileText, GanttChartSquare, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";


const features = [
    "Long-term financing for stabilized industrial properties",
    "Competitive fixed and variable interest rates",
    "Amortization periods up to 30 years",
    "Purchase or refinance options",
    "Suitable for a wide range of industrial property types",
];

const processSteps = [
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Submit Application",
        description: "Provide your property's financials and your personal information through our secure portal."
    },
    {
        icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
        title: "Initial Underwriting",
        description: "Our team will review your submission and provide a preliminary term sheet."
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: "Full Approval",
        description: "We'll work with you to gather final documentation for a full loan approval."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Close & Fund",
        description: "Finalize your long-term financing and secure your investment for the future."
    }
];

export default function IndustrialLongTermDebtPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_32053879.mp4?alt=media&token=e4382511-9498-47ac-ae92-9bd2e6cc99dc" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl font-bold md:text-5xl"><span className="text-white">Industrial</span> <span className="text-primary">Long Term Debt</span></h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
                Stable, reliable financing for your income-producing industrial assets.
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
            <h2 className="font-headline text-3xl font-bold"><span className="text-primary">Secure Your Investment for the </span><span className="text-black">Long Haul</span></h2>
            <p className="mt-4 text-lg text-foreground/70">
                For stabilized, income-generating industrial properties, our conventional and long-term debt solutions provide the stability you need. Secure competitive rates and favorable terms to maximize your cash flow and hold your industrial assets for the long term.
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
              <Link href="/dashboard">Explore Long Term Options</Link>
            </Button>
          </div>
        </div>
      </section>
      
       <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-3xl font-bold">How It <span className="text-primary">Works</span></h2>
                 <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our streamlined process for long-term debt financing.</p>
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
