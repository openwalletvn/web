'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';

const NAV2_ITEMS = [
    {label: 'Ngân hàng', href: '/ngan-hang'},
    {label: 'Thẻ', href: '/the'},
    {label: 'Tin tức', href: '/tin-tuc'},
    {label: 'So sánh', href: '/so-sanh'},
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
        </nav>
    );
}
