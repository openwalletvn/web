'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconDownload, IconUpload, IconDatabase, IconFileImport } from '@tabler/icons-react';
import {
 exportFullBackup,
 importFullBackup,
 buildFullBackupData,
 clearAllData,
 getLocalSummary,
 getExportFileName,
 parseBackupSummary,
 type BackupSummary,
} from '@/lib/import-export';
import { appDb } from '@/lib/app-db';
import { useWalletDb, useActiveWallet } from '@/providers/wallet-db-provider';
import posthog from 'posthog-js';
import { JsonViewerDialog } from './json-viewer-dialog';

const REMINDER_LABELS: Record<string, string> = {
 discord: 'Discord',
 telegram: 'Telegram',
 email: 'Email',
};

function SummaryBlock({ summary }: { summary: BackupSummary }) {
 return (
 <div className="space-y-1.5">
 <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-2">Nội dung</p>
 {summary.wallets.map((w) => (
 <div key={w.id} className="flex items-center justify-between text-sm">
 <span className="text-slate-700">{w.name}</span>
 <span className="text-slate-400">{w.cardCount} thẻ</span>
 </div>
 ))}
 {summary.reminders.length > 0 && (
 <>
 <div className="border-t border-dashed border-slate-100 my-2" />
 {summary.reminders.map((r) => (
 <div key={r.id} className="flex items-center justify-between text-sm">
 <span className="text-slate-700">Nhắc nhở qua {REMINDER_LABELS[r.id] ?? r.id}</span>
 <span className={r.enabled ? 'text-green-600' : 'text-slate-400'}>
 {r.enabled ? 'Đang bật' : 'Tắt'}
 </span>
 </div>
 ))}
 </>
 )}
 {summary.reminders.length === 0 && (
 <>
 <div className="border-t border-dashed border-slate-100 my-2" />
 <p className="text-sm text-slate-400">Không có nhắc nhở</p>
 </>
 )}
 </div>
 );
}

export default function DataSettingsPage() {
 const wallets = useLiveQuery(() => appDb.wallets.toArray(), [], []);

 const [localSummary, setLocalSummary] = useState<BackupSummary | null>(null);
 const [exportFileName, setExportFileName] = useState<string | null>(null);
 const [isDragOver, setIsDragOver] = useState(false);
 const [importedFile, setImportedFile] = useState<File | null>(null);
 const [importPreview, setImportPreview] = useState<BackupSummary | null>(null);
 const [importing, setImporting] = useState(false);
 const [importError, setImportError] = useState<string | null>(null);
 const fileRef = useRef<HTMLInputElement>(null);
 const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
 const [jsonData, setJsonData] = useState('');

 useEffect(() => {
 getLocalSummary().then(setLocalSummary);
 getExportFileName().then(setExportFileName);
 }, [wallets]);

 async function handleFileSelected(file: File) {
 setImportError(null);
 try {
 const summary = await parseBackupSummary(file);
 setImportedFile(file);
 setImportPreview(summary);
 } catch {
 setImportError('File không hợp lệ hoặc bị lỗi');
 }
 }

 async function handleImportConfirm() {
 if (!importedFile) return;
 const confirmed = window.confirm(
 'Toàn bộ dữ liệu hiện tại sẽ bị xoá và thay thế bằng file sao lưu. Tiếp tục?',
 );
 if (!confirmed) return;

 setImporting(true);
 setImportError(null);
 try {
 await importFullBackup(importedFile);
 posthog.capture('wallet_imported', { file_name: importedFile.name });
 window.location.reload();
 } catch (err) {
 setImportError(err instanceof Error ? err.message : 'Lỗi không xác định');
 posthog.captureException(err instanceof Error ? err : new Error(String(err)));
 setImporting(false);
 if (fileRef.current) fileRef.current.value = '';
 }
 }

 function handleDrop(e: React.DragEvent) {
 e.preventDefault();
 setIsDragOver(false);
 const file = e.dataTransfer.files[0];
 if (file) handleFileSelected(file);
 }

 function handleCancelImport() {
 setImportedFile(null);
 setImportPreview(null);
 setImportError(null);
 if (fileRef.current) fileRef.current.value = '';
 }

 async function handleOpenJsonDialog() {
 const backup = await buildFullBackupData();
 setJsonData(JSON.stringify(backup, null, 2));
 setJsonDialogOpen(true);
 }

 return (
 <>
 {/* Export */}
 <section>
 <h2 className="text-label text-text-muted mb-1">Sao lưu dữ liệu</h2>
 <p className="text-slate-500 mb-5">Dữ liệu ví được lưu trên thiết bị của bạn. Xuất file để sao lưu hoặc chuyển sang thiết bị khác.</p>
 <div className="border border-dashed border-slate-200 rounded p-4">
 {localSummary ? (
 <div className="mb-4">
 <SummaryBlock summary={localSummary} />
 </div>
 ) : (
 <div className="text-slate-400 text-sm mb-4">Đang tải...</div>
 )}
 <button
 onClick={() => { exportFullBackup(); posthog.capture('wallet_exported', { export_scope: 'full' }); }}
 className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors"
 >
 <IconDownload size={16} />
 Xuất file sao lưu (JSON)
 </button>
 {exportFileName && (
 <p className="mt-2 text-sm text-slate-400 font-mono">{exportFileName}</p>
 )}
 </div>
 </section>

 <div className="border-t border-dashed border-slate-200 my-8" />

 {/* Import */}
 <section>
 <h2 className="text-label text-text-muted mb-1">Nhập dữ liệu</h2>
 <p className="text-slate-500 mb-1">
 Khôi phục từ file sao lưu.{' '}
 <span className="text-brand-red font-medium">Dữ liệu hiện tại sẽ bị xoá và thay thế hoàn toàn.</span>
 </p>
 <p className="text-slate-400 text-sm mb-5">Chọn hoặc kéo thả file để xem trước nội dung trước khi nhập.</p>

 {!importPreview ? (
 <div
 onDrop={handleDrop}
 onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
 onDragLeave={() => setIsDragOver(false)}
 onClick={() => fileRef.current?.click()}
 className={cn('border-2 border-dashed rounded p-10 text-center cursor-pointer transition-colors', isDragOver ? 'border-slate-500 bg-slate-50' : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/60')}
 >
 <IconFileImport size={28} className="mx-auto text-slate-400 mb-3" />
 <p className="text-sm font-medium text-slate-700">Kéo thả file vào đây hoặc nhấn để chọn</p>
 <p className="text-sm text-slate-400 mt-1">Chỉ hỗ trợ file .json từ OpenWallet</p>
 <input
 ref={fileRef}
 type="file"
 accept=".json"
 onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelected(f); }}
 className="sr-only"
 />
 </div>
 ) : (
 <div className="border border-dashed border-slate-200 rounded p-4">
 <div className="mb-4">
 <SummaryBlock summary={importPreview} />
 </div>
 <div className="flex items-center gap-3">
 <button
 onClick={handleImportConfirm}
 disabled={importing}
 className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-sm font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50"
 >
 <IconUpload size={16} />
 {importing ? 'Đang nhập...' : 'Nhập dữ liệu'}
 </button>
 <button
 onClick={handleCancelImport}
 disabled={importing}
 className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
 >
 Huỷ
 </button>
 </div>
 </div>
 )}

 {importError && (
 <p className="mt-3 text-brand-red border border-dashed border-brand-red px-3 py-2 rounded text-sm">
 Lỗi: {importError}
 </p>
 )}
 </section>

 <div className="border-t border-dashed border-slate-200 my-8" />

 {/* Raw data */}
 <section>
 <h2 className="text-label text-text-muted mb-1">Dữ liệu thô</h2>
 <p className="text-slate-500 mb-5">Xem toàn bộ dữ liệu dưới dạng JSON - nội dung khớp với file sao lưu khi xuất.</p>
 <button onClick={handleOpenJsonDialog} className="w-full flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded hover:border-slate-400 hover:bg-slate-50/60 transition-colors text-left">
 <IconDatabase size={20} className="text-slate-500 shrink-0" />
 <div>
 <p className="text-sm font-medium text-slate-800">Xem dữ liệu JSON</p>
 <p className="text-slate-500 mt-0.5">Hiện toàn bộ dữ liệu - tất cả ví, thẻ, và cài đặt</p>
 </div>
 </button>
 </section>

 <div className="border-t border-dashed border-red-200 my-8" />

 {/* Danger zone */}
 <section>
 <h2 className="text-label text-primary mb-1">Vùng nguy hiểm</h2>
 <p className="text-slate-500 mb-5">Các thao tác dưới đây không thể hoàn tác.</p>
 <div className="border border-dashed border-red-200 rounded p-4">
 <p className="text-sm font-medium text-slate-800 mb-1">Xoá toàn bộ dữ liệu</p>
 <p className="text-sm text-slate-500 mb-4">Xoá tất cả ví, thẻ, cài đặt và tài khoản cục bộ. Không thể khôi phục nếu chưa sao lưu.</p>
 <button
 onClick={async () => {
 const confirmed = window.confirm('Toàn bộ dữ liệu sẽ bị xoá vĩnh viễn. Bạn chắc chắn muốn tiếp tục?');
 if (!confirmed) return;
 await clearAllData();
 window.location.reload();
 }}
 className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
 >
 Xoá toàn bộ dữ liệu
 </button>
 </div>
 </section>

 <JsonViewerDialog open={jsonDialogOpen} onOpenChange={setJsonDialogOpen} data={jsonData} />
 </>
 );
}
