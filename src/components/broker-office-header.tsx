'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BrokerOfficeHeader() {
  const { user, logOut } = useAuth();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = [
    { href: '/broker-office', label: 'Pipeline' },
    { href: '/broker-office/documents', label: 'New Application' },
  ];

  if (!isClient) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <div className="h-6 w-32 rounded-md bg-muted animate-pulse"></div>
                    <div className="hidden md:flex items-center gap-6">
                        <div className="h-5 w-20 rounded-md bg-muted animate-pulse"></div>
                        <div className="h-5 w-20 rounded-md bg-muted animate-pulse"></div>
                    </div>
                </div>
                <div className="flex items-center gap-2 h-10">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                    <div className="hidden md:block h-5 w-24 rounded-md bg-muted animate-pulse"></div>
                </div>
            </div>
        </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="font-headline text-2xl tracking-tight flex items-baseline gap-1">
                <Logo />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL || "https://placehold.co/40x40.png"} alt="@broker" />
                        <AvatarFallback>{user?.displayName?.charAt(0) || 'B'}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline font-semibold">{user?.displayName || 'Broker'}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile">
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
        </div>
      </div>
    </header>
  );
}