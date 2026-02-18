import { db, type UserCard } from './db';

// ─── Gamification (score/level ready for UI, not rendered yet) ────────────────

export type WalletLevel = 'starter' | 'regular' | 'pro' | 'elite';

export const WALLET_LEVELS: Record<WalletLevel, { label: string; minScore: number; color: string }> = {
  starter: { label: 'Starter',  minScore: 0,   color: 'slate'  },
  regular: { label: 'Regular',  minScore: 40,  color: 'blue'   },
  pro:     { label: 'Pro',      minScore: 100, color: 'purple' },
  elite:   { label: 'Elite',    minScore: 200, color: 'amber'  },
};

/** Points per card: 10 base + bonus for each filled optional field */
export function getWalletScore(userCards: UserCard[]): number {
  return userCards.reduce((total, card) => {
    let pts = 10;
    if (card.last4)          pts += 5;
    if (card.statementDate)  pts += 10;
    if (card.paymentDueDate) pts += 10;
    if (card.creditLimit)    pts += 5;
    if (card.note)           pts += 5;
    return total + pts;
  }, 0);
}

export function getWalletLevel(score: number): WalletLevel {
  if (score >= WALLET_LEVELS.elite.minScore)   return 'elite';
  if (score >= WALLET_LEVELS.pro.minScore)     return 'pro';
  if (score >= WALLET_LEVELS.regular.minScore) return 'regular';
  return 'starter';
}

export type CardFormData = {
  catalogId: string;
  last4?: string;
  creditLimit?: number;
  statementDate?: number;
  paymentDueDate?: number;
  note?: string;
};

export async function addCard(data: CardFormData): Promise<number> {
  const id = await db.userCards.add({
    ...data,
    order: Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return id as number;
}

export async function updateCard(id: number, data: Partial<CardFormData>): Promise<void> {
  await db.userCards.update(id, { ...data, updatedAt: new Date() });
}

export async function removeCard(id: number): Promise<void> {
  await db.userCards.delete(id);
}

export async function reorderCards(ordered: UserCard[]): Promise<void> {
  await db.transaction('rw', db.userCards, async () => {
    for (let i = 0; i < ordered.length; i++) {
      await db.userCards.update(ordered[i].id!, { order: i, updatedAt: new Date() });
    }
  });
}
