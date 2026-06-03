'use client';

import Link from 'next/link';
import {useState} from 'react';
import {usePathname} from 'next/navigation';
import {IconMenu2, IconChevronDown} from '@tabler/icons-react';
import {Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle} from '@/components/ui/sheet';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {cn} from '@/lib/utils';
import {ROUTES} from '@/lib/routes';
import {TOOLS} from '@/lib/tools';
import {PersonaModel} from '@/lib/persona-model';

const PERSONA_ITEMS = PersonaModel.all().slice(0, 6);

const PLAIN_LINKS = [
    {label: 'Ngân hàng', href: ROUTES.banks},
    {label: 'Tin tức', href: ROUTES.blog},
    {label: 'Về chúng tôi', href: '/ve-openwallet'},
];

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    const cardsActive = pathname.startsWith(ROUTES.cards) || pathname.startsWith('/linh-vuc');
    const toolsActive = TOOLS.some((t) => pathname.startsWith(t.href));

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-slate-600 hover:text-slate-900" aria-label="Open menu">
                    <IconMenu2 className="w-5 h-5" aria-hidden="true"/>
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-left">
                        <Link href="/" onClick={close} className="font-bold text-slate-900">OpenWallet</Link>
                    </SheetTitle>
                </SheetHeader>

                <nav className="mt-6 flex flex-col gap-1">

                    {/* Ngân hàng */}
                    <Link
                        href={ROUTES.banks}
                        onClick={close}
                        className={cn(
                            'px-3 py-2 rounded-md text-base font-medium transition-colors',
                            pathname.startsWith(ROUTES.banks) ? 'text-brand-red' : 'text-slate-700 hover:bg-slate-100'
                        )}
                    >
                        Ngân hàng
                    </Link>

                    {/* Thẻ — collapsible */}
                    <Collapsible defaultOpen={cardsActive}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                            <span className={cn(cardsActive && 'text-brand-red')}>Thẻ</span>
                            <IconChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true"/>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="mt-1 ml-3 flex flex-col gap-1">
                                <p className="px-2 pt-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                    Lĩnh vực
                                </p>
                                {PERSONA_ITEMS.map((persona) => (
                                    <Link
                                        key={persona.getSlug()}
                                        href={persona.getHref()}
                                        onClick={close}
                                        className={cn(
                                            'px-2 py-1.5 rounded-md text-sm transition-colors',
                                            pathname.startsWith(persona.getHref())
                                                ? 'text-brand-red'
                                                : 'text-slate-700 hover:text-brand-red'
                                        )}
                                    >
                                        {persona.getName()}
                                    </Link>
                                ))}
                                <Link
                                    href="/linh-vuc"
                                    onClick={close}
                                    className="px-2 py-1.5 text-sm font-semibold text-brand-red hover:underline"
                                >
                                    Xem tất cả nhu cầu →
                                </Link>
                                <div className="border-t border-slate-100 mt-1 pt-1">
                                    <Link
                                        href={ROUTES.cards}
                                        onClick={close}
                                        className={cn(
                                            'block px-2 py-1.5 rounded-md text-sm transition-colors',
                                            pathname === ROUTES.cards
                                                ? 'text-brand-red'
                                                : 'text-slate-700 hover:text-brand-red'
                                        )}
                                    >
                                        Xem tất cả thẻ
                                    </Link>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Tin tức, Về chúng tôi */}
                    {PLAIN_LINKS.slice(1).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={close}
                            className={cn(
                                'px-3 py-2 rounded-md text-base font-medium transition-colors',
                                pathname.startsWith(item.href) ? 'text-brand-red' : 'text-slate-700 hover:bg-slate-100'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Công cụ — collapsible */}
                    <Collapsible defaultOpen={toolsActive}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                            <span className={cn(toolsActive && 'text-brand-red')}>Công cụ</span>
                            <IconChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true"/>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="mt-1 ml-3 flex flex-col gap-1">
                                {TOOLS.map((tool) => (
                                    <Link
                                        key={tool.href}
                                        href={tool.href}
                                        onClick={close}
                                        className={cn(
                                            'px-2 py-1.5 rounded-md text-sm transition-colors',
                                            pathname.startsWith(tool.href)
                                                ? 'text-brand-red'
                                                : 'text-slate-700 hover:text-brand-red'
                                        )}
                                    >
                                        {tool.name}
                                    </Link>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                </nav>
            </SheetContent>
        </Sheet>
    );
}
