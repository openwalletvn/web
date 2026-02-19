'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { appDb, type AppWallet } from '@/lib/app-db';
import { WalletDb } from '@/lib/db';

interface WalletDbContextValue {
  db: WalletDb;
  wallet: AppWallet;
}

const WalletDbContext = createContext<WalletDbContextValue | null>(null);

export function WalletDbProvider({ children }: { children: ReactNode }) {
  const activeWalletId = useLiveQuery(
    () => appDb.config.get('activeWalletId').then((c) => c?.value ?? null),
  );

  const activeWallet = useLiveQuery(
    () => (activeWalletId ? appDb.wallets.get(activeWalletId) : undefined),
    [activeWalletId],
  );

  const [walletDb, setWalletDb] = useState<WalletDb | null>(null);

  useEffect(() => {
    if (!activeWalletId) return;
    setWalletDb(new WalletDb(activeWalletId));
  }, [activeWalletId]);

  if (!walletDb || !activeWallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <WalletDbContext.Provider value={{ db: walletDb, wallet: activeWallet }}>
      {children}
    </WalletDbContext.Provider>
  );
}

function useWalletDbContext(): WalletDbContextValue {
  const ctx = useContext(WalletDbContext);
  if (!ctx) throw new Error('useWalletDb must be used inside WalletDbProvider');
  return ctx;
}

export function useWalletDb(): WalletDb {
  return useWalletDbContext().db;
}

export function useActiveWallet(): AppWallet {
  return useWalletDbContext().wallet;
}

/** Switch to a different wallet - triggers page reload so all queries re-initialise. */
export async function switchWallet(walletId: string): Promise<void> {
  await appDb.config.put({ key: 'activeWalletId', value: walletId });
  window.location.reload();
}
