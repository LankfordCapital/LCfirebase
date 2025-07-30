
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard, LogOut, ChevronDown, Bot, Mail, BarChartHorizontal,
  MessageSquare, FileJson, AreaChart, Hammer, BookCopy, Shield, FileBarChart,
  Database, Users, ClipboardList, Calendar, Notebook, Menu
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import React from 'react';

const navLinks = [
    { href: '/workforce-office', label: 'Pipeline' },
    { href: '/workforce-office/lender-database', label: 'Lenders' },
    { href: '/workforce-office/amc-database', label: 'AMCs' },
    { href: '/workforce-office/reports', label: 'Reporting' },
    { href: '/workforce-office/communications', label: 'Comms' },
];

const toolsLinks = [
     { href: '/workforce-office/market-analysis', label: 'Market Analysis', icon: AreaChart },
    { href: '/workforce-office/comparable-property-report', label: 'Comparable Property Report', icon: FileBarChart },
    { href: '/workforce-office/construction-feasibility', label: 'Construction Feasibility', icon: Hammer },
    { href: '/workforce-office/title-escrow-instructions', label: 'Title & Escrow', icon: BookCopy },
    { href: '/workforce-office/insurance-instructions', label: 'Insurance Instructions', icon: Shield },
    { href: '/workforce-office/lender-matcher', label: 'AI Lender Matcher', icon: Users },
    { href: '/workforce-office/document-optimizer', label: 'Document Optimizer', icon: Bot },
    { href: '/workforce-office/document-generator', label: 'Document Generator', icon: FileJson },
    { href: '/workforce-office/email-automation', label: 'Email Automation', icon: Mail },
    { href: '/workforce-office/scheduler', label: 'Scheduler', icon: Calendar },
    { href: '/workforce-office/docs', label: 'Documents & Notes', icon: Notebook },
]

export function WorkforceOfficeHeader() {
  const { user, logOut } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
            <div className="font-headline text-2xl tracking-tight flex items-baseline gap-1">
                <Logo />
                </div>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-primary px-0 hover:bg-transparent">
                            AI Tools <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64">
                         {toolsLinks.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                                <Link href={item.href} className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-muted-foreground" />
                                    <span>{item.label}</span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                 <Avatar className="h-8 w-8">
                  <AvatarImage src={"https://placehold.co/40x40.png"} alt="@workforce" />
                  <AvatarFallback>WF</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline font-semibold">{user?.displayName || 'Workforce'}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
                        {[...navLinks, ...toolsLinks].map((item) => (
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
