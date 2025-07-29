
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  LayoutDashboard,
  FileText,
  UserCircle,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { Loader2 } from 'lucide-react';

function DashboardNav() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/documents', label: 'New Application', icon: FileText },
    { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo className="h-auto w-40" />
          </Link>
          <SidebarTrigger variant="ghost" size="icon" className="md:hidden">
            <ChevronLeft />
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || "https://placehold.co/40x40.png"} alt="@borrower" />
                  <AvatarFallback>{user?.displayName?.charAt(0) || 'B'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold">{user?.displayName || 'Borrower'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton tooltip="Logout" onClick={logOut}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
        <DashboardNav />
        <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8 bg-primary/5 min-h-full w-full">
                {children}
            </div>
        </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute redirectTo="/auth/signin">
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ProtectedRoute>
  );
}
