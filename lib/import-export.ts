import { appDb, type Account, type AppWallet, type NotificationAdapter } from './app-db';
import { WalletDb, type WalletCard, type CreditAccount, type WalletConfig } from './db';

const SCHEMA_VERSION = '4';

export interface WalletSummaryItem {
  id: string;
  name: string;
  cardCount: number;
}

export interface ReminderSummaryItem {
  id: string;
  enabled: boolean;
}

export interface BackupSummary {
  wallets: WalletSummaryItem[];
  reminders: ReminderSummaryItem[];
}

interface WalletData {
  wallet: AppWallet;
  walletCards: WalletCard[];
  creditAccounts: CreditAccount[];
  walletConfig: WalletConfig[];
}

interface AppConfig {
  key: string;
  value: string;
}

interface FullBackup {
  version: string;
  exportedAt: string;
  account: Account;
  wallets: WalletData[];
  appConfig: AppConfig[];
  notificationAdapters: NotificationAdapter[];
}

function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function buildWalletsData(): Promise<WalletData[]> {
  const wallets = await appDb.wallets.toArray();
  return Promise.all(
    wallets.map(async (wallet) => {
      const db = new WalletDb(wallet.id);
      const [walletCards, creditAccounts, walletConfig] = await Promise.all([
        db.walletCards.toArray(),
        db.creditAccounts.toArray(),
        db.config.toArray(),
      ]);
      return { wallet, walletCards, creditAccounts, walletConfig };
    }),
  );
}

/** Build the full backup object without downloading it (useful for previewing). */
export async function buildFullBackupData(): Promise<FullBackup> {
  const [accounts, walletsData, appConfig, notificationAdapters] = await Promise.all([
    appDb.accounts.toArray(),
    buildWalletsData(),
    appDb.config.toArray(),
    appDb.notificationAdapters.toArray(),
  ]);
  return {
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    account: accounts[0],
    wallets: walletsData,
    appConfig,
    notificationAdapters,
  };
}

/** Get a summary of all local data with per-wallet and per-reminder detail. */
export async function getLocalSummary(): Promise<BackupSummary> {
  const [wallets, notificationAdapters] = await Promise.all([
    appDb.wallets.toArray(),
    appDb.notificationAdapters.toArray(),
  ]);
  const walletItems: WalletSummaryItem[] = await Promise.all(
    wallets.map(async (wallet) => ({
      id: wallet.id,
      name: wallet.name,
      cardCount: await new WalletDb(wallet.id).walletCards.count(),
    })),
  );
  return {
    wallets: walletItems,
    reminders: notificationAdapters.map((a) => ({ id: a.id, enabled: a.enabled })),
  };
}

/** Parse a backup file and return its summary without committing any changes. */
export async function parseBackupSummary(file: File): Promise<BackupSummary> {
  const text = await file.text();
  const data = JSON.parse(text) as Partial<FullBackup>;
  const wallets = data.wallets ?? [];
  return {
    wallets: wallets.map((w) => ({
      id: w.wallet?.id ?? '',
      name: w.wallet?.name ?? 'Không rõ',
      cardCount: w.walletCards?.length ?? 0,
    })),
    reminders: (data.notificationAdapters ?? []).map((a) => ({ id: a.id, enabled: a.enabled })),
  };
}

function buildFileName(accountId: string | undefined, now: Date): string {
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const accountShort = accountId?.slice(0, 8) ?? 'local';
  return `openwallet-${accountShort}-${date}-${time}.json`;
}

/** Returns a display-friendly filename with time hidden (time varies at export moment). */
export async function getExportFileName(): Promise<string> {
  const account = (await appDb.accounts.toArray())[0];
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const accountShort = account?.id?.slice(0, 8) ?? 'local';
  return `openwallet-${accountShort}-${date}-[...].json`;
}

/** Export a full backup of all wallets, cards, app config, and notification adapters. */
export async function exportFullBackup(): Promise<void> {
  const backup = await buildFullBackupData();
  downloadJson(backup, buildFileName(backup.account?.id, new Date()));
}

/** Delete all local data - wallets, cards, account, config, everything. */
export async function clearAllData(): Promise<void> {
  const existingWallets = await appDb.wallets.toArray();
  await Promise.all(
    existingWallets.map(async (wallet) => {
      const db = new WalletDb(wallet.id);
      await db.transaction('rw', [db.walletCards, db.creditAccounts, db.config], async () => {
        await Promise.all([db.walletCards.clear(), db.creditAccounts.clear(), db.config.clear()]);
      });
    }),
  );
  await appDb.transaction('rw', [appDb.accounts, appDb.wallets, appDb.config, appDb.notificationAdapters], async () => {
    await Promise.all([appDb.accounts.clear(), appDb.wallets.clear(), appDb.config.clear(), appDb.notificationAdapters.clear()]);
  });
}

/** Import a full backup, replacing all current data. */
export async function importFullBackup(file: File): Promise<void> {
  const text = await file.text();
  const data = JSON.parse(text) as FullBackup;

  // Clear existing per-wallet data
  const existingWallets = await appDb.wallets.toArray();
  await Promise.all(
    existingWallets.map(async (wallet) => {
      const db = new WalletDb(wallet.id);
      await db.transaction('rw', [db.walletCards, db.creditAccounts, db.config], async () => {
        await Promise.all([db.walletCards.clear(), db.creditAccounts.clear(), db.config.clear()]);
      });
    }),
  );

  // Clear app-level data
  await appDb.transaction('rw', [appDb.accounts, appDb.wallets, appDb.config, appDb.notificationAdapters], async () => {
    await Promise.all([appDb.accounts.clear(), appDb.wallets.clear(), appDb.config.clear(), appDb.notificationAdapters.clear()]);
  });

  // Restore wallets and their data
  await Promise.all(
    (data.wallets ?? []).map(async ({ wallet, walletCards, creditAccounts, walletConfig }) => {
      await appDb.wallets.add({ ...wallet, createdAt: new Date(wallet.createdAt as unknown as string) });
      const db = new WalletDb(wallet.id);
      await db.transaction('rw', [db.walletCards, db.creditAccounts, db.config], async () => {
        if (creditAccounts?.length) await db.creditAccounts.bulkAdd(creditAccounts);
        if (walletCards?.length) {
          await db.walletCards.bulkAdd(
            walletCards.map((c) => ({
              ...c,
              createdAt: new Date(c.createdAt),
              updatedAt: new Date(c.updatedAt),
            })),
          );
        }
        if (walletConfig?.length) await db.config.bulkPut(walletConfig);
      });
    }),
  );

  // Restore account, app config, and notification adapters
  if (data.account) await appDb.accounts.put(data.account);
  if (data.appConfig?.length) await appDb.config.bulkPut(data.appConfig);
  if (data.notificationAdapters?.length) await appDb.notificationAdapters.bulkPut(data.notificationAdapters);
}
