
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Target, Users, Handshake } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const values = [
    {
        icon: <Target className="h-8 w-8 text-primary"/>,
        title: "Integrity",
        description: "We operate with the highest level of honesty and transparency in all our dealings."
    },
    {
        icon: <Users className="h-8 w-8 text-primary"/>,
        title: "Client-Centric",
        description: "Our clients' success is our success. We are dedicated to finding the best solutions for their needs."
    },
    {
        icon: <Handshake className="h-8 w-8 text-primary"/>,
        title: "Partnership",
        description: "We believe in building long-term relationships based on trust and mutual respect."
    }
]

export default function AboutUsPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
            <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">About <Logo className="h-auto w-48 inline-block align-bottom" /></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Your dedicated partner in achieving financial growth and success.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold text-primary">Our Mission</h2>
            <p className="mt-4 max-w-4xl mx-auto text-lg text-foreground/70">
                At Lankford Capital, our mission is to empower real estate investors and business owners by providing them with the flexible, innovative, and reliable financing they need to thrive. We are committed to streamlining the lending process, fostering long-term partnerships, and contributing to the growth of the communities we serve.
            </p>
        </div>
         <div className="container mx-auto px-4 mt-16">
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
                <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_2014536932.jpg?alt=media&token=0f9f98aa-3be5-4a28-8e24-377e1977e80e" alt="A modern office interior with business people meeting" layout="fill" objectFit="cover" data-ai-hint="business meeting" />
            </div>
        </div>
      </section>

      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="font-headline text-3xl font-bold text-primary">Our Core Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                {values.map(value => (
                    <Card key={value.title} className="p-6">
                        <div className="flex justify-center mb-4">{value.icon}</div>
                        <h3 className="font-headline text-xl font-semibold">{value.title}</h3>
                        <p className="mt-2 text-muted-foreground">{value.description}</p>
                    </Card>
                ))}
            </div>
        </div>
      </section>
      
       <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold">Ready to Build with Us?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
            Let's discuss how our financing solutions can help you achieve your next big goal.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
