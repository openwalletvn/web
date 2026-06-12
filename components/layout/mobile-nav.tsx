'use client';

import Link from 'next/link';
import {useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import {IconMenu2} from '@tabler/icons-react';
import {Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle} from '@/components/ui/sheet';
import {cn} from '@/lib/utils';
import {ROUTES} from '@/lib/routes';
import {NAV_LINKS} from '@/lib/nav-links';

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const scrollTargetRef = useRef<string | null>(null);
    const close = () => setOpen(false);

    const cardsActive = pathname.startsWith(ROUTES.cards) || pathname.startsWith('/linh-vuc');
    const toolsActive = [ROUTES.cardMatch, ROUTES.cardBattle, ROUTES.owieChat, ROUTES.openwalletMcp].some((href) => pathname.startsWith(href));

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-slate-600 hover:text-slate-900" aria-label="Open menu">
                    <IconMenu2 className="w-5 h-5" aria-hidden="true"/>
                </button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-72 overflow-y-auto"
                onCloseAutoFocus={(e) => {
                    if (scrollTargetRef.current) {
                        e.preventDefault();
                        const el = document.getElementById(scrollTargetRef.current);
                        el?.scrollIntoView({behavior: 'smooth', block: 'start'});
                        scrollTargetRef.current = null;
                    }
                }}
            >
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

                    {/* Công cụ */}
                    <Link
                        href="/#cong-cu"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTargetRef.current = 'cong-cu';
                            close();
                        }}
                        className={cn(
                            'px-3 py-2 rounded-2xl text-base font-medium transition-colors',
                            toolsActive ? 'text-brand-red' : 'text-slate-700 hover:bg-slate-100'
                        )}
                    >
                        Công cụ
                    </Link>

                </nav>
            </SheetContent>
        </Sheet>
    );
}
