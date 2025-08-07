
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Zap, Handshake, GaugeCircle } from "lucide-react";

const benefits = [
    {
        icon: <Zap className="h-8 w-8 text-primary"/>,
        title: "Fast Closings",
        description: "Our streamlined process and dedicated broker support mean faster closings for your clients.",
    },
    {
        icon: <Handshake className="h-8 w-8 text-primary"/>,
        title: "Competitive Commissions",
        description: "We value our partners and offer attractive commission structures for your hard work.",
    },
    {
        icon: <GaugeCircle className="h-8 w-8 text-primary"/>,
        title: "Broad Product Suite",
        description: "Access our full range of lending products to find the perfect fit for any client scenario.",
    }
]

export default function BrokerPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_1098239155.mp4?alt=media&token=40066233-852b-4fb5-bad0-dcdef71de9a8" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-white md:text-5xl">Partner with <span className="text-primary">Lankford Capital</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Expand your offerings and close more deals by partnering with a trusted, efficient, and reliable lender.
          </p>
           <Button asChild size="lg" className="mt-8">
              <Link href="/auth/broker-signin">Broker Login</Link>
            </Button>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="font-headline text-3xl font-bold text-primary">The Lankford <span className="text-foreground">Advantage</span> for Brokers</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                {benefits.map(benefit => (
                    <Card key={benefit.title} className="p-6">
                        <div className="flex justify-center mb-4">{benefit.icon}</div>
                        <h3 className="font-headline text-xl font-semibold">{benefit.title}</h3>
                        <p className="mt-2 text-muted-foreground">{benefit.description}</p>
                    </Card>
                ))}
            </div>
        </div>
      </section>

       <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold">Ready to Join Our Broker Network?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
            Register today to get access to our broker portal, submit deals, and track your pipeline.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <Link href="/auth/signup?role=broker">Register as a Broker</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
