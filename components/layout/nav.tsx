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
import { getBankImageUrl, getBrandImageUrl, getNetworkImageUrl, type Bank, type Brand, type Network } from '@/lib/api';

const CARD_TYPE_ITEMS = [
  { navKey: 'type_credit', href: '/cards/credit' },
  { navKey: 'type_debit',  href: '/cards/debit' },
  { navKey: 'type_2in1',   href: '/cards/2in1' },
] as const;


interface Props {
  banks: Bank[];
  brands: Brand[];
  networks: Network[];
}

export function Nav({ banks, brands, networks }: Props) {
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
            <div className="w-[680px] p-5">
              <div className="flex gap-6">

                {/* Card types — text list */}
                <div className="shrink-0 w-28">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    {t('by_type')}
                  </p>
                  <ul className="space-y-0.5">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/cards" className="block text-sm text-slate-700 hover:text-brand-red py-1.5 transition-colors">
                          {t('all_cards')}
                        </Link>
                      </NavigationMenuLink>
                    </li>
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

                {/* Networks — logo + name grid */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    {t('by_network')}
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {networks.map((network) => (
                      <NavigationMenuLink asChild key={network.id}>
                        <Link
                          href={`/cards/networks/${network.id}`}
                          className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <div className="relative w-10 h-10">
                            <Image src={getNetworkImageUrl(network.logo_url)} alt="" fill className="object-contain" />
                          </div>
                          <span className="text-xs text-slate-600 text-center leading-tight">{network.name}</span>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>

                <div className="w-px bg-slate-100 shrink-0" />

                {/* Brands — logo + name grid */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    {t('type_co_branded')}
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {brands.map((brand) => (
                      <NavigationMenuLink asChild key={brand.id}>
                        <Link
                          href={`/cards/co-branded/${brand.id}`}
                          className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <div className="relative w-10 h-10">
                            <Image src={getBrandImageUrl(brand.logo_url)} alt="" fill className="object-contain" />
                          </div>
                          <span className="text-xs text-slate-600 text-center leading-tight line-clamp-2">{brand.name}</span>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <NavigationMenuLink asChild>
                      <Link href="/cards/co-branded" className="text-xs text-brand-red hover:underline font-medium">
                        {t('view_all_co_branded')}
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>

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
