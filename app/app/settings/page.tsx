'use client';

import { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconDownload, IconUpload, IconDeviceFloppy, IconCheck } from '@tabler/icons-react';
import { db } from '@/lib/db';
import { exportWallet, importWallet } from '@/lib/import-export';

export default function SettingsPage() {
  const configWalletName = useLiveQuery(
    () => db.config.get('walletName').then((c) => c?.value ?? 'My Wallet'),
    [],
    'My Wallet',
  );

  const [walletName, setWalletName] = useState('');
  const [nameSaved, setNameSaved] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (configWalletName) setWalletName(configWalletName);
  }, [configWalletName]);

  async function handleSaveName() {
    if (!walletName.trim()) return;
    await db.config.put({ key: 'walletName', value: walletName.trim() });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      'Nhập ví sẽ xóa toàn bộ dữ liệu hiện tại và thay thế bằng dữ liệu từ file. Bạn có chắc không?',
    );
    if (!confirmed) {
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setImporting(true);
    setImportError(null);
    setImportSuccess(false);
    try {
      await importWallet(file);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Cài đặt ví</h1>
      <div className="border-t border-dashed border-slate-200 mb-8" />

      {/* Wallet name */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Tên ví
        </h2>
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
            {nameSaved ? (
              <IconCheck size={15} className="text-green-500" />
            ) : (
              <IconDeviceFloppy size={15} />
            )}
            {nameSaved ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </section>

      <div className="border-t border-dashed border-slate-200 mb-8" />

      {/* Backup */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Sao lưu dữ liệu
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Dữ liệu ví được lưu trên thiết bị của bạn. Xuất file để sao lưu hoặc chuyển sang thiết
          bị khác.
        </p>

        <div className="space-y-3">
          {/* Export */}
          <button
            onClick={exportWallet}
            className="w-full flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors text-left"
          >
            <IconDownload size={20} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-800">Xuất ví (JSON)</p>
              <p className="text-xs text-slate-400 mt-0.5">Tải file sao lưu về thiết bị</p>
            </div>
          </button>

          {/* Import */}
          <label className="w-full flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors cursor-pointer">
            <IconUpload size={20} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-800">
                {importing ? 'Đang nhập...' : 'Nhập ví từ file'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Thay thế dữ liệu hiện tại bằng file sao lưu
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              className="sr-only"
            />
          </label>
        </div>

        {importError && (
          <p className="mt-4 text-xs text-brand-red border border-dashed border-brand-red px-3 py-2 rounded-sm">
            Lỗi: {importError}
          </p>
        )}
        {importSuccess && (
          <p className="mt-4 text-xs text-green-600 border border-dashed border-green-400 px-3 py-2 rounded-sm">
            Nhập ví thành công!
          </p>
        )}
      </section>
    </div>
  );
}
