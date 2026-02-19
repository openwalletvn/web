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
import { getBankImageUrl, getBrandImageUrl, type Bank, type Brand } from '@/lib/api';

const CARD_TYPE_ITEMS = [
  { navKey: 'type_credit', href: '/cards/credit' },
  { navKey: 'type_debit',  href: '/cards/debit' },
  { navKey: 'type_2in1',   href: '/cards/2in1' },
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
  brands: Brand[];
}

export function Nav({ banks, brands }: Props) {
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
          <NavigationMenuTrigger className={cn(pathname.startsWith('/banks') && 'text-brand-red font-semibold')}>
            {t('banks')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[640px] p-4">
              <div className="grid grid-cols-6 gap-2 max-h-72 overflow-y-auto">
                {banks.map((bank) => (
                  <NavigationMenuLink asChild key={bank.id}>
                    <Link
                      href={`/banks/${bank.id}`}
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
                  <Link href="/banks" className="text-base text-brand-red hover:underline font-medium">
                    {t('view_all_banks')}
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(pathname.startsWith('/cards') && 'text-brand-red font-semibold')}>
            {t('cards')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[560px] p-4 grid grid-cols-3 gap-6">
              {/* By type */}
              <div>
                <p className="text-base font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {t('by_type')}
                </p>
                <ul className="space-y-1">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/cards" className="block text-base text-slate-700 hover:text-brand-red py-1 transition-colors">
                        {t('all_cards')}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {CARD_TYPE_ITEMS.map(({ navKey, href }) => (
                    <li key={navKey}>
                      <NavigationMenuLink asChild>
                        <Link href={href} className="block text-base text-slate-700 hover:text-brand-red py-1 transition-colors">
                          {t(navKey)}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* By network */}
              <div>
                <p className="text-base font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {t('by_network')}
                </p>
                <ul className="space-y-1">
                  {CARD_NETWORK_ITEMS.map(({ navKey, href }) => (
                    <li key={navKey}>
                      <NavigationMenuLink asChild>
                        <Link href={href} className="block text-base text-slate-700 hover:text-brand-red py-1 transition-colors">
                          {t(navKey)}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Co-branded */}
              <div>
                <p className="text-base font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {t('type_co_branded')}
                </p>
                <ul className="space-y-1">
                  {brands.map((brand) => (
                    <li key={brand.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/cards/co-branded/${brand.id}`}
                          className="flex items-center gap-2 text-base text-slate-700 hover:text-brand-red py-1 transition-colors"
                        >
                          <img
                            src={getBrandImageUrl(brand.logo_url)}
                            alt=""
                            width={16}
                            height={16}
                            className="object-contain shrink-0"
                          />
                          {brand.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/cards/co-branded" className="block text-base text-brand-red hover:underline py-1 font-medium">
                        {t('view_all_co_branded')}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/blog"
              className={cn(navigationMenuTriggerStyle(), pathname.startsWith('/blog') && 'text-brand-red font-semibold')}
            >
              {t('blog')}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
