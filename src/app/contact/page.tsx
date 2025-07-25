
import { InquiryForm } from '@/components/inquiry-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div>
      <section className="relative bg-primary/5 py-20 md:py-28 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Get in Touch</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            We're here to help with all your financing needs. Contact us today.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
             <h2 className="font-headline text-3xl font-bold text-primary">Contact Information</h2>
             <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold">Our Office</h3>
                    <p className="text-muted-foreground">123 Lending Lane<br/>Finance City, ST 54321</p>
                </div>
             </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">Underwriting@lankfordcapital.com</p>
                </div>
             </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">888-708-6146</p>
                </div>
             </div>
          </div>
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Send Us a Message</CardTitle>
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
