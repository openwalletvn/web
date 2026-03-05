'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconDeviceFloppy, IconCheck, IconTrash } from '@tabler/icons-react';
import Dexie from 'dexie';
import { appDb } from '@/lib/app-db';
import { switchWallet, useActiveWallet } from '@/providers/wallet-db-provider';

export default function WalletSettingsPage() {
  const activeWallet = useActiveWallet();
  const wallets = useLiveQuery(() => appDb.wallets.toArray(), [], []);

  const [walletName, setWalletName] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    setWalletName(activeWallet.name);
  }, [activeWallet.name]);

  async function handleDeleteWallet(walletId: string, walletName: string) {
    if (!window.confirm(`Xóa ví "${walletName}"? Toàn bộ thẻ và dữ liệu trong ví này sẽ bị mất vĩnh viễn.`)) return;
    await appDb.wallets.delete(walletId);
    await Dexie.delete(`openwallet-wallet-${walletId}`);
  }

  async function handleSaveName() {
    if (!walletName.trim()) return;
    await appDb.wallets.update(activeWallet.id, { name: walletName.trim() });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  }

  return (
    <>
      {/* Wallet name */}
      <section className="mb-8">
        <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">Tên ví</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            className="flex-1 px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-brand-blue text-sm"
          />
          <button
            onClick={handleSaveName}
            className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-slate-300 rounded-sm text-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            {nameSaved ? <IconCheck size={15} className="text-green-500" /> : <IconDeviceFloppy size={15} />}
            {nameSaved ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </section>

      {/* Wallet list */}
      {(wallets ?? []).length > 1 && (
        <>
          <div className="border-t border-dashed border-slate-200 mb-8" />
          <section className="mb-8">
            <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">Các ví</h2>
            <div className="space-y-2">
              {(wallets ?? []).map((wallet) => {
                const isActive = wallet.id === activeWallet.id;
                return (
                  <div
                    key={wallet.id}
                    className={`flex items-center gap-2 p-3 border border-dashed rounded-sm transition-colors ${
                      isActive ? 'border-brand-blue bg-blue-50/40' : 'border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => !isActive && switchWallet(wallet.id)}
                      className={`flex-1 text-left text-sm font-medium transition-colors ${
                        isActive ? 'text-brand-blue cursor-default' : 'text-slate-700 hover:text-slate-900 cursor-pointer'
                      }`}
                    >
                      {wallet.name}
                    </button>
                    {isActive ? (
                      <span className="text-xs border border-dashed border-brand-blue text-brand-blue px-1.5 py-0.5 rounded-sm shrink-0">
                        Đang dùng
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeleteWallet(wallet.id, wallet.name)}
                        className="shrink-0 p-1 text-slate-300 hover:text-brand-red transition-colors"
                        title="Xóa ví"
                      >
                        <IconTrash size={15} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </>
  );
}
