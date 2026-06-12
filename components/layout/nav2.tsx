'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {ROUTES} from '@/lib/routes';
import {NAV_LINKS} from '@/lib/nav-links';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';


const textStyle: React.CSSProperties = {
    fontFamily: "'Inter Tight', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '130%',
    letterSpacing: '1px',
    textTransform: 'uppercase',
};

const triggerClass = cn(
    'flex flex-row items-center gap-1 transition-colors text-nowrap cursor-pointer',
    'bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent',
    'h-auto px-0 py-0 rounded-none shadow-none',
    'text-text-muted hover:text-brand-red data-[state=open]:text-brand-red',
    '[&>svg]:hidden'
);

export function Nav2() {
    const pathname = usePathname();
    const toolsActive = [ROUTES.cardMatch, ROUTES.cardBattle, ROUTES.owieChat, ROUTES.openwalletMcp].some((href) => pathname.startsWith(href));
    const cardsActive = pathname.startsWith(ROUTES.cards) || pathname.startsWith('/linh-vuc');

    const plainLinkClass = (active: boolean) =>
        cn(
            'flex flex-row items-center gap-1 transition-colors text-nowrap',
            active ? 'text-brand-red' : 'text-text-muted hover:text-brand-red'
        );

    return (
        <NavigationMenu className="ow-nav2 max-w-none xl:gap-8 gap-4" viewport={false}>
            <NavigationMenuList className="gap-8">

                {NAV_LINKS.map((item) => (
                    <NavigationMenuItem key={item.href}>
                        <Link
                            href={item.href}
                            className={plainLinkClass(
                                item.href === ROUTES.cards
                                    ? cardsActive
                                    : pathname.startsWith(item.href)
                            )}
                            style={textStyle}
                        >
                            <span style={{opacity: 0.3}}>{'{'}</span>
                            <span>{item.label}</span>
                            <span style={{opacity: 0.3}}>{'}'}</span>
                        </Link>
                    </NavigationMenuItem>
                ))}

                {/* Công cụ */}
                <NavigationMenuItem>
                    <Link
                        href="/#cong-cu"
                        className={cn(triggerClass, toolsActive && 'text-brand-red')}
                        style={textStyle}
                    >
                        <span style={{opacity: 0.3}}>{'{'}</span>
                        <span>Công cụ</span>
                        <span style={{opacity: 0.3}}>{'}'}</span>
                    </Link>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    );
}
