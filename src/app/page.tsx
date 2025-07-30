

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building,
  Wrench,
  Warehouse,
  LandPlot,
  Layers,
  Truck,
  Handshake,
  Factory,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { InquiryForm } from '@/components/inquiry-form';
import { Logo } from '@/components/logo';

const loanProducts = [
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: 'Residential NOO',
    description: 'Financing for non-owner occupied residential properties.',
    href: '/lending/residential-noo',
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: 'Commercial Lending',
    description: 'Loans for commercial real estate projects and businesses.',
    href: '/lending/commercial',
  },
  {
    icon: <Factory className="h-8 w-8 text-primary" />,
    title: 'Industrial Lending',
    description: 'Specialized financing for industrial properties and facilities.',
    href: '/lending/industrial',
  },
  {
    icon: <LandPlot className="h-8 w-8 text-primary" />,
    title: 'Land Acquisition',
    description: 'Funding for the purchase and development of land.',
    href: '/lending/land-acquisition',
  },
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: 'Mezzanine Loans',
    description: 'Flexible, hybrid debt and equity financing solutions.',
    href: '/lending/mezzanine-loans',
  },
  {
    icon: <Truck className="h-8 w-8 text-primary" />,
    title: 'Equipment Financing',
    description: 'Secure funding for essential business equipment and machinery.',
    href: '/lending/equipment-financing',
  },
  {
    icon: <Handshake className="h-8 w-8 text-primary" />,
    title: 'For Brokers',
    description: 'Partner with us to provide your clients with top-tier financing.',
    href: '/broker',
  },
];

const whyChooseUs = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-accent" />,
    title: 'Trusted Expertise',
    description: 'Our seasoned team brings decades of financial experience to secure the best terms for your projects.',
  },
  {
    icon: <Zap className="h-10 w-10 text-accent" />,
    title: 'Fast & Flexible',
    description: 'We streamline the lending process with innovative technology and flexible solutions tailored to your needs.',
  },
  {
    icon: <Users className="h-10 w-10 text-accent" />,
    title: 'Partners in Growth',
    description: 'We are more than a lender; we are your strategic partner, invested in your long-term success.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_3599048629.mp4?alt=media&token=a42649e7-9a18-4028-b277-b60390039ee2" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Building Futures, <span className="text-primary">Funding Dreams</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-white/90 md:text-xl">
            Lankford Capital provides tailored, innovative financing solutions to power your real estate and business ambitions.
            From ground-up construction to strategic acquisitions, we are your dedicated financial partner.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-semibold">
              <Link href="/lending/commercial">Explore Loans</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
              <span className="text-foreground">Comprehensive</span> Lending Solutions
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/70">
              We offer a diverse range of loan products to meet the unique needs of every client.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loanProducts.map((product) => (
              <Card key={product.title} className="group transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-col items-start gap-4">
                  {product.icon}
                  <CardTitle className="font-headline text-xl">{product.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                   <Button variant="link" asChild className="p-0 font-semibold text-primary group-hover:text-accent">
                    <Link href={product.href}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Why <span className="text-foreground">Partner</span> with Lankford Capital?</h2>
              <p className="mt-4 text-lg text-foreground/70">
                Choosing the right lender is crucial. We combine cutting-edge technology with personalized service to deliver unparalleled results.
              </p>
              <div className="mt-8 space-y-6">
                {whyChooseUs.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                      <p className="mt-1 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-80 lg:h-full w-full rounded-lg overflow-hidden shadow-2xl">
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/shutterstock_2142010187.jpg?alt=media&token=e0145a4a-dd04-445c-ba23-e764980f713e"
                    alt="Business meeting about financing"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="financial meeting"
                />
            </div>
          </div>
        </div>
      </section>

      <section id="inquiry" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Ready to Start Your Next Project?</h2>
              <p className="mt-4 text-lg text-foreground/70">
                Let's discuss your financing needs. Fill out our inquiry form for a prompt, no-obligation consultation with one of our lending specialists. We're here to help you achieve your goals.
              </p>
               <div className="mt-8 text-sm text-muted-foreground">
                <p>For immediate assistance, you can also use our AI Assistant chat in the bottom right corner.</p>
              </div>
            </div>
             <Card className="p-6 sm:p-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Submit an Inquiry</CardTitle>
                </CardHeader>
                <CardContent>
                  <InquiryForm />
                </CardContent>
              </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
