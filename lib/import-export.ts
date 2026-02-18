import { db, type UserCard } from './db';

interface WalletBackup {
  walletId: string;
  walletName: string;
  schemaVersion: string;
  createdAt: string;
  exportedAt: string;
  userCards: UserCard[];
}

export async function exportWallet(): Promise<void> {
  const [userCards, configEntries] = await Promise.all([
    db.userCards.toArray(),
    db.config.toArray(),
  ]);

  const config = Object.fromEntries(configEntries.map(({ key, value }) => [key, value]));

  const backup: WalletBackup = {
    walletId: config.walletId ?? '',
    walletName: config.walletName ?? 'My Wallet',
    schemaVersion: config.schemaVersion ?? '1',
    createdAt: config.createdAt ?? new Date().toISOString(),
    exportedAt: new Date().toISOString(),
    userCards,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `openwallet-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importWallet(file: File): Promise<void> {
  const text = await file.text();
  const data: WalletBackup = JSON.parse(text);

  if (data.schemaVersion !== '1') {
    throw new Error(`Incompatible backup version: ${data.schemaVersion}`);
  }

  await db.transaction('rw', [db.userCards, db.config], async () => {
    await db.userCards.clear();
    await db.config.clear();

    if (data.userCards?.length) {
      const cards = data.userCards.map(({ id: _id, ...card }) => ({
        ...card,
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      }));
      await db.userCards.bulkAdd(cards);
    }

    await db.config.bulkPut([
      { key: 'walletId', value: data.walletId ?? crypto.randomUUID() },
      { key: 'walletName', value: data.walletName ?? 'My Wallet' },
      { key: 'schemaVersion', value: '1' },
      { key: 'createdAt', value: data.createdAt ?? new Date().toISOString() },
    ]);
  });
}
