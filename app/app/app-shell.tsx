'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  IconBell,
  IconCalendarDue,
  IconCheck,
  IconChevronDown,
  IconCreditCard,
  IconHome,
  IconLayoutDashboard,
  IconPlus,
  IconSettings,
} from '@tabler/icons-react';
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
import { TooltipProvider } from '@/components/ui/tooltip';
import { WalletDbProvider, useActiveWallet, switchWallet } from '@/providers/wallet-db-provider';
import { appDb } from '@/lib/app-db';

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Tổng quan',    href: '/app',            icon: IconLayoutDashboard },
  { label: 'Thẻ của tôi',  href: '/app/my-cards',   icon: IconCreditCard },
  { label: 'Nhắc nhở',     href: '/app/reminders',  icon: IconBell },
  { label: 'Đến hạn',      href: '/app/upcoming',   icon: IconCalendarDue },
] as const;

// ─── Wallet switcher ──────────────────────────────────────────────────────────

function WalletSwitcher() {
  const { name: walletName, id: activeId } = useActiveWallet();
  const wallets = useLiveQuery(() => appDb.wallets.toArray(), [], []);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    const id = crypto.randomUUID();
    await appDb.wallets.add({ id, name, createdAt: new Date() });
    setNewName('');
    setCreating(false);
    setOpen(false);
    await switchWallet(id);
  }

  return (
    <div className="relative">
      <SidebarMenuButton size="lg" onClick={() => setOpen(!open)} tooltip={walletName}>
        <img src="/icon.png" alt="OpenWallet" className="h-6 w-6 object-contain shrink-0" />
        <span className="font-bold text-slate-900 truncate flex-1">{walletName}</span>
        <IconChevronDown
          size={14}
          className={cn('text-slate-500 shrink-0 transition-transform', open ? 'rotate-180' : '')}
        />
      </SidebarMenuButton>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setCreating(false); setNewName(''); }} />
          <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-dashed border-slate-200 rounded-sm shadow-md overflow-hidden">
            {wallets?.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => { setOpen(false); if (wallet.id !== activeId) switchWallet(wallet.id); }}
                className={cn('w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors', wallet.id === activeId ? 'text-brand-blue bg-blue-50/60' : 'text-slate-700 hover:bg-slate-50')}
              >
                <span className="flex-1 truncate">{wallet.name}</span>
                {wallet.id === activeId && <IconCheck size={13} className="shrink-0" />}
              </button>
            ))}

            <div className="border-t border-dashed border-slate-100">
              {creating ? (
                <div className="flex items-center gap-1 p-2">
                  <input
                    ref={inputRef}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') { setCreating(false); setNewName(''); } }}
                    placeholder="Tên ví..."
                    className="flex-1 px-2 py-1 text-sm border border-dashed border-slate-300 rounded-sm focus:outline-none focus:border-brand-blue"
                  />
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="px-2 py-1 text-sm border border-dashed border-brand-blue text-brand-blue rounded-sm hover:bg-blue-50/60 disabled:opacity-40 transition-colors"
                  >
                    Tạo
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCreating(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <IconPlus size={13} />
                  Tạo ví mới
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* Top: wallet switcher */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <WalletSwitcher />
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
                    <IconPlus size={16} />
                    <span>Thêm thẻ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-0" />

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
                <IconSettings size={16} />
                <span>Cài đặt</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Về trang chủ">
              <Link href="/">
                <IconHome size={16} />
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

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <WalletDbProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {/* Mobile-only trigger bar */}
            <div className="md:hidden sticky top-0 z-10 flex h-10 items-center gap-2 px-3 bg-white border-b border-dashed border-slate-100">
              <SidebarTrigger className="text-slate-500 hover:text-slate-600 transition-colors" />
            </div>
            <main className="flex-1">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </WalletDbProvider>
    </TooltipProvider>
  );
}
