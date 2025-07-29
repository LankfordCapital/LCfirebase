
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
  LogOut,
  ChevronLeft,
  Bot,
  Mail,
  BarChartHorizontal,
  MessageSquare,
  FileJson,
  AreaChart,
  Hammer,
  BookCopy,
  Shield,
  FileBarChart,
  Database,
  Users,
  ClipboardList,
  Calendar,
  Notebook,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

function WorkforceNav() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();

  const menuItems = [
    { href: '/workforce-office', label: 'Pipeline Dashboard', icon: LayoutDashboard },
    { href: '/workforce-office/market-analysis', label: 'Market Analysis', icon: AreaChart },
    { href: '/workforce-office/comparable-property-report', label: 'Comparable Property Report', icon: FileBarChart },
    { href: '/workforce-office/construction-feasibility', label: 'Construction Feasibility', icon: Hammer },
    { href: '/workforce-office/title-escrow-instructions', label: 'Title & Escrow', icon: BookCopy },
    { href: '/workforce-office/insurance-instructions', label: 'Insurance Instructions', icon: Shield },
    { href: '/workforce-office/lender-database', label: 'Lender Database', icon: Database },
    { href: '/workforce-office/lender-matcher', label: 'AI Lender Matcher', icon: Users },
    { href: '/workforce-office/amc-database', label: 'AMC Database', icon: ClipboardList },
    { href: '/workforce-office/document-optimizer', label: 'Document Optimizer', icon: Bot },
    { href: '/workforce-office/document-generator', label: 'Document Generator', icon: FileJson },
    { href: '/workforce-office/email-automation', label: 'Email Automation', icon: Mail },
    { href: '/workforce-office/scheduler', label: 'Scheduler', icon: Calendar },
    { href: '/workforce-office/docs', label: 'Documents & Notes', icon: Notebook },
    { href: '/workforce-office/reports', label: 'Reporting', icon: BarChartHorizontal },
    { href: '/workforce-office/communications', label: 'Communications Hub', icon: MessageSquare },
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
                  isActive={pathname === item.href}
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
                  <AvatarImage src={"https://placehold.co/40x40.png"} alt="@workforce" />
                  <AvatarFallback>WF</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold">{user?.displayName || 'Workforce'}</span>
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

export default function WorkforceOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute redirectTo="/auth/workforce-signin">
      <div className="flex h-screen">
        <WorkforceNav />
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 bg-primary/5 min-h-full w-full">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
