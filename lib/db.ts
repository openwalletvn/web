import Dexie, { type EntityTable } from 'dexie';

export type CardStatus = 'active' | 'expired' | 'canceled';

export interface CreditAccount {
  id: string;
  bankId: string;
  creditLimit: number;
}

export interface WalletCard {
  id: string;
  cardId: string;           // references catalog card
  bankId: string;           // denormalized for quick lookup
  cardType: string;         // 'credit' | '2in1' | 'debit' | 'prepaid'
  nickname?: string;
  creditAccountId?: string; // set for credit/2in1 cards
  isSupplementary?: boolean;
  last4?: string;
  issueDate?: string;       // MM/YY
  validThru?: string;       // MM/YY
  statementDate?: number;
  paymentDueDate?: number;
  status?: CardStatus;
  statusNote?: string;
  note?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Config {
  key: string;
  value: string;
}

export const db = new Dexie('openwallet') as Dexie & {
  walletCards: EntityTable<WalletCard, 'id'>;
  creditAccounts: EntityTable<CreditAccount, 'id'>;
  config: EntityTable<Config, 'key'>;
};

// v1: original userCards table
db.version(1).stores({
  userCards: '++id, catalogId, order',
  config: 'key',
});

// v2: drop userCards, add walletCards + creditAccounts
db.version(2).stores({
  userCards: null,
  walletCards: 'id, bankId, creditAccountId',
  creditAccounts: 'id, bankId',
  config: 'key',
});

// v3: add order index to walletCards
db.version(3).stores({
  walletCards: 'id, bankId, creditAccountId, order',
  creditAccounts: 'id, bankId',
  config: 'key',
});

async function seedConfig() {
  const count = await db.config.count();
  if (count > 0) return;
  await db.config.bulkPut([
    { key: 'walletId', value: crypto.randomUUID() },
    { key: 'walletName', value: 'Ví của tôi' },
    { key: 'schemaVersion', value: '2' },
    { key: 'createdAt', value: new Date().toISOString() },
  ]);
}

if (typeof window !== 'undefined') {
  seedConfig();
}
