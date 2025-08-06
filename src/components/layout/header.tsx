
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Mountain } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Logo } from '../logo';
import React from 'react';

const lendingLinks: { title: string; href: string; description: string }[] = [
  {
    title: 'Residential NOO',
    href: '/lending/residential-noo',
    description: 'Financing for non-owner occupied 1-4 unit investment properties.',
  },
  {
    title: 'Commercial',
    href: '/lending/commercial',
    description: 'Loans for a variety of commercial real estate assets.',
  },
  {
    title: 'Industrial',
    href: '/lending/industrial',
    description: 'Specialized financing for warehouses and manufacturing facilities.',
  },
   {
    title: 'Land Acquisition',
    href: '/lending/land-acquisition',
    description: 'Funding for the purchase and development of land.',
  },
  {
    title: 'Mezzanine Loans',
    href: '/lending/mezzanine-loans',
    description: 'Hybrid debt and equity financing to bridge funding gaps.',
  },
  {
    title: 'Equipment Financing',
    href: '/lending/equipment-financing',
    description: 'Secure funding for essential business equipment and machinery.',
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/broker', label: 'Brokers' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
                <NavigationMenuItem>
                <NavigationMenuTrigger>Lending</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {lendingLinks.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {navLinks.map((link) => (
                 <NavigationMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior={false} passHref>
                        <NavigationMenuLink active={pathname === link.href} className={navigationMenuTriggerStyle()}>
                            {link.label}
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2">
                    <Logo />
                </Link>
                <nav className="grid gap-4">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={cn("text-lg font-medium", pathname === link.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                            {link.label}
                        </Link>
                    ))}
                </nav>
                 <div className="mt-auto flex flex-col gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard">Get Started</Link>
                    </Button>
                </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
