
import { InquiryForm } from '@/components/inquiry-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
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
          <source src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/shutterstock_3764499001.mp4?alt=media&token=9ba8f5e0-aa88-4346-ae4f-a1ad32931704" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">Get in <span className="text-white">Touch</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
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
                    <p className="text-muted-foreground">12747 Olive Blvd<br/>ste 300a<br/>Saint Louis, Missouri 63141<br/>United States</p>
                </div>
             </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">Info@lankfordcapital.com</p>
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
            <Card className="relative p-6 sm:p-8 shadow-lg overflow-hidden">
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5"
                    alt="Lankford Capital Icon"
                    width={48}
                    height={48}
                    className="absolute top-4 right-4"
                />
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
