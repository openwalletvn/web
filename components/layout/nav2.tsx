'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {TOOLS} from '@/lib/tools';

const NAV2_ITEMS = [
    {label: 'Ngân hàng', href: '/ngan-hang'},
    {label: 'Thẻ', href: '/the'},
    {label: 'Tin tức', href: '/tin-tuc'},
    {label: 'Về chúng tôi', href: '/ve-openwallet'},
];

const textStyle: React.CSSProperties = {
    fontFamily: "'Inter Tight', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '130%',
    letterSpacing: '1px',
    textTransform: 'uppercase',
};

export function Nav2() {
    const pathname = usePathname();
    const toolsActive = TOOLS.some((t) => pathname.startsWith(t.href));

    return (
        <nav className="ow-nav2 flex flex-row items-center xl:gap-8 gap-4">
            {NAV2_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex flex-row items-center gap-1 transition-colors text-nowrap',
                            isActive ? 'text-brand-red' : 'text-black hover:text-brand-red'
                        )}
                        style={textStyle}
                    >
                        <span style={{opacity: 0.3}}>{'{'}</span>
                        <span>{item.label}</span>
                        <span style={{opacity: 0.3}}>{'}'}</span>
                    </Link>
                );
            })}

            {/* Công cụ hover dropdown */}
            <div className="relative group">
                <button
                    className={cn(
                        'flex flex-row items-center gap-1 transition-colors text-nowrap cursor-pointer',
                        toolsActive ? 'text-brand-red' : 'text-black hover:text-brand-red'
                    )}
                    style={textStyle}
                >
                    <span style={{opacity: 0.3}}>{'{'}</span>
                    <span>Công cụ</span>
                    <span style={{opacity: 0.3}}>{'}'}</span>
                </button>
                <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-2 min-w-[160px]">
                        {TOOLS.map((tool) => (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className={cn(
                                    'block px-4 py-2 text-sm font-medium transition-colors',
                                    pathname.startsWith(tool.href)
                                        ? 'text-brand-red'
                                        : 'text-slate-700 hover:text-brand-red hover:bg-slate-50'
                                )}
                            >
                                {tool.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
