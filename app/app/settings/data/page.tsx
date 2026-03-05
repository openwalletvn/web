'use client';

import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconDownload, IconUpload, IconDatabase } from '@tabler/icons-react';
import { exportWallet, exportAllWallets, importAsNewWallet } from '@/lib/import-export';
import { appDb } from '@/lib/app-db';
import { switchWallet, useWalletDb, useActiveWallet } from '@/providers/wallet-db-provider';
import posthog from 'posthog-js';
import { JsonViewerDialog } from './json-viewer-dialog';

export default function DataSettingsPage() {
  const db = useWalletDb();
  const activeWallet = useActiveWallet();
  const wallets = useLiveQuery(() => appDb.wallets.toArray(), [], []);

  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [jsonData, setJsonData] = useState('');

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError(null);
    setImportSuccess(false);
    try {
      const newWalletId = await importAsNewWallet(file);
      setImportSuccess(true);
      posthog.capture('wallet_imported', {
        file_name: file.name,
        file_size_bytes: file.size,
      });
      const confirmed = window.confirm('Nhập ví thành công! Chuyển sang ví vừa nhập?');
      if (confirmed) await switchWallet(newWalletId);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Lỗi không xác định');
      posthog.captureException(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleOpenJsonDialog() {
    const [walletCards, creditAccounts, config] = await Promise.all([
      db.walletCards.toArray(),
      db.creditAccounts.toArray(),
      db.config.toArray(),
    ]);
    setJsonData(JSON.stringify({ wallet: activeWallet, walletCards, creditAccounts, config }, null, 2));
    setJsonDialogOpen(true);
  }

  return (
    <>
      <section>
        <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-1">Sao lưu dữ liệu</h2>
        <p className="text-slate-500 mb-5">Dữ liệu ví được lưu trên thiết bị của bạn. Xuất file để sao lưu hoặc chuyển sang thiết bị khác.</p>
        <div className="space-y-3">
          <button onClick={() => { exportWallet(db, activeWallet); posthog.capture('wallet_exported', { wallet_id: activeWallet.id, export_scope: 'single' }); }} className="w-full flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors text-left">
            <IconDownload size={20} className="text-slate-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-800">Xuất ví (JSON)</p>
              <p className="text-slate-500 mt-0.5">Tải file sao lưu về thiết bị</p>
            </div>
          </button>
          {(wallets ?? []).length > 1 && (
            <button onClick={() => { exportAllWallets(); posthog.capture('wallet_exported', { wallet_id: activeWallet.id, export_scope: 'all', wallet_count: wallets?.length ?? 0 }); }} className="w-full flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors text-left">
              <IconDownload size={20} className="text-slate-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">Xuất tất cả ví (JSON)</p>
                <p className="text-slate-500 mt-0.5">Sao lưu toàn bộ {wallets?.length} ví</p>
              </div>
            </button>
          )}
          <label className="w-full flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors cursor-pointer">
            <IconUpload size={20} className="text-slate-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-800">{importing ? 'Đang nhập...' : 'Nhập ví từ file'}</p>
              <p className="text-slate-500 mt-0.5">Thêm ví mới từ file sao lưu</p>
            </div>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} disabled={importing} className="sr-only" />
          </label>
        </div>
        {importError && (
          <p className="mt-4 text-brand-red border border-dashed border-brand-red px-3 py-2 rounded-sm">Lỗi: {importError}</p>
        )}
        {importSuccess && (
          <p className="mt-4 text-green-600 border border-dashed border-green-400 px-3 py-2 rounded-sm">Nhập ví thành công!</p>
        )}
      </section>
      <div className="border-t border-dashed border-slate-200 my-8" />
      <section>
        <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-1">Dữ liệu thô</h2>
        <p className="text-slate-500 mb-5">Xem toàn bộ dữ liệu ví dưới dạng JSON (hữu ích để kiểm tra hoặc gỡ lỗi).</p>
        <button onClick={handleOpenJsonDialog} className="w-full flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors text-left">
          <IconDatabase size={20} className="text-slate-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-800">Xem dữ liệu JSON</p>
            <p className="text-slate-500 mt-0.5">Hiện toàn bộ dữ liệu hiện tại trong ví</p>
          </div>
        </button>
      </section>

      <JsonViewerDialog open={jsonDialogOpen} onOpenChange={setJsonDialogOpen} data={jsonData} />
    </>
  );
}
