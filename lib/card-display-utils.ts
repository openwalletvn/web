import type { Card } from '@/lib/api';
import type { WalletCard } from './db';

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

export function formatSiblingNames(
    siblings: WalletCard[],
    siblingCatalogNames: Record<string, string>,
): string {
    const baseNames = siblings.map((s) => s.nickname ?? siblingCatalogNames[s.cardId] ?? s.cardId);

    const noLast4Counts: Record<string, number> = {};
    for (let i = 0; i < siblings.length; i++) {
        if (!siblings[i].last4) {
            noLast4Counts[baseNames[i]] = (noLast4Counts[baseNames[i]] ?? 0) + 1;
        }
    }

    const noLast4Counters: Record<string, number> = {};
    return siblings
        .map((sibling, i) => {
            const name = baseNames[i];
            if (sibling.last4) return `${name} •••• ${sibling.last4}`;
            if (noLast4Counts[name] > 1) {
                noLast4Counters[name] = (noLast4Counters[name] ?? 0) + 1;
                return `${name} ${noLast4Counters[name]}`;
            }
            return name;
        })
        .join(', ');
}
