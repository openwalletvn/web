import { appDb, type AppWallet } from './app-db';
import { WalletDb, type WalletCard, type CreditAccount } from './db';

const SCHEMA_VERSION = '3';

interface WalletBackup {
  version: string;
  walletId: string;
  walletName: string;
  exportedAt: string;
  walletCards: WalletCard[];
  creditAccounts: CreditAccount[];
}

interface AllWalletsBackup {
  version: string;
  exportedAt: string;
  wallets: Array<{
    wallet: AppWallet;
    walletCards: WalletCard[];
    creditAccounts: CreditAccount[];
  }>;
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

/** Export a single wallet to a JSON file. */
export async function exportWallet(db: WalletDb, wallet: AppWallet): Promise<void> {
  const [walletCards, creditAccounts] = await Promise.all([
    db.walletCards.toArray(),
    db.creditAccounts.toArray(),
  ]);

  const backup: WalletBackup = {
    version: SCHEMA_VERSION,
    walletId: wallet.id,
    walletName: wallet.name,
    exportedAt: new Date().toISOString(),
    walletCards,
    creditAccounts,
  };

  const date = new Date().toISOString().split('T')[0];
  downloadJson(backup, `openwallet-${wallet.name}-${date}.json`);
}

/** Export all wallets to a single JSON file. */
export async function exportAllWallets(): Promise<void> {
  const wallets = await appDb.wallets.toArray();

  const walletsData = await Promise.all(
    wallets.map(async (wallet) => {
      const db = new WalletDb(wallet.id);
      const [walletCards, creditAccounts] = await Promise.all([
        db.walletCards.toArray(),
        db.creditAccounts.toArray(),
      ]);
      return { wallet, walletCards, creditAccounts };
    }),
  );

  const backup: AllWalletsBackup = {
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    wallets: walletsData,
  };

  const date = new Date().toISOString().split('T')[0];
  downloadJson(backup, `openwallet-all-${date}.json`);
}

/** Import a wallet backup as a NEW wallet. Returns the new wallet ID. */
export async function importAsNewWallet(file: File): Promise<string> {
  const text = await file.text();
  const data: WalletBackup = JSON.parse(text);

  const newWalletId = crypto.randomUUID();
  const walletName = data.walletName ?? 'Imported Wallet';

  await appDb.wallets.add({
    id: newWalletId,
    name: walletName,
    createdAt: new Date(),
  });

  const newDb = new WalletDb(newWalletId);
  await newDb.transaction('rw', [newDb.walletCards, newDb.creditAccounts], async () => {
    if (data.creditAccounts?.length) {
      await newDb.creditAccounts.bulkAdd(data.creditAccounts);
    }
    if (data.walletCards?.length) {
      const cards = data.walletCards.map((card) => ({
        ...card,
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      }));
      await newDb.walletCards.bulkAdd(cards);
    }
  });

  return newWalletId;
}
