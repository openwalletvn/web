import { db, type WalletCard, type CreditAccount } from './db';

interface WalletBackup {
  walletId: string;
  walletName: string;
  schemaVersion: string;
  createdAt: string;
  exportedAt: string;
  walletCards: WalletCard[];
  creditAccounts: CreditAccount[];
}

export async function exportWallet(): Promise<void> {
  const [walletCards, creditAccounts, configEntries] = await Promise.all([
    db.walletCards.toArray(),
    db.creditAccounts.toArray(),
    db.config.toArray(),
  ]);

  const config = Object.fromEntries(configEntries.map(({ key, value }) => [key, value]));

  const backup: WalletBackup = {
    walletId: config.walletId ?? '',
    walletName: config.walletName ?? 'Ví của tôi',
    schemaVersion: '2',
    createdAt: config.createdAt ?? new Date().toISOString(),
    exportedAt: new Date().toISOString(),
    walletCards,
    creditAccounts,
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

  if (data.schemaVersion !== '2') {
    throw new Error(`Định dạng sao lưu không tương thích (phiên bản ${data.schemaVersion})`);
  }

  await db.transaction('rw', [db.walletCards, db.creditAccounts, db.config], async () => {
    await db.walletCards.clear();
    await db.creditAccounts.clear();
    await db.config.clear();

    if (data.creditAccounts?.length) {
      await db.creditAccounts.bulkAdd(data.creditAccounts);
    }

    if (data.walletCards?.length) {
      const cards = data.walletCards.map((card) => ({
        ...card,
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      }));
      await db.walletCards.bulkAdd(cards);
    }

    await db.config.bulkPut([
      { key: 'walletId', value: data.walletId ?? crypto.randomUUID() },
      { key: 'walletName', value: data.walletName ?? 'Ví của tôi' },
      { key: 'schemaVersion', value: '2' },
      { key: 'createdAt', value: data.createdAt ?? new Date().toISOString() },
    ]);
  });
}
