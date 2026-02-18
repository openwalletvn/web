import { db, type UserCard } from './db';

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
