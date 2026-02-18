'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useLiveQuery} from 'dexie-react-hooks';
import {
    IconCalendarDue,
    IconCreditCard,
    IconHome,
    IconLayoutDashboard,
    IconPlus,
    IconSettings
} from '@tabler/icons-react';
import {db} from '@/lib/db';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import {TooltipProvider} from '@/components/ui/tooltip';

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Tổng quan', href: '/app', icon: IconLayoutDashboard },
    {label: 'Thẻ của tôi', href: '/app/my-cards', icon: IconCreditCard},
    {label: 'Đến hạn', href: '/app/upcoming', icon: IconCalendarDue},
] as const;

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function AppSidebar({pathname, walletName}: { pathname: string; walletName: string }) {
  return (
    <Sidebar collapsible="icon">

        {/* Top: logo + wallet name → /app */}
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild tooltip={walletName}>
                        <Link href="/app">
                            <img src="/logo.png" alt="OpenWallet" className="h-6 w-6 object-contain shrink-0"/>
                            <span className="font-bold text-slate-900 truncate">{walletName}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

      <SidebarContent>
          {/* Add card button */}
          <SidebarGroup>
              <SidebarGroupContent>
                  <SidebarMenu>
                      <SidebarMenuItem>
                          <SidebarMenuButton asChild tooltip="Thêm thẻ">
                              <Link href="/app/add">
                                  <IconPlus size={16}/>
                                  <span>Thêm thẻ</span>
                              </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                  </SidebarMenu>
              </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="mx-0"/>

          {/* Nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === '/app'
                        ? pathname === '/app'
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

        {/* Bottom: settings + back to home */}
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Cài đặt">
                        <Link href="/app/settings">
                            <IconSettings size={16}/>
                            <span>Cài đặt</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Về trang chủ">
                        <Link href="/">
                            <IconHome size={16}/>
                            <span>Về trang chủ</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const walletName = useLiveQuery(
    () => db.config.get('walletName').then((c) => c?.value ?? 'My Wallet'),
    [],
    'My Wallet',
  );

  return (
    <TooltipProvider>
      <SidebarProvider>
          <AppSidebar pathname={pathname} walletName={walletName ?? 'My Wallet'}/>

        <SidebarInset>
            {/* Mobile-only trigger bar — desktop uses the SidebarRail */}
            <div
                className="md:hidden sticky top-0 z-10 flex h-10 items-center gap-2 px-3 bg-white border-b border-dashed border-slate-100">
            <SidebarTrigger className="text-slate-400 hover:text-slate-600 transition-colors" />
            </div>

          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
