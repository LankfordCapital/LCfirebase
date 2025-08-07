
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Award, Users, Map, GanttChartSquare, FileText, Check, StepForward, TrendingUp, Bot } from "lucide-react";

const features = [
    { text: "Property Type: Residential (1-4 units)" },
    { text: "Borrower Type: Investors only (NOO)" },
    { text: "Loan Amounts: $100,000 – $5,000,000" },
    { text: "Max LTC: 85%" },
    { text: "Max ARV: 70%" },
    { text: "Interest Only Terms: 12–18 months" },
    { text: "Draw Schedule: Structured based on project milestones" },
    { text: "States: Nationwide, except ND/SD/VT" },
];

const processSteps = [
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Submit Plan",
        description: "Submit your property details and construction plan through our streamlined application."
    },
    {
        icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
        title: "Get Terms",
        description: "Receive a competitive term sheet from our lending specialists within 48 hours."
    },
    {
        icon: <Check className="h-8 w-8 text-primary" />,
        title: "Underwriting & Approval",
        description: "Our team conducts a thorough review of the project and borrower qualifications."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Fund & Build",
        description: "Receive your funds and begin construction, supported by our expert draw process."
    }
];

const eligibility = [
    { text: "Experienced builder/investor or have a verified GC partner." },
    { text: "Licensed plans and all necessary permits required." },
    { text: "Minimum personal credit score of 660+ for all guarantors." },
    { text: "Clean title review and satisfactory appraisal." }
]

const whyUs = [
    { title: "Fast Closings", description: "Our dedicated in-house underwriters ensure a swift and efficient closing process." },
    { title: "Expert Draw Support", description: "We provide reliable and timely construction draw support to keep your project on schedule." },
    { title: "Flexible Guidelines", description: "We offer flexible terms and creative solutions for experienced investors and builders." },
    { title: "National Footprint", description: "Lending in 47 states to support your projects wherever they are." }
];

const faqs = [
    {
        question: "Can I apply without a General Contractor selected?",
        answer: "While it's highly recommended to have your GC selected, you can start the application process. However, a signed GC contract will be required before closing."
    },
    {
        question: "What are the key documents required for this loan?",
        answer: "You will typically need architectural plans, a detailed construction budget, permits, a GC contract, and personal financial documents for all sponsors."
    },
    {
        question: "How are construction draws managed?",
        answer: "Draws are released based on project milestones outlined in the draw schedule. We require inspections to verify completed work before releasing funds to ensure the project stays on track."
    },
    {
        question: "Can I finance the land acquisition with this loan?",
        answer: "Yes, in many cases, the land acquisition can be included in the ground-up construction loan, subject to LTV/LTC requirements and project feasibility."
    }
];

export default function ResidentialNOOConstructionPage() {
  return (
    <div>
        <section className="relative h-[60vh] flex items-center justify-center text-white py-20 md:py-28" id="top">
            <Image
                src="https://placehold.co/1920x1080.png"
                alt="Modern residential house under construction"
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                data-ai-hint="construction site"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
            <div className="container relative z-20 mx-auto px-4 text-center">
                <h1 className="font-headline text-4xl font-bold md:text-6xl">Residential Ground-Up Construction Financing</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-white/90">
                    Flexible, fast funding for builders and investors developing new residential properties.
                </p>
                <Button asChild size="lg" className="mt-8">
                    <Link href="/dashboard/application">Apply Now</Link>
                </Button>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="font-headline text-3xl font-bold text-primary">Program Overview</h2>
                    <p className="mt-4 text-lg text-foreground/70">
                        Our Non-Owner Occupied construction loans are tailored for 1-4 unit residential projects. We provide the capital needed to take your project from blueprint to a completed, market-ready property.
                    </p>
                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                                <span>{feature.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-3xl font-bold">How It <span className="text-primary">Works</span></h2>
                 <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Our process is designed for speed and efficiency, getting you from application to groundbreaking faster.</p>
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

         <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                     <h2 className="font-headline text-3xl font-bold">Eligibility <span className="text-primary">Criteria</span></h2>
                     <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">We partner with qualified investors and builders. Here’s what we look for:</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {eligibility.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <Check className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24">
             <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
                  <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
                    <Image src="https://placehold.co/600x400.png" alt="A team of professionals in a meeting" layout="fill" objectFit="cover" data-ai-hint="team meeting" />
                </div>
                <div>
                    <h2 className="font-headline text-3xl font-bold">Why <span className="text-primary">Lankford Lending?</span></h2>
                    <div className="mt-6 space-y-6">
                        {whyUs.map((item, index) => (
                            <div key={index}>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-muted-foreground mt-1">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

         <section className="bg-primary text-primary-foreground py-20 md:py-28">
            <div className="container mx-auto px-4 text-center">
                 <Bot className="h-12 w-12 mx-auto mb-4" />
                <blockquote className="text-2xl font-semibold max-w-3xl mx-auto">
                    “Lankford’s construction loan was a game-changer for our 4-unit project. The draw process was smooth, and their team was always available. We closed on time and under budget.”
                </blockquote>
                <p className="mt-4 text-lg font-medium">- Alex R., Real Estate Developer</p>
            </div>
        </section>
        
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                 <h2 className="font-headline text-3xl font-bold text-center mb-8">Frequently Asked <span className="text-primary">Questions</span></h2>
                 <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
            </div>
        </section>
        
        <section className="py-20 bg-primary/5" id="apply">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-headline text-4xl font-bold">Ready to <span className="text-primary">Build?</span></h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Let's get your next project off the ground. Start your application today to receive a personalized term sheet.</p>
                <Button asChild size="lg" className="mt-8">
                    <Link href="/dashboard/application">Start My Application</Link>
                </Button>
            </div>
        </section>

    </div>
  );
}
