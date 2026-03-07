import { WalletDb } from './db';
import type { WalletCard } from './db';
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

export async function hasCardWithSameCatalogId(
  db: WalletDb,
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

export async function addCard(db: WalletDb, data: CardFormData): Promise<string> {
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

export async function updateCard(db: WalletDb, id: string, data: Partial<CardFormData>): Promise<void> {
  await db.walletCards.update(id, { ...data, updatedAt: new Date() });
}

export async function removeCard(db: WalletDb, id: string): Promise<void> {
  await db.walletCards.delete(id);
  await cleanupOrphanAccounts(db);
}

export async function reorderCards(db: WalletDb, ordered: WalletCard[]): Promise<void> {
  await db.transaction('rw', db.walletCards, async () => {
    for (let i = 0; i < ordered.length; i++) {
      await db.walletCards.update(ordered[i].id, { order: i, updatedAt: new Date() });
    }
  });
}

// ─── Move card to another wallet ──────────────────────────────────────────────

export interface MoveCardInfo {
  /** The target card plus all pool siblings that will move with it. */
  cardsToMove: WalletCard[];
  /** Number of pool siblings (excludes the target card itself). */
  siblingCount: number;
}

/** Returns which cards will be moved (card + any pool siblings). */
export async function getMoveCardInfo(
  db: WalletDb,
  walletCardId: string,
): Promise<MoveCardInfo> {
  const card = await db.walletCards.get(walletCardId);
  if (!card) return { cardsToMove: [], siblingCount: 0 };

  const cardsToMove: WalletCard[] = [card];

  if (card.creditAccountId) {
    const poolCards = await db.walletCards
      .where('creditAccountId')
      .equals(card.creditAccountId)
      .toArray();
    for (const sibling of poolCards) {
      if (sibling.id !== card.id) cardsToMove.push(sibling);
    }
  }

  return { cardsToMove, siblingCount: cardsToMove.length - 1 };
}

/**
 * Moves a card (and its entire credit pool if any) to a different wallet.
 * All destination writes complete before any source deletes occur.
 */
export async function moveCardToWallet(
  sourceDb: WalletDb,
  walletCardId: string,
  destinationWalletId: string,
): Promise<void> {
  const { cardsToMove } = await getMoveCardInfo(sourceDb, walletCardId);
  if (cardsToMove.length === 0) return;

  const primaryCard = cardsToMove[0];
  const creditAccount = primaryCard.creditAccountId
    ? await sourceDb.creditAccounts.get(primaryCard.creditAccountId)
    : undefined;

  const destDb = new WalletDb(destinationWalletId);

  // Determine base order: append after the last card in destination.
  const destCards = await destDb.walletCards.orderBy('order').toArray();
  const baseOrder = destCards.length > 0
    ? Math.max(...destCards.map((c) => c.order)) + 1
    : Date.now();

  // Write credit account to destination first.
  if (creditAccount) {
    await destDb.creditAccounts.put(creditAccount);
  }

  // Write all cards to destination.
  for (let i = 0; i < cardsToMove.length; i++) {
    await destDb.walletCards.put({
      ...cardsToMove[i],
      order: baseOrder + i,
      updatedAt: new Date(),
    });
  }

  // Delete from source only after destination writes succeed.
  for (const card of cardsToMove) {
    await sourceDb.walletCards.delete(card.id);
  }
  if (creditAccount) {
    await sourceDb.creditAccounts.delete(creditAccount.id);
  }
}
