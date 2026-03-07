'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageContainer } from '@/components/ui/page-container';

const NAV_ITEMS = [
  { label: 'Ví',        href: '/app/settings/wallet' },
  { label: 'Thông báo', href: '/app/settings/notifications' },
  { label: 'Dữ liệu',  href: '/app/settings/data' },
] as const;

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PageContainer maxWidth="4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Cài đặt</h1>
      <div className="border-t border-dashed border-slate-200 mb-6" />

      <div className="flex gap-0 min-h-[60vh]">
        {/* Sidebar */}
        <nav className="w-48 shrink-0 pr-6 border-r border-dashed border-slate-200">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                      isActive
                        ? 'text-brand-blue bg-blue-50/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 pl-8 min-w-0">
          {children}
        </div>
      </div>
    </PageContainer>
  );
}
