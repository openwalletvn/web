import { db, type WalletCard } from './db';
import { cleanupOrphanAccounts } from './credit-account';

// ─── Gamification (score/level data layer, no UI yet) ────────────────────────

export type WalletLevel = 'starter' | 'regular' | 'pro' | 'elite';

export const WALLET_LEVELS: Record<WalletLevel, { label: string; minScore: number; color: string }> = {
  starter: { label: 'Starter',  minScore: 0,   color: 'slate'  },
  regular: { label: 'Regular',  minScore: 40,  color: 'blue'   },
  pro:     { label: 'Pro',      minScore: 100, color: 'purple' },
  elite:   { label: 'Elite',    minScore: 200, color: 'amber'  },
};

export function getWalletScore(walletCards: WalletCard[]): number {
  return walletCards.reduce((total, card) => {
    let pts = 10;
    if (card.last4)           pts += 5;
    if (card.statementDate)   pts += 10;
    if (card.paymentDueDate)  pts += 10;
    if (card.creditAccountId) pts += 5;
    if (card.note)            pts += 5;
    return total + pts;
  }, 0);
}

export function getWalletLevel(score: number): WalletLevel {
  if (score >= WALLET_LEVELS.elite.minScore)   return 'elite';
  if (score >= WALLET_LEVELS.pro.minScore)     return 'pro';
  if (score >= WALLET_LEVELS.regular.minScore) return 'regular';
  return 'starter';
}

// ─── Supplementary card check ─────────────────────────────────────────────────

/**
 * Returns true when the wallet already contains another card with the same
 * catalog cardId (same product, same bank). Only then can the current card
 * be marked as supplementary (one primary + one or more supplementary).
 * Excludes expired/canceled cards and optionally the card being edited.
 */
export async function hasCardWithSameCatalogId(
  cardId: string,
  excludeWalletCardId?: string,
): Promise<boolean> {
  const allCards = await db.walletCards.toArray();
  return allCards.some(
    (card) =>
      card.cardId === cardId &&
      card.id !== excludeWalletCardId &&
      card.status !== 'expired' &&
      card.status !== 'canceled',
  );
}

// ─── Card CRUD ───────────────────────────────────────────────────────────────

export type CardFormData = {
  cardId: string;
  bankId: string;
  cardType: string;
  nickname?: string;
  creditAccountId?: string;
  isSupplementary?: boolean;
  last4?: string;
  issueDate?: string;
  validThru?: string;
  statementDate?: number;
  paymentDueDate?: number;
  status?: import('./db').CardStatus;
  statusNote?: string;
  note?: string;
};

export async function addCard(data: CardFormData): Promise<string> {
  const id = crypto.randomUUID();
  await db.walletCards.add({
    ...data,
    id,
    order: Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return id;
}

export async function updateCard(id: string, data: Partial<CardFormData>): Promise<void> {
  await db.walletCards.update(id, { ...data, updatedAt: new Date() });
}

export async function removeCard(id: string): Promise<void> {
  await db.walletCards.delete(id);
  await cleanupOrphanAccounts();
}

export async function reorderCards(ordered: WalletCard[]): Promise<void> {
  await db.transaction('rw', db.walletCards, async () => {
    for (let i = 0; i < ordered.length; i++) {
      await db.walletCards.update(ordered[i].id, { order: i, updatedAt: new Date() });
    }
  });
}
