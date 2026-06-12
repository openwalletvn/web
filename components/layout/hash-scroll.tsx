'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

export function HashScroll() {
    const pathname = usePathname();

    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (!hash) return;
        const el = document.getElementById(hash);
        if (!el) return;
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, [pathname]);

    // Also handle same-page hash link clicks (OverlayScrollbars intercepts native behavior)
    useEffect(() => {
        function onClick(e: MouseEvent) {
            const anchor = (e.target as Element).closest('a');
            if (!anchor) return;
            const url = new URL(anchor.href, location.href);
            if (url.pathname !== location.pathname && url.pathname !== '/') return;
            if (!url.hash) return;
            const el = document.getElementById(url.hash.slice(1));
            if (!el) return;
            e.preventDefault();
            history.pushState(null, '', url.hash);
            el.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    return null;
}
