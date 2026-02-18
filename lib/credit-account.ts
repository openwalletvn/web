import type { WalletDb, CreditAccount, WalletCard } from './db';

export async function createCreditAccount(db: WalletDb, bankId: string, creditLimit: number): Promise<CreditAccount> {
  const account: CreditAccount = {
    id: crypto.randomUUID(),
    bankId,
    creditLimit,
  };
  await db.creditAccounts.add(account);
  return account;
}

export async function getCreditAccountsForBank(db: WalletDb, bankId: string): Promise<CreditAccount[]> {
  return db.creditAccounts.where('bankId').equals(bankId).toArray();
}

export async function getCardsForCreditAccount(db: WalletDb, creditAccountId: string): Promise<WalletCard[]> {
  return db.walletCards.where('creditAccountId').equals(creditAccountId).toArray();
}

export async function cleanupOrphanAccounts(db: WalletDb): Promise<void> {
  const allAccounts = await db.creditAccounts.toArray();
  const orphanIds: string[] = [];
  for (const account of allAccounts) {
    const count = await db.walletCards
      .where('creditAccountId')
      .equals(account.id)
      .count();
    if (count === 0) orphanIds.push(account.id);
  }
  if (orphanIds.length > 0) {
    await db.creditAccounts.bulkDelete(orphanIds);
  }
}

export async function unlinkCardFromPool(db: WalletDb, card: WalletCard): Promise<void> {
  if (!card.creditAccountId) return;
  const originalAccount = await db.creditAccounts.get(card.creditAccountId);
  if (!originalAccount) return;

  const newAccountId = crypto.randomUUID();
  await db.transaction('rw', [db.creditAccounts, db.walletCards], async () => {
    await db.creditAccounts.add({
      id: newAccountId,
      bankId: card.bankId,
      creditLimit: originalAccount.creditLimit,
    });
    await db.walletCards.update(card.id, {
      creditAccountId: newAccountId,
      isSupplementary: false,
      updatedAt: new Date(),
    });
  });
}

export async function reassignCardToAccount(db: WalletDb, cardId: string, newCreditAccountId: string): Promise<void> {
  await db.walletCards.update(cardId, {
    creditAccountId: newCreditAccountId,
    updatedAt: new Date(),
  });
  await cleanupOrphanAccounts(db);
}
