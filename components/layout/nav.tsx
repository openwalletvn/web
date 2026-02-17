'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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

export function Nav({ banks }: Props) {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Home */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/"
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === '/' && 'text-brand-red font-semibold',
              )}
            >
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Banks */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(pathname.startsWith('/banks') && 'text-brand-red font-semibold')}
          >
            Banks
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
                        <Image
                          src={getBankImageUrl(bank.logo_url)}
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs text-slate-600 text-center leading-tight line-clamp-2">
                        {bank.name}
                      </span>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <NavigationMenuLink asChild>
                  <Link
                    href="/banks"
                    className="text-sm text-brand-red hover:underline font-medium"
                  >
                    View all banks →
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Cards */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(pathname.startsWith('/cards') && 'text-brand-red font-semibold')}
          >
            Cards
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[400px] p-4 grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  By Type
                </p>
                <ul className="space-y-1">
                  {CARD_TYPES.map((t) => (
                    <li key={t.value}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/cards?type=${t.value}`}
                          className="block text-sm text-slate-700 hover:text-brand-red py-1 transition-colors"
                        >
                          {t.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  By Network
                </p>
                <ul className="space-y-1">
                  {CARD_NETWORKS.map((n) => (
                    <li key={n.value}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/cards?network=${n.value}`}
                          className="block text-sm text-slate-700 hover:text-brand-red py-1 transition-colors"
                        >
                          {n.label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 pt-3 border-t border-slate-100">
                <NavigationMenuLink asChild>
                  <Link
                    href="/cards"
                    className="text-sm text-brand-red hover:underline font-medium"
                  >
                    View all cards →
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
