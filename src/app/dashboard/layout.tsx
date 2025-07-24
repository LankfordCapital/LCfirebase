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
  SidebarInset,
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/documents', label: 'Documents', icon: FileText },
    { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo className="h-8 w-auto" />
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
                    isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard/documents' || pathname === '/dashboard/documents')}
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
                    <AvatarImage src="https://placehold.co/40x40.png" alt="@borrower" />
                    <AvatarFallback>BD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold">Borrower Doe</span>
                    <span className="text-xs text-muted-foreground">borrower@email.com</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6 lg:p-8 bg-primary/5 min-h-full">
          {children}
        </div>
      </SidebarInset>
  );
}
