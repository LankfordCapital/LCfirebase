
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown, Building, Wrench, Warehouse, LandPlot, Layers, Truck, Handshake, Factory, LayoutDashboard } from 'lucide-react';
import { Logo } from '@/components/logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

const lendingProducts = [
  { href: '/lending/residential-noo', label: 'Residential NOO', icon: Building },
  { href: '/lending/commercial', label: 'Commercial', icon: Wrench },
  { href: '/lending/industrial', label: 'Industrial', icon: Factory },
  { href: '/lending/land-acquisition', label: 'Land Acquisition', icon: LandPlot },
  { href: '/lending/mezzanine-loans', label: 'Mezzanine Loans', icon: Layers },
  { href: '/lending/mobilization-funding', label: 'Mobilization Funding', icon: Truck },
  { href: '/lending/equipment-financing', label: 'Equipment Financing', icon: Truck },
];

const mainNav: { href: string, label: string }[] = [
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="font-headline text-2xl tracking-tight flex items-baseline gap-1">
            <Logo />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-semibold">
                Lending Products <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {lendingProducts.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'font-semibold transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
           <Button asChild className="text-black hover:bg-primary/90">
              <Link href="/broker">For Brokers</Link>
            </Button>
        </nav>

        <div className="hidden md:flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <LayoutDashboard className="mr-2"/>
                Dashboards
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    Borrower Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/broker-office">
                    Broker Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/workforce-office">
                    Workforce Dashboard
                  </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="sr-only">
                <SheetTitle>Main Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <div className="font-headline text-2xl tracking-tight flex items-baseline gap-1">
                    <Logo />
                  </div>
                </Link>
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold">Lending Products</h3>
                  {lendingProducts.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <hr/>
                   {mainNav.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="font-bold"
                        onClick={() => setIsOpen(false)}
                    >
                        {item.label}
                    </Link>
                    ))}
                    <Link href="/broker" className="font-bold" onClick={() => setIsOpen(false)}>For Brokers</Link>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                   <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/auth/signin">Borrower Sign In</Link>
                  </Button>
                   <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/auth/broker-signin">Broker Sign In</Link>
                  </Button>
                  <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/auth/workforce-signin">Workforce Sign In</Link>
                  </Button>
                  <Button asChild onClick={() => setIsOpen(false)}>
                    <Link href="/dashboard">Borrower Dashboard</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
