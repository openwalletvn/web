import type { WalletCard } from './db';

/**
 * Format the list of sibling card names for the shared-pool warning.
 * Each card is shown as "Catalog Name •••• last4" when last4 is available.
 * When multiple cards share the same catalog name and have no last4,
 * they get a numeric suffix (1, 2, 3…).
 */
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
