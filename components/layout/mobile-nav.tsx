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
  { navKey: 'type_credit',        href: '/the-tin-dung' },
  { navKey: 'type_debit',         href: '/the-ghi-no' },
  { navKey: 'type_2in1',          href: '/the-2-trong-1' },
  { navKey: 'type_co_branded',    href: '/the-dong-thuong-hieu' },
] as const;

const CARD_NETWORK_ITEMS = [
  { navKey: 'network_visa',       href: '/the-tin-dung-visa' },
  { navKey: 'network_mastercard', href: '/the-tin-dung-mastercard' },
  { navKey: 'network_jcb',        href: '/the-tin-dung-jcb' },
  { navKey: 'network_amex',       href: '/the-tin-dung-amex' },
  { navKey: 'network_napas',      href: '/the-ghi-no-noi-dia' },
] as const;

const CARD_FEE_ITEMS = [
  { navKey: 'fee_free',           href: '/the-tin-dung-mien-phi-thuong-nien' },
  { navKey: 'fee_low',            href: '/the-tin-dung-phi-thuong-nien-thap' },
  { navKey: 'debit_free',         href: '/the-ghi-no-mien-phi' },
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

          <Collapsible defaultOpen={pathname.startsWith('/ngan-hang')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <span className={cn(pathname.startsWith('/ngan-hang') && 'text-brand-red')}>{t('banks')}</span>
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
                    <span className="text-base text-slate-600 text-center leading-tight line-clamp-2">{bank.name}</span>
                  </Link>
                ))}
              </div>
              <Link href="/ngan-hang" onClick={close} className="block mt-2 ml-3 text-base text-brand-red hover:underline font-medium">
                {t('view_all_banks')}
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen={pathname.startsWith('/the')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <span className={cn(pathname.startsWith('/the') && 'text-brand-red')}>{t('cards')}</span>
              <IconChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-1 ml-3 space-y-3">
                <div>
                  <p className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-1 px-2">{t('by_type')}</p>
                  <Link href="/the" onClick={close} className="block px-2 py-1 text-base text-slate-700 hover:text-brand-red transition-colors">
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
                <div>
                  <p className="text-base font-semibold text-slate-400 uppercase tracking-wide mb-1 px-2">{t('by_fee')}</p>
                  {CARD_FEE_ITEMS.map(({ navKey, href }) => (
                    <Link key={navKey} href={href} onClick={close} className="block px-2 py-1 text-base text-slate-700 hover:text-brand-red transition-colors">
                      {t(navKey)}
                    </Link>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Link
            href="/tin-tuc"
            onClick={close}
            className={cn(
              'px-3 py-2 rounded-md text-base font-medium transition-colors',
              pathname.startsWith('/tin-tuc') ? 'text-brand-red bg-red-50' : 'text-slate-700 hover:bg-slate-100',
            )}
          >
            {t('blog')}
          </Link>

          <Link
            href="/docs"
            onClick={close}
            className={cn(
              'px-3 py-2 rounded-md text-base font-medium transition-colors',
              pathname.startsWith('/docs') ? 'text-brand-red bg-red-50' : 'text-slate-700 hover:bg-slate-100',
            )}
          >
            {t('api_docs')}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
