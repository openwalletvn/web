'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { IconMenu2 } from '@tabler/icons-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Ngân hàng', href: '/ngan-hang' },
  { label: 'Thẻ',       href: '/the' },
  { label: 'Tin tức',   href: '/tin-tuc' },
  { label: 'API Docs',  href: '/docs' },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 text-slate-600 hover:text-slate-900" aria-label="Open menu">
          <IconMenu2 className="w-5 h-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" onClick={close} className="font-bold text-slate-900">Open Wallet</Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={cn(
                'px-3 py-2 rounded-md text-base font-medium transition-colors',
                pathname.startsWith(href) ? 'text-brand-red bg-red-50' : 'text-slate-700 hover:bg-slate-100',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
