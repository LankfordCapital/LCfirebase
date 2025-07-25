import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary/5 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/">
              <Logo className="h-10 w-auto" />
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
          <div>
            <h3 className="font-headline font-semibold text-primary">Lending</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/lending/residential-noo" className="text-sm text-muted-foreground hover:text-primary">Residential NOO</Link></li>
              <li><Link href="/lending/commercial" className="text-sm text-muted-foreground hover:text-primary">Commercial</Link></li>
              <li><Link href="/lending/industrial" className="text-sm text-muted-foreground hover:text-primary">Industrial</Link></li>
              <li><Link href="/lending/sba-loans" className="text-sm text-muted-foreground hover:text-primary">SBA Loans</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-headline font-semibold text-primary">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/broker" className="text-sm text-muted-foreground hover:text-primary">For Brokers</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
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
          <p>&copy; {new Date().getFullYear()} Lankford Capital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
