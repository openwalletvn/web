import Dexie, { type EntityTable } from 'dexie';

export interface Account {
  id: string;                                       // UUID, generated locally — will be the server account ID when sync enabled
  email?: string;                                   // null until auth/sync
  created_at: string;                               // ISO timestamp
  last_login_at?: string;
  early_adopter: boolean;
  pro_reason?: 'paid' | 'early_adopter' | 'promo';
  sync_enabled: boolean;
}

export interface AppWallet {
  id: string;
  name: string;
  createdAt: Date;
}

interface AppConfig {
  key: string;
  value: string;
}

export interface NotificationAdapter {
  id: 'discord' | 'telegram' | 'email';
  config: Record<string, string>;
  enabled: boolean;
  lastStatus?: 'ok' | 'failed';
  lastCheckedAt?: string;
}

class AppDatabase extends Dexie {
  accounts!: EntityTable<Account, 'id'>;
  wallets!: EntityTable<AppWallet, 'id'>;
  config!: EntityTable<AppConfig, 'key'>;
  notificationAdapters!: EntityTable<NotificationAdapter, 'id'>;

  constructor() {
    super('openwallet-app');
    this.version(1).stores({
      wallets: 'id, name',
      config: 'key',
    });
    this.version(2).stores({
      wallets: 'id, name',
      config: 'key',
      notificationAdapters: 'id',
    });
    this.version(3).stores({
      accounts: 'id',
      wallets: 'id, name',
      config: 'key',
      notificationAdapters: 'id',
    });
  }
}

export const appDb = new AppDatabase();

async function seed() {
  const existing = await appDb.config.get('activeWalletId');

  if (existing) {
    // Validate the wallet the config points to still exists
    const wallet = await appDb.wallets.get(existing.value);
    if (!wallet) {
      // Orphaned activeWalletId — point to first available wallet or create one
      const first = await appDb.wallets.toArray().then((ws) => ws[0]);
      if (first) {
        await appDb.config.put({ key: 'activeWalletId', value: first.id });
      } else {
        const walletId = crypto.randomUUID();
        await appDb.wallets.add({ id: walletId, name: 'Ví của tôi', createdAt: new Date() });
        await appDb.config.put({ key: 'activeWalletId', value: walletId });
      }
    }

    // Ensure account exists
    const accountCount = await appDb.accounts.count();
    if (accountCount === 0) {
      await appDb.accounts.add({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        early_adopter: false,
        sync_enabled: false,
      });
    }
    return;
  }

  // New user — seed everything
  const walletId = crypto.randomUUID();
  const accountId = crypto.randomUUID();

  await appDb.transaction('rw', [appDb.accounts, appDb.wallets, appDb.config], async () => {
    await appDb.accounts.add({
      id: accountId,
      created_at: new Date().toISOString(),
      early_adopter: false,
      sync_enabled: false,
    });
    await appDb.wallets.add({ id: walletId, name: 'Ví của tôi', createdAt: new Date() });
    await appDb.config.bulkPut([
      { key: 'activeWalletId', value: walletId },
      { key: 'isPremium', value: 'false' },
    ]);
  });
}

if (typeof window !== 'undefined') {
  seed();
}
