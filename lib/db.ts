import Dexie, { type EntityTable } from 'dexie';

export interface UserCard {
  id?: number;
  catalogId: string;
  last4?: string;
  creditLimit?: number;
  statementDate?: number;
  paymentDueDate?: number;
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
  userCards: EntityTable<UserCard, 'id'>;
  config: EntityTable<Config, 'key'>;
};

db.version(1).stores({
  userCards: '++id, catalogId, order',
  config: 'key',
});

async function seedConfig() {
  const count = await db.config.count();
  if (count > 0) return;
  await db.config.bulkPut([
    { key: 'walletId', value: crypto.randomUUID() },
    { key: 'walletName', value: 'My Wallet' },
    { key: 'schemaVersion', value: '1' },
    { key: 'createdAt', value: new Date().toISOString() },
  ]);
}

if (typeof window !== 'undefined') {
  seedConfig();
}
