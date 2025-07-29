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
import { LayoutDashboard, FileText, UserCircle, LogOut, ChevronDown, Menu } from 'lucide-react';
import { Logo } from '@/components/logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function BorrowerDashboardHeader() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/documents', label: 'New Application', icon: FileText },
    { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
           <div className="font-headline text-2xl tracking-tight flex items-baseline gap-1">
              <Logo />
            </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                 <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || "https://placehold.co/40x40.png"} alt="@borrower" />
                  <AvatarFallback>{user?.displayName?.charAt(0) || 'B'}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline font-semibold">{user?.displayName || 'Borrower'}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                     <Link href="/dashboard/profile">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
           <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="flex flex-col gap-6 p-6">
                         <Link href="/" onClick={() => setIsOpen(false)}>
                            <Logo />
                        </Link>
                        <nav className="flex flex-col gap-4">
                        {menuItems.map((item) => (
                            <Link
                            key={item.href}
                            href={item.href}
                            className="text-muted-foreground hover:text-primary"
                             onClick={() => setIsOpen(false)}
                            >
                            {item.label}
                            </Link>
                        ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
           </div>
        </div>
      </div>
    </header>
  );
}
