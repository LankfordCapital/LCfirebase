
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LayoutDashboard, LogOut, User as UserIcon, Users, Building2, Briefcase, MessageSquare } from 'lucide-react';
import { Logo } from './logo';
import { usePathname } from 'next/navigation';
import { useUI } from '@/contexts/ui-context';

export default function BorrowerDashboardHeader() {
  const { user, userProfile, logOut, isAdmin } = useAuth();
  const { openAssistant } = useUI();
  const pathname = usePathname();

  const navLinks = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/dashboard/application', label: 'New Application' },
      { href: '/dashboard/documents', label: 'Loan Actions' },
      { href: '/dashboard/profile', label: 'My Profile' },
  ];

  // Don't render anything until the user profile is loaded to prevent flicker
  if (!user || !userProfile) {
    return null;
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logo href="/dashboard" />
          <nav className="hidden items-center gap-4 md:flex">
            {navLinks.map(link => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                    {link.label}
                </Link>
            ))}
             <Button variant="ghost" onClick={() => openAssistant()} className="text-sm font-medium text-muted-foreground hover:text-primary">
                Chat
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                  <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile"><UserIcon className="mr-2 h-4 w-4" />Profile</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openAssistant()}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Chat</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAdmin && (
                <>

                  <DropdownMenuItem asChild>
                    <Link href="/workforce-office" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Workforce Office</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/broker-office" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Broker Office</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>Borrower Office</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
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
