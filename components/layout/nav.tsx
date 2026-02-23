'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { getBankImageUrl, type Bank } from '@/lib/api';

const CARD_TYPE_ITEMS = [
  { navKey: 'all_cards',          href: '/the' },
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

export function Nav({ banks }: Props) {
  const pathname = usePathname();
  const t = useTranslations('Nav');

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/"
              className={cn(navigationMenuTriggerStyle(), pathname === '/' && 'text-brand-red font-semibold')}
            >
              {t('home')}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(pathname.startsWith('/ngan-hang') && 'text-brand-red font-semibold')}>
            {t('banks')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[640px] p-4">
              <div className="grid grid-cols-6 gap-2 max-h-72 overflow-y-auto">
                {banks.map((bank) => (
                  <NavigationMenuLink asChild key={bank.id}>
                    <Link
                      href={`/ngan-hang/${bank.id}`}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <div className="relative w-10 h-10">
                        <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain" />
                      </div>
                      <span className="text-base text-slate-600 text-center leading-tight line-clamp-2">
                        {bank.name}
                      </span>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <NavigationMenuLink asChild>
                  <Link href="/ngan-hang" className="text-base text-brand-red hover:underline font-medium">
                    {t('view_all_banks')}
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(pathname.startsWith('/the') && 'text-brand-red font-semibold')}>
            {t('cards')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[580px] p-5">
              <div className="flex gap-6">

                {/* Card types */}
                <div className="shrink-0 w-36">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    {t('by_type')}
                  </p>
                  <ul className="space-y-0.5">
                    {CARD_TYPE_ITEMS.map(({ navKey, href }) => (
                      <li key={navKey}>
                        <NavigationMenuLink asChild>
                          <Link href={href} className="block text-sm text-slate-700 hover:text-brand-red py-1.5 transition-colors">
                            {t(navKey)}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-px bg-slate-100 shrink-0" />

                {/* Networks */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    {t('by_network')}
                  </p>
                  <ul className="space-y-0.5">
                    {CARD_NETWORK_ITEMS.map(({ navKey, href }) => (
                      <li key={navKey}>
                        <NavigationMenuLink asChild>
                          <Link href={href} className="block text-sm text-slate-700 hover:text-brand-red py-1.5 transition-colors">
                            {t(navKey)}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-px bg-slate-100 shrink-0" />

                {/* Fees */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    {t('by_fee')}
                  </p>
                  <ul className="space-y-0.5">
                    {CARD_FEE_ITEMS.map(({ navKey, href }) => (
                      <li key={navKey}>
                        <NavigationMenuLink asChild>
                          <Link href={href} className="block text-sm text-slate-700 hover:text-brand-red py-1.5 transition-colors">
                            {t(navKey)}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/tin-tuc"
              className={cn(navigationMenuTriggerStyle(), pathname.startsWith('/tin-tuc') && 'text-brand-red font-semibold')}
            >
              {t('blog')}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/docs"
              className={cn(navigationMenuTriggerStyle(), pathname.startsWith('/docs') && 'text-brand-red font-semibold')}
            >
              {t('api_docs')}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
