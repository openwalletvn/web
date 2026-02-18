'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconArrowLeft, IconSettings, IconCreditCard, IconLayoutDashboard } from '@tabler/icons-react';
import { db } from '@/lib/db';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Tổng quan', href: '/app', icon: IconLayoutDashboard },
  { label: 'Thẻ', href: '/app/cards', icon: IconCreditCard },
] as const;

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function AppSidebar({ pathname }: { pathname: string }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
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
        <AppSidebar pathname={pathname} />

        <SidebarInset>
          {/* App header */}
          <header className="flex h-14 items-center gap-2 border-b border-dashed border-slate-200 px-4 sticky top-0 bg-white z-10 shrink-0">
            <SidebarTrigger className="text-slate-400 hover:text-slate-600 transition-colors" />
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="/"
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              title="Trang chủ"
            >
              <IconArrowLeft size={16} />
            </Link>
            <img src="/logo.png" alt="OpenWallet" className="h-6 w-6 object-contain" />
            <span className="font-bold text-slate-900 text-sm">{walletName}</span>

            <div className="ml-auto">
              <Link
                href="/app/settings"
                className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                title="Cài đặt"
              >
                <IconSettings size={18} />
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
