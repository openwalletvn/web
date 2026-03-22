'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Silently redirects /so-sanh/X-vs-Y 404s to /so-sanh?compare=X,Y
 * so the interactive compare section handles the pair instead of showing a blank 404.
 */
export function SoSanh404Redirect() {
    const router = useRouter();

    useEffect(() => {
        const path = window.location.pathname;
        const match = path.match(/^\/so-sanh\/(.+)$/);
        if (!match) return;

        const pair = match[1];
        const vsIndex = pair.indexOf('-vs-');
        if (vsIndex === -1) return;

        const idA = pair.slice(0, vsIndex);
        const idB = pair.slice(vsIndex + 4);
        router.replace(`/so-sanh?compare=${idA},${idB}`);
    }, [router]);

    return null;
}
