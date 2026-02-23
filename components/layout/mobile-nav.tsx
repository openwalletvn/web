'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { IconMenu2, IconChevronDown } from '@tabler/icons-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { getBankImageUrl, type Bank } from '@/lib/api';
import { MENU, isDropdown } from '@/lib/menu';

interface Props {
  banks: Bank[];
}

export function MobileNav({ banks }: Props) {
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
          {MENU.map((item, index) => {
            if (isDropdown(item)) {
              // Dropdown item
              if (item.type === 'banks') {
                // Banks dropdown with dynamic content
                return (
                  <Collapsible key={index} defaultOpen={pathname.startsWith('/ngan-hang')}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                      <span className={cn(pathname.startsWith('/ngan-hang') && 'text-brand-red')}>
                        {item.label}
                      </span>
                      <IconChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-1 ml-3 grid grid-cols-3 gap-1 max-h-64 overflow-y-auto pr-1">
                        {banks.map((bank) => (
                          <Link
                            key={bank.id}
                            href={`/ngan-hang/${bank.id}`}
                            onClick={close}
                            className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-slate-100 transition-colors"
                          >
                            <div className="relative w-8 h-8">
                              <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain" />
                            </div>
                            <span className="text-base text-slate-600 text-center leading-tight line-clamp-2">
                              {bank.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                      {item.footerLink && (
                        <Link
                          href={item.footerLink.href}
                          onClick={close}
                          className="block mt-2 ml-3 text-base text-brand-red hover:underline font-medium"
                        >
                          {item.footerLink.label}
                        </Link>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                );
              } else if (item.columns) {
                // Cards or other mega menu
                const pathPrefix = item.columns[0]?.items[0]?.href.split('/')[1];
                const isActive = pathPrefix && pathname.startsWith(`/${pathPrefix}`);

                return (
                  <Collapsible key={index} defaultOpen={isActive}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                      <span className={cn(isActive && 'text-brand-red')}>
                        {item.label}
                      </span>
                      <IconChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-1 ml-3 space-y-3">
                        {item.columns.map((column, idx) => (
                          <div key={idx}>
                            <p className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-1 px-2">
                              {column.title}
                            </p>
                            {column.items.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={close}
                                className="block px-2 py-1 text-base text-slate-700 hover:text-brand-red transition-colors"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
            } else {
              // Simple link
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    'px-3 py-2 rounded-md text-base font-medium transition-colors',
                    pathname === item.href ? 'text-brand-red bg-red-50' : 'text-slate-700 hover:bg-slate-100',
                  )}
                >
                  {item.label}
                </Link>
              );
            }

            return null;
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
