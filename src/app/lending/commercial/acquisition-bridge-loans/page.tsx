import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check, FileText, GanttChartSquare, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
    "Fast access to capital for time-sensitive acquisitions",
    "Bridge financing gaps between purchase and long-term loans",
    "Solutions for complex or non-traditional transactions",
    "Flexible terms tailored to your specific needs",
    "Interest-only payment options available",
    "Minimum 660 FICO",
    "'Make sense' lending at its best",
    "Up to 80% of purchase (90% with mezzanine)",
    "Flexible and fast execution",
    "Competitive interest rates"
];

const processSteps = [
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Submit Deal",
        description: "Provide the property and transaction details through our simple online application."
    },
    {
        icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
        title: "Get Terms",
        description: "Receive a competitive term sheet from our lending specialists within 24-48 hours."
    },
    {
        icon: <CheckCircle className="h-8 w-8 text-primary" />,
        title: "Underwriting & Approval",
        description: "Our in-house team quickly processes your file for a final approval and closing."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Fund & Acquire",
        description: "Close your loan quickly and secure your next investment property without delay."
    }
];

export default function CommercialAcquisitionBridgeLoansPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_1064717512.mp4?alt=media&token=e79ba4f3-911a-45c2-8bce-d92b2bdd0571" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl"><span className="text-primary">Acquisition & </span><span className="text-white">Bridge Loans</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Seize opportunities with fast and flexible short-term financing.
          </p>
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
            <h2 className="font-headline text-3xl font-bold text-primary">Move Quickly and Confidently</h2>
            <p className="mt-4 text-lg text-foreground/70">
                In the fast-paced world of commercial real estate, speed is critical. Our acquisition and bridge loans provide the short-term capital needed to acquire properties quickly, execute on a business plan, or bridge a gap until permanent financing is secured.
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
              <Link href="/dashboard">Secure a Bridge Loan</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-3xl font-bold">How It <span className="text-primary">Works</span></h2>
                 <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our streamlined process for acquisition and bridge financing.</p>
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
