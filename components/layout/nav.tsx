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

const CARD_TYPE_KEYS = ['credit', 'debit', 'prepaid', 'transit', 'atm'] as const;
const CARD_NETWORK_KEYS = ['visa', 'mastercard', 'jcb', 'napas', 'amex', 'unionpay'] as const;

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
            <div className="w-[400px] p-4 grid grid-cols-2 gap-6">
              <div>
                <p className="text-base font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {t('by_type')}
                </p>
                <ul className="space-y-1">
                  {CARD_TYPE_KEYS.map((key) => (
                    <li key={key}>
                      <NavigationMenuLink asChild>
                        <Link href={`/cards?type=${key}`} className="block text-base text-slate-700 hover:text-brand-red py-1 transition-colors">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {t('by_network')}
                </p>
                <ul className="space-y-1">
                  {CARD_NETWORK_KEYS.map((key) => (
                    <li key={key}>
                      <NavigationMenuLink asChild>
                        <Link href={`/cards?network=${key}`} className="block text-base text-slate-700 hover:text-brand-red py-1 transition-colors">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 pt-3 border-t border-slate-100">
                <NavigationMenuLink asChild>
                  <Link href="/cards" className="text-base text-brand-red hover:underline font-medium">
                    {t('view_all_cards')}
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
