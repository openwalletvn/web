import type {Card} from '@/lib/api';

export const CATCHALL_SLUGS = new Set(['all', 'all-online', 'all-offline']);

export function getRateDisplay(card: Card, intentSlug?: string): string {
    const rules = card.cashback?.rules ?? [];
    const matched = intentSlug
        ? rules.filter(r => r.intents?.includes(intentSlug) || r.merchants?.includes(intentSlug))
        : [];
    const relevant = matched.length > 0
        ? matched
        : rules.filter(r => r.intents?.some(c => CATCHALL_SLUGS.has(c)));
    if (!relevant.length) return '';
    const rates = relevant.flatMap(r => [r.rate, ...(r.rate_max != null ? [r.rate_max] : [])]);
    const min = Math.min(...rates) * 100;
    const max = Math.max(...rates) * 100;
    const fmt = (n: number) => Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.?0+$/, '');
    return min === max ? `${fmt(min)}%` : `${fmt(min)}%–${fmt(max)}%`;
}
