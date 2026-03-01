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
import {type Bank, getBankImageUrl, getNetworkImageUrl, type Network} from '@/lib/api';
import {isDropdown, MENU} from '@/lib/menu';

interface Props {
    banks: Bank[];
    networks: Network[];
    cardCounts: Record<string, number>;
    totalCards: number;
    totalBanks: number;
}

export function Nav({banks, networks, cardCounts, totalCards, totalBanks}: Props) {
    const pathname = usePathname();

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {MENU.map((item, index) => {
                    if (isDropdown(item)) {
                        // Banks dropdown with dynamic content
                        if (item.type === 'banks') {
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
                        }

                        // Rows-based mega menu (cards)
                        if (item.rows) {
                            const isActive = item.rows.some((row) =>
                                row.items.some((sub) => pathname.startsWith(sub.href))
                            );

                            return (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuTrigger
                                        className={cn(isActive && 'text-brand-red font-semibold')}
                                    >
                                        {item.label}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[680px] p-5">
                                            {item.rows.map((row, rowIdx) => (
                                                <Fragment key={rowIdx}>
                                                    {rowIdx > 0 && (
                                                        <div className="border-t border-dashed border-slate-100 my-3"/>
                                                    )}
                                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                                        {row.title}
                                                    </p>
                                                    {row.type === 'networks' ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {row.items.map((subItem) => {
                                                                const network = networks.find(
                                                                    (n) =>
                                                                        n.name.toLowerCase() === subItem.label.toLowerCase() ||
                                                                        n.id.toLowerCase() === subItem.label.toLowerCase()
                                                                );
                                                                const isItemActive = pathname.startsWith(subItem.href);
                                                                return (
                                                                    <NavigationMenuLink asChild key={subItem.href}>
                                                                        <Link
                                                                            href={subItem.href}
                                                                            className={cn(
                                                                                'flex flex-col items-center gap-1 px-3 py-2 rounded-md border border-slate-200 hover:border-brand-red hover:bg-slate-50 transition-colors min-w-[64px]',
                                                                                isItemActive && 'border-brand-red bg-slate-50'
                                                                            )}
                                                                        >
                                                                            {network ? (
                                                                                <div className="relative w-8 h-8">
                                                                                    <Image
                                                                                        src={getNetworkImageUrl(network.logo_url)}
                                                                                        alt=""
                                                                                        fill
                                                                                        className="object-contain"
                                                                                    />
                                                                                </div>
                                                                            ) : (
                                                                                <div
                                                                                    className="w-8 h-8 rounded bg-slate-100"/>
                                                                            )}
                                                                            <span className={cn(
                                                                                'text-xs text-slate-600 text-center leading-tight',
                                                                                isItemActive && 'text-brand-red font-medium'
                                                                            )}>
                                                                                {subItem.label}
                                                                            </span>
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {row.items.map((subItem) => {
                                                                const count = cardCounts[subItem.href];
                                                                const isItemActive = pathname.startsWith(subItem.href);
                                                                const isPicks = row.title === 'OpenWallet Picks';
                                                                return (
                                                                    <NavigationMenuLink asChild key={subItem.href}>
                                                                        <Link
                                                                            href={subItem.href}
                                                                            className={cn(
                                                                                '!inline-flex items-center text-sm px-3 py-1.5 rounded-sm border border-dashed transition-colors whitespace-nowrap',
                                                                                isPicks
                                                                                    ? 'bg-amber-50/60 border-amber-200 text-amber-900 hover:border-brand-red hover:text-brand-red'
                                                                                    : 'border-slate-200 text-slate-700 hover:border-brand-red hover:text-brand-red',
                                                                                isItemActive && 'border-brand-red text-brand-red'
                                                                            )}
                                                                        >
                                                                            <span className="flex items-center">
                                                                                {subItem.label}
                                                                                {count !== undefined && (
                                                                                    <span
                                                                                        className="text-slate-400 text-xs ml-1">
                                                                                    ({count})
                                                                                </span>
                                                                                )}
                                                                            </span>
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </Fragment>
                                            ))}
                                            {item.footerLink && (
                                                <div className="mt-3 pt-3 border-t border-slate-100">
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href={item.footerLink.href}
                                                            className="text-base text-brand-red hover:underline font-medium"
                                                        >
                                                            Xem tất cả {totalCards} thẻ từ {totalBanks} ngân hàng →
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </div>
                                            )}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            );
                        }

                        // Columns-based mega menu (legacy fallback)
                        if (item.columns) {
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
