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
import {NAV_LINKS} from '@/lib/nav-links';

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

                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={close}
                            className={cn(
                                'px-3 py-2 rounded-2xl text-base font-medium transition-colors',
                                (item.href === ROUTES.cards ? cardsActive : pathname.startsWith(item.href))
                                    ? 'text-brand-red'
                                    : 'text-slate-700 hover:bg-slate-100'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Công cụ - collapsible */}
                    <Collapsible defaultOpen={toolsActive}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-2xl text-base font-medium text-slate-700 hover:bg-slate-100 transition-colors">
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
                                            'px-2 py-1.5 rounded-2xl text-sm transition-colors',
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
