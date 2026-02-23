'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Ngân hàng', href: '/ngan-hang' },
  { label: 'Thẻ',       href: '/the' },
  { label: 'Tin tức',   href: '/tin-tuc' },
  { label: 'API Docs',  href: '/docs' },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {NAV_LINKS.map(({ label, href }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink asChild>
              <Link
                href={href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname.startsWith(href) && 'text-brand-red font-semibold'
                )}
              >
                {label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
