
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { Logo } from './logo';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import React from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';


const aiToolsLinks = [
    { title: "Due Diligence Hub", href: "/workforce-office/due-diligence", description: "Order all AI reports from a single dashboard." },
    { title: "Lender Matcher", href: "/workforce-office/lender-matcher", description: "Find the best capital partners for a deal." },
    { title: "Document Optimizer", href: "/workforce-office/document-optimizer", description: "Improve documents for higher approval chances." },
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
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logo href="/workforce-office"/>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/workforce-office" className={cn(navigationMenuTriggerStyle(), { 'bg-accent': pathname === '/workforce-office' })}>Dashboard</Link>
                    </NavigationMenuLink>
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
                    <NavigationMenuLink asChild>
                        <Link href="/workforce-office/communications" className={cn(navigationMenuTriggerStyle(), { 'bg-accent': pathname === '/workforce-office/communications' })}>Chat</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                 <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/workforce-office/scheduler" className={cn(navigationMenuTriggerStyle(), { 'bg-accent': pathname === '/workforce-office/scheduler' })}>Scheduler</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/workforce-office/docs" className={cn(navigationMenuTriggerStyle(), { 'bg-accent': pathname === '/workforce-office/docs' })}>Docs</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                 <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/workforce-office/reports" className={cn(navigationMenuTriggerStyle(), { 'bg-accent': pathname === '/workforce-office/reports' })}>Reports</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                 <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/workforce-office/user-management" className={cn(navigationMenuTriggerStyle(), { 'bg-accent': pathname === '/workforce-office/user-management' })}>User Management</Link>
                    </NavigationMenuLink>
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
