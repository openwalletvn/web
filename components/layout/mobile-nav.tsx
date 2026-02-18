'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { IconMenu2, IconChevronDown } from '@tabler/icons-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { getBankImageUrl, type Bank } from '@/lib/api';

const CARD_TYPE_ITEMS = [
  { navKey: 'type_credit',     href: '/cards/credit' },
  { navKey: 'type_debit',      href: '/cards/debit' },
  { navKey: 'type_2in1',       href: '/cards/2in1' },
  { navKey: 'type_co_branded', href: '/cards/co-branded' },
] as const;

const CARD_NETWORK_ITEMS = [
  { navKey: 'network_visa',       href: '/cards/visa' },
  { navKey: 'network_mastercard', href: '/cards/mastercard' },
  { navKey: 'network_jcb',        href: '/cards/jcb' },
  { navKey: 'network_napas',      href: '/cards/napas' },
  { navKey: 'network_amex',       href: '/cards/amex' },
  { navKey: 'network_unionpay',   href: '/cards/unionpay' },
] as const;

interface Props {
  banks: Bank[];
}

export function MobileNav({ banks }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations('Nav');

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
          <Link
            href="/"
            onClick={close}
            className={cn(
              'px-3 py-2 rounded-md text-base font-medium transition-colors',
              pathname === '/' ? 'text-brand-red bg-red-50' : 'text-slate-700 hover:bg-slate-100',
            )}
          >
            {t('home')}
          </Link>

          <Collapsible defaultOpen={pathname.startsWith('/banks')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <span className={cn(pathname.startsWith('/banks') && 'text-brand-red')}>{t('banks')}</span>
              <IconChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
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
                      <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain" />
                    </div>
                    <span className="text-base text-slate-600 text-center leading-tight line-clamp-2">{bank.name}</span>
                  </Link>
                ))}
              </div>
              <Link href="/banks" onClick={close} className="block mt-2 ml-3 text-base text-brand-red hover:underline font-medium">
                {t('view_all_banks')}
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen={pathname.startsWith('/cards')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <span className={cn(pathname.startsWith('/cards') && 'text-brand-red')}>{t('cards')}</span>
              <IconChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-1 ml-3 space-y-3">
                <div>
                  <p className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-1 px-2">{t('by_type')}</p>
                  <Link href="/cards" onClick={close} className="block px-2 py-1 text-base text-slate-700 hover:text-brand-red transition-colors">
                    {t('all_cards')}
                  </Link>
                  {CARD_TYPE_ITEMS.map(({ navKey, href }) => (
                    <Link key={navKey} href={href} onClick={close} className="block px-2 py-1 text-base text-slate-700 hover:text-brand-red transition-colors">
                      {t(navKey)}
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-1 px-2">{t('by_network')}</p>
                  {CARD_NETWORK_ITEMS.map(({ navKey, href }) => (
                    <Link key={navKey} href={href} onClick={close} className="block px-2 py-1 text-base text-slate-700 hover:text-brand-red transition-colors">
                      {t(navKey)}
                    </Link>
                  ))}
                </div>
                <Link href="/cards" onClick={close} className="block text-base text-brand-red hover:underline font-medium px-2">
                  {t('view_all_cards')}
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Link
            href="/blog"
            onClick={close}
            className={cn(
              'px-3 py-2 rounded-md text-base font-medium transition-colors',
              pathname.startsWith('/blog') ? 'text-brand-red bg-red-50' : 'text-slate-700 hover:bg-slate-100',
            )}
          >
            {t('blog')}
          </Link>

          <Link
            href="/docs"
            onClick={close}
            className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {t('api_docs')}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
