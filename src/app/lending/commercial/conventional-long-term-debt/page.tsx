
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const features = [
    "Long-term financing for stabilized commercial properties",
    "Competitive fixed and variable interest rates",
    "Amortization periods up to 30 years",
    "Purchase or refinance options",
    "Suitable for a wide range of commercial property types",
    "Access to hundreds of banks and debt funds",
    "5, 7, or 10 year fixed rate terms",
    "Up to 80% for purchase or rate/term refinancing",
    "Up to 75% for cash-out refinancing",
    "Full documentation required",
    "660 minimum FICO Score"
];

export default function CommercialConventionalLongTermDebtPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_3525275841.mp4?alt=media&token=554c4738-d0b9-4b7b-bbad-c935a01d7fdb" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-5xl"><span className="text-white">Conventional</span><span className="text-primary"> / Long Term Debt</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Stable, reliable financing for your income-producing assets.
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
            <h2 className="font-headline text-3xl font-bold"><span className="text-primary">Secure Your Investment for the </span><span className="text-foreground">Long Haul</span></h2>
            <p className="mt-4 text-lg text-foreground/70">
                For stabilized, income-generating commercial properties, our conventional and long-term debt solutions provide the stability you need. Secure competitive rates and favorable terms to maximize your cash flow and hold your assets for the long term.
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
    </div>
  );
}
