
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check, FileText, GanttChartSquare, TrendingUp, Calculator, CheckCircle } from "lucide-react";

const features = [
    "No personal income or DTI calculations required",
    "Qualify based on the property's cash flow",
    "Loans for purchase, rate/term refinance, and cash-out refinance",
    "Financing for short-term and long-term rental properties",
    "Streamlined process for experienced investors",
    "650 Minimum FICO",
    "Portfolio loans available",
    "Low DSCR requirements of 1.15",
    "Up to 80% LTV for purchases and rate/term refinances",
    "Up to 75% LTV for cash-out refinances",
    "Quick closings in 2-3 weeks",
    "Vacant properties OK (if leased within 90 days)",
    "Experience preferred but not required"
];

const processSteps = [
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Submit Property Info",
        description: "Provide the property details and rental information for our team to analyze."
    },
    {
        icon: <Calculator className="h-8 w-8 text-primary" />,
        title: "Cash Flow Analysis",
        description: "We qualify the loan based on the property's Debt Service Coverage Ratio."
    },
    {
        icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
        title: "Appraisal & Title",
        description: "Our team orders the necessary third-party reports for underwriting."
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: "Close & Fund",
        description: "Finalize your loan and receive funding to grow your rental portfolio."
    }
];

export default function ResidentialNOODscrPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_3842048639.mp4?alt=media&token=28ff7e1a-7ff8-4c55-b3e3-070a548947f0" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl"><span className="text-white">DSCR Loans</span> <span className="text-primary">for Investors</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Secure financing based on your property's income potential, not your personal income.
          </p>
           <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/auth/signup">Apply Now</Link>
                </Button>
            </div>
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
            <h2 className="font-headline text-3xl font-bold"><span className="text-primary">Invest with</span> <span className="text-black">Intelligence</span></h2>
            <p className="mt-4 text-lg text-foreground/70">
              Our Debt Service Coverage Ratio (DSCR) loans are the perfect tool for savvy real estate investors. We assess loan eligibility based on the property's ability to generate enough income to cover its debt obligations. This approach simplifies the loan process and allows you to scale your rental portfolio more effectively.
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
              <Link href="/dashboard">Get a DSCR Loan</Link>
            </Button>
          </div>
        </div>
      </section>

       <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-3xl font-bold">How It <span className="text-primary">Works</span></h2>
                 <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our DSCR loan process focuses on the property's performance for a faster, simpler experience.</p>
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
