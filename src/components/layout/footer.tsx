
'use client'

import { usePathname } from 'next/navigation';
import { Logo } from '../logo';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const footerLinks = [
    {
        title: 'Lending',
        links: [
            { href: '/lending/residential-noo', label: 'Residential NOO' },
            { href: '/lending/commercial', label: 'Commercial' },
            { href: '/lending/industrial', label: 'Industrial' },
        ]
    },
    {
        title: 'Company',
        links: [
            { href: '/about', label: 'About Us' },
            { href: '/contact', label: 'Contact' },
        ]
    },
    {
        title: 'Legal',
        links: [
            { href: '/privacy-policy', label: 'Privacy Policy' },
            { href: '/terms-of-service', label: 'Terms of Service' },
        ]
    }
]

export default function Footer() {
  const pathname = usePathname();

  const noFooterPaths = [
      '/dashboard',
      '/broker-office',
      '/workforce-office',
      '/auth'
  ];

  const shouldHideFooter = noFooterPaths.some(path => pathname.startsWith(path));

  if (shouldHideFooter) {
    return null;
  }

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="col-span-1 md:col-span-4 lg:col-span-2 space-y-4">
                <Logo />
                <p className="text-sm text-secondary-foreground/70">
                    Your trusted partner in innovative and reliable financing solutions for real estate and business ambitions.
                </p>
            </div>
            {footerLinks.map(section => (
                 <div key={section.title}>
                    <h3 className="font-semibold text-secondary-foreground/90">{section.title}</h3>
                    <ul className="mt-4 space-y-2">
                        {section.links.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
             <div className="md:col-span-2 lg:col-span-2">
                 <h3 className="font-semibold text-secondary-foreground/90">Stay Updated</h3>
                 <p className="text-sm text-secondary-foreground/70 mt-4">Subscribe to our newsletter for the latest market insights.</p>
                 <div className="flex gap-2 mt-4">
                    <Input type="email" placeholder="Enter your email" className="bg-background/20 border-border/50 placeholder:text-secondary-foreground/50"/>
                    <Button variant="primary">Subscribe</Button>
                 </div>
            </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/20 text-center text-sm text-secondary-foreground/60">
            <p>&copy; {new Date().getFullYear()} Lankford Capital. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
