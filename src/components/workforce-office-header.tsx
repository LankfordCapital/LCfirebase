
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User as UserIcon, Cog, Shield, Users, LineChart, Briefcase, BotMessageSquare, FileText, Database, GitBranch, MessageSquare, Calendar, PencilRuler, FileType } from 'lucide-react';
import { Logo } from './logo';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import React from 'react';
import { cn } from '@/lib/utils';


const aiToolsLinks = [
    { title: "Market Analysis", href: "/workforce-office/market-analysis", description: "Generate traffic, demographic, and zoning reports." },
    { title: "Comparable Property Report", href: "/workforce-office/comparable-property-report", description: "Create AI-powered appraisal and market analysis." },
    { title: "Construction Feasibility", href: "/workforce-office/construction-feasibility", description: "Analyze project budgets against local costs." },
    { title: "Lender Matcher", href: "/workforce-office/lender-matcher", description: "Find the best capital partners for a deal." },
    { title: "Document Optimizer", href: "/workforce-office/document-optimizer", description: "Improve documents for higher approval chances." },
];

const generationToolsLinks = [
    { title: "Title & Escrow Instructions", href: "/workforce-office/title-escrow-instructions", description: "Generate custom instructions for title and escrow." },
    { title: "Insurance Instructions", href: "/workforce-office/insurance-instructions", description: "Create tailored insurance requirements for agents." },
    { title: "Email Automation", href: "/workforce-office/email-automation", description: "Draft emails for various scenarios automatically." },
    { title: "Document Generator", href: "/workforce-office/document-generator", description: "Generate custom documents from templates." },
];

const databaseLinks = [
    { title: "Lender & Investor Database", href: "/workforce-office/lender-database", description: "Manage profiles of capital partners." },
    { title: "AMC & Vendor Database", href: "/workforce-office/amc-database", description: "Manage appraisal and report vendors." },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
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
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default function WorkforceOfficeHeader() {
  const { user, logOut } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/workforce-office">
            <Logo />
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/workforce-office" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>AI Tools</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {aiToolsLinks.map((component) => (
                            <ListItem key={component.title} title={component.title} href={component.href}>
                                {component.description}
                            </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Generators</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {generationToolsLinks.map((component) => (
                            <ListItem key={component.title} title={component.title} href={component.href}>
                                {component.description}
                            </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                 <NavigationMenuItem>
                    <NavigationMenuTrigger>Databases</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {databaseLinks.map((component) => (
                            <ListItem key={component.title} title={component.title} href={component.href}>
                                {component.description}
                            </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/workforce-office/user-management" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>User Management</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                 <NavigationMenuItem>
                    <Link href="/workforce-office/communications" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Chat</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                 <NavigationMenuItem>
                    <Link href="/workforce-office/scheduler" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Scheduler</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/workforce-office/docs" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Docs</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                 <NavigationMenuItem>
                    <Link href="/workforce-office/reports" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Reports</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                   <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Admin'} />
                  <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || "Workforce Member"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
