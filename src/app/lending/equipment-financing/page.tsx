
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Financing for a wide range of new and used equipment",
    "Competitive rates and flexible repayment terms",
    "Potential tax advantages through Section 179",
    "Preserve working capital for other business needs",
    "Simple and fast application process",
    "Leasing or a Loan Available",
    "Up to 97% of the purchase price available",
    "Minimum FICO Score of 660",
    "Low-doc, full-doc, and application-only options",
    "Fast approvals and funding"
];

export default function EquipmentFinancingPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_1056483272.mp4?alt=media&token=fa398116-1dce-44a1-a705-fcef667bcca1" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl">
            <span className="text-primary">Equipment</span> <span className="text-white">Financing</span>
            </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Acquire the tools you need to grow your business.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Power Your Operations</h2>
            <p className="mt-4 text-lg text-foreground/70">
                Don't let a lack of equipment hold your business back. Our equipment financing and leasing options make it easy to acquire the machinery, vehicles, or technology you need with manageable payments, helping you scale operations and increase efficiency.
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
              <Link href="/dashboard">Finance Your Equipment</Link>
            </Button>
          </div>
           <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
             <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_2164656897.jpg?alt=media&token=8194891b-517e-43ec-b10a-7b2382e592d0" alt="Heavy construction equipment on a worksite" layout="fill" objectFit="cover" data-ai-hint="heavy equipment" />
          </div>
        </div>
      </section>
    </div>
  );
}
