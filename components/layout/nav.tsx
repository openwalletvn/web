'use client';

import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {Fragment} from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {cn} from '@/lib/utils';
import {type Bank, getBankImageUrl} from '@/lib/api';
import {MENU, isDropdown} from '@/lib/menu';

interface Props {
    banks: Bank[];
}

export function Nav({ banks }: Props) {
    const pathname = usePathname();

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {MENU.map((item, index) => {
                    if (isDropdown(item)) {
                        // Dropdown menu item
                        if (item.type === 'banks') {
                            // Banks dropdown with dynamic content
                            return (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuTrigger
                                        className={cn(pathname.startsWith('/ngan-hang') && 'text-brand-red font-semibold')}
                                    >
                                        {item.label}
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
                                                    </NavigationMenuLink>
                                                ))}
                                            </div>
                                            {item.footerLink && (
                                                <div className="mt-3 pt-3 border-t border-slate-100">
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href={item.footerLink.href}
                                                            className="text-base text-brand-red hover:underline font-medium"
                                                        >
                                                            {item.footerLink.label}
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </div>
                                            )}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            );
                        } else if (item.columns) {
                            // Cards or other mega menu
                            const pathPrefix = item.columns[0]?.items[0]?.href.split('/')[1];
                            const isActive = pathPrefix && pathname.startsWith(`/${pathPrefix}`);

                            return (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuTrigger
                                        className={cn(isActive && 'text-brand-red font-semibold')}
                                    >
                                        {item.label}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[580px] p-5">
                                            <div className="flex gap-6">
                                                {item.columns.map((column, idx) => (
                                                    <Fragment key={idx}>
                                                        {idx > 0 && <div className="w-px bg-slate-100 shrink-0" />}
                                                        <div className={idx === 0 ? 'shrink-0 w-36' : 'flex-1'}>
                                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                                                                {column.title}
                                                            </p>
                                                            <ul className="space-y-0.5">
                                                                {column.items.map((subItem) => (
                                                                    <li key={subItem.href}>
                                                                        <NavigationMenuLink asChild>
                                                                            <Link
                                                                                href={subItem.href}
                                                                                className="block text-sm text-slate-700 hover:text-brand-red py-1.5 transition-colors"
                                                                            >
                                                                                {subItem.label}
                                                                            </Link>
                                                                        </NavigationMenuLink>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </Fragment>
                                                ))}
                                            </div>
                                            {item.footerLink && (
                                                <div className="mt-3 pt-3 border-t border-slate-100">
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href={item.footerLink.href}
                                                            className="text-base text-brand-red hover:underline font-medium"
                                                        >
                                                            {item.footerLink.label}
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </div>
                                            )}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            );
                        }
                    } else {
                        // Simple link
                        return (
                            <NavigationMenuItem key={index}>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            pathname === item.href && 'text-brand-red font-semibold'
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        );
                    }

                    return null;
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
