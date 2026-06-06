'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {TOOLS} from '@/lib/tools';
import {ROUTES} from '@/lib/routes';
import {PersonaModel} from '@/lib/persona-model';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuLink,
} from '@/components/ui/navigation-menu';

const PERSONA_ITEMS = PersonaModel.all().slice(0, 6);

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
    'text-black hover:text-brand-red data-[state=open]:text-brand-red',
    '[&>svg]:hidden'
);

export function Nav2() {
    const pathname = usePathname();
    const toolsActive = TOOLS.some((t) => pathname.startsWith(t.href));
    const cardsActive = pathname.startsWith(ROUTES.cards) || pathname.startsWith('/linh-vuc');

    const plainLinkClass = (active: boolean) =>
        cn(
            'flex flex-row items-center gap-1 transition-colors text-nowrap',
            active ? 'text-brand-red' : 'text-black hover:text-brand-red'
        );

    const PLAIN_LEFT = [{label: 'Ngân hàng', href: ROUTES.banks}];
    const PLAIN_RIGHT = [
        {label: 'Tin tức', href: ROUTES.blog},
        {label: 'Về chúng tôi', href: '/ve-openwallet'},
    ];

    return (
        <NavigationMenu className="ow-nav2 max-w-none xl:gap-8 gap-4" viewport={false}>
            <NavigationMenuList className="gap-8">

                {/* Ngân hàng */}
                {PLAIN_LEFT.map((item) => (
                    <NavigationMenuItem key={item.href}>
                        <Link
                            href={item.href}
                            className={plainLinkClass(pathname.startsWith(item.href))}
                            style={textStyle}
                        >
                            <span style={{opacity: 0.3}}>{'{'}</span>
                            <span>{item.label}</span>
                            <span style={{opacity: 0.3}}>{'}'}</span>
                        </Link>
                    </NavigationMenuItem>
                ))}

                {/* Thẻ - mega menu */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        className={cn(triggerClass, cardsActive && 'text-brand-red')}
                        style={textStyle}
                    >
                        <span style={{opacity: 0.3}}>{'{'}</span>
                        <span>Thẻ</span>
                        <span style={{opacity: 0.3}}>{'}'}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="left-1/2 -translate-x-1/2">
                        <div className="w-[320px] p-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-1">
                                Lĩnh vực
                            </p>
                            <ul className="grid grid-cols-2 gap-1 mb-3">
                                {PERSONA_ITEMS.map((persona) => (
                                    <li key={persona.getSlug()}>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={persona.getHref()}
                                                className={cn(
                                                    'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                                    'text-slate-700 hover:text-brand-red hover:bg-slate-50',
                                                    pathname.startsWith(persona.getHref()) && 'text-brand-red bg-slate-50'
                                                )}
                                            >
                                                {persona.getName()}
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                ))}
                            </ul>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/linh-vuc"
                                    className="flex items-center justify-center w-full px-3 py-2 rounded-md text-sm font-semibold text-brand-red border border-brand-red/30 hover:bg-brand-red/5 transition-colors"
                                >
                                    Xem tất cả nhu cầu →
                                </Link>
                            </NavigationMenuLink>
                            <div className="border-t border-slate-100 mt-3 pt-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={ROUTES.cards}
                                        className={cn(
                                            'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                            pathname === ROUTES.cards
                                                ? 'text-brand-red'
                                                : 'text-slate-700 hover:text-brand-red hover:bg-slate-50'
                                        )}
                                    >
                                        Xem tất cả thẻ
                                    </Link>
                                </NavigationMenuLink>
                            </div>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Tin tức, Về chúng tôi */}
                {PLAIN_RIGHT.map((item) => (
                    <NavigationMenuItem key={item.href}>
                        <Link
                            href={item.href}
                            className={plainLinkClass(pathname.startsWith(item.href))}
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
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={tool.href}
                                            className={cn(
                                                'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                                pathname.startsWith(tool.href)
                                                    ? 'text-brand-red'
                                                    : 'text-slate-700 hover:text-brand-red hover:bg-slate-50'
                                            )}
                                        >
                                            {tool.name}
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    );
}
