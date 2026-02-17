'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBankImageUrl, type Bank } from '@/lib/api';

const CARD_TYPES = [
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'transit', label: 'Transit' },
  { value: 'atm', label: 'ATM' },
];

const CARD_NETWORKS = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'jcb', label: 'JCB' },
  { value: 'napas', label: 'Napas' },
  { value: 'amex', label: 'Amex' },
  { value: 'unionpay', label: 'UnionPay' },
];

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
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" onClick={close} className="font-bold text-slate-900">
              Open Wallet
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-1">
          {/* Home */}
          <Link
            href="/"
            onClick={close}
            className={cn(
              'px-3 py-2 rounded-md text-base font-medium transition-colors',
              pathname === '/'
                ? 'text-brand-red bg-red-50'
                : 'text-slate-700 hover:bg-slate-100',
            )}
          >
            Home
          </Link>

          {/* Banks */}
          <Collapsible defaultOpen={pathname.startsWith('/banks')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <span className={cn(pathname.startsWith('/banks') && 'text-brand-red')}>
                Banks
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-1 ml-3 grid grid-cols-3 gap-1 max-h-64 overflow-y-auto pr-1">
                {banks.map((bank) => (
                  <Link
                    key={bank.id}
                    href={`/banks/${bank.id}`}
                    onClick={close}
                    className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <div className="relative w-8 h-8">
                      <Image
                        src={getBankImageUrl(bank.logo_url)}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-base text-slate-600 text-center leading-tight line-clamp-2">
                      {bank.name}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/banks"
                onClick={close}
                className="block mt-2 ml-3 text-base text-brand-red hover:underline font-medium"
              >
                View all →
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Cards */}
          <Collapsible defaultOpen={pathname.startsWith('/cards')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <span className={cn(pathname.startsWith('/cards') && 'text-brand-red')}>
                Cards
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-1 ml-3 space-y-3">
                <div>
                  <p className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-1 px-2">
                    By Type
                  </p>
                  {CARD_TYPES.map((t) => (
                    <Link
                      key={t.value}
                      href={`/cards?type=${t.value}`}
                      onClick={close}
                      className="block px-2 py-1 text-base text-slate-700 hover:text-brand-red transition-colors"
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-1 px-2">
                    By Network
                  </p>
                  {CARD_NETWORKS.map((n) => (
                    <Link
                      key={n.value}
                      href={`/cards?network=${n.value}`}
                      onClick={close}
                      className="block px-2 py-1 text-base text-slate-700 hover:text-brand-red transition-colors"
                    >
                      {n.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/cards"
                  onClick={close}
                  className="block text-base text-brand-red hover:underline font-medium px-2"
                >
                  View all →
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Docs */}
          <Link
            href="/docs"
            onClick={close}
            className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            API Docs
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
