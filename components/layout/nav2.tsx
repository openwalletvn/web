'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {TOOLS} from '@/lib/tools';
import {ROUTES} from '@/lib/routes';
import {NAV_LINKS} from '@/lib/nav-links';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
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
    const toolsActive = TOOLS.some((t) => pathname.startsWith(t.href));
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
                    <NavigationMenuTrigger
                        className={cn(triggerClass, toolsActive && 'text-brand-red')}
                        style={textStyle}
                    >
                        <span style={{opacity: 0.3}}>{'{'}</span>
                        <span>Công cụ</span>
                        <span style={{opacity: 0.3}}>{'}'}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-1/2 -translate-x-1/2">
                        <ul className="w-[180px] p-2">
                            {TOOLS.map((tool) => (
                                <li key={tool.href}>
                                    <Link
                                        href={tool.href}
                                        className={cn(
                                            'block px-3 py-2 rounded-2xl text-sm font-medium transition-colors',
                                            pathname.startsWith(tool.href)
                                                ? 'text-brand-red'
                                                : 'text-slate-700 hover:text-brand-red hover:bg-slate-50'
                                        )}
                                    >
                                        {tool.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    );
}
