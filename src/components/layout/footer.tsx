

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Facebook } from 'lucide-react';
import Image from 'next/image';

const lendingProducts1 = [
    { href: '/lending/residential-NOO', label: 'Residential NOO' },
    { href: '/lending/commercial', label: 'Commercial' },
    { href: '/lending/industrial', label: 'Industrial' },
    { href: '/lending/land-acquisition', label: 'Land Acquisition' },
];

const lendingProducts2 = [
    { href: '/lending/mezzanine-loans', label: 'Mezzanine Loans' },
    { href: '/lending/mobilization-funding', label: 'Mobilization Funding' },
    { href: '/lending/equipment-financing', label: 'Equipment Financing' },
]

export function Footer() {
  return (
    <footer className="bg-primary/5 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
            <Link href="/">
              <Logo className="h-auto w-48" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Your trusted partner in financial growth.
            </p>
            <div className="mt-4 flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
               <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        <div className="mt-8 pt-8 border-t grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="md:col-span-1">
              <div>
                <h3 className="font-headline font-semibold text-primary">Lending</h3>
                  <ul className="mt-4 space-y-2">
                      {lendingProducts1.map(item => (
                           <li key={item.href}><Link href={item.href} className="text-sm text-muted-foreground hover:text-primary">{item.label}</Link></li>
                      ))}
                  </ul>
              </div>
          </div>
           <div className="md:col-span-1">
              <h3 className="font-headline font-semibold text-primary invisible">More</h3>
               <ul className="mt-4 space-y-2">
                  {lendingProducts2.map(item => (
                       <li key={item.href}><Link href={item.href} className="text-sm text-muted-foreground hover:text-primary">{item.label}</Link></li>
                  ))}
              </ul>
          </div>
           <div>
            <h3 className="font-headline font-semibold text-primary">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/broker" className="text-sm text-muted-foreground hover:text-primary">For Brokers</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-headline font-semibold text-primary">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <div className="flex justify-center mb-4">
            <Image src="https://firebasestorage.googleapis.com/v0/b/lankford-lending.firebasestorage.app/o/Lankford%20Capital%20Icon%20Mark%20Gold.png?alt=media&token=a7a05b83-1979-43a4-a431-511e4d8b71f5" alt="Lankford Capital Icon" width={40} height={40} />
          </div>
          <p>&copy; {new Date().getFullYear()} Lankford Capital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
