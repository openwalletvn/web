import Dexie, { type EntityTable } from 'dexie';

export interface AppWallet {
  id: string;
  name: string;
  createdAt: Date;
}

interface AppConfig {
  key: string;
  value: string;
}

class AppDatabase extends Dexie {
  wallets!: EntityTable<AppWallet, 'id'>;
  config!: EntityTable<AppConfig, 'key'>;

  constructor() {
    super('openwallet-app');
    this.version(1).stores({
      wallets: 'id, name',
      config: 'key',
    });
  }
}

export const appDb = new AppDatabase();

async function seed() {
  const existing = await appDb.config.get('activeWalletId');
  if (existing) return;

  const walletId = crypto.randomUUID();
  await appDb.transaction('rw', [appDb.wallets, appDb.config], async () => {
    await appDb.wallets.add({ id: walletId, name: 'Ví của tôi', createdAt: new Date() });
    await appDb.config.bulkPut([
      { key: 'activeWalletId', value: walletId },
      { key: 'isPremium', value: 'true' },
    ]);
  });
}

if (typeof window !== 'undefined') {
  seed();
}
