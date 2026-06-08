'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconCheck, IconTrash, IconX, IconPlus } from '@tabler/icons-react';
import Dexie from 'dexie';
import { appDb } from '@/lib/app-db';
import { WalletDb } from '@/lib/db';
import { switchWallet, useActiveWallet } from '@/providers/wallet-db-provider';

export default function WalletSettingsPage() {
 const activeWallet = useActiveWallet();
 const wallets = useLiveQuery(() => appDb.wallets.toArray(), [], []);
 const account = useLiveQuery(() => appDb.accounts.toArray().then((a) => a[0]), [], undefined);

 const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
 const [editingId, setEditingId] = useState<string | null>(null);
 const [editingName, setEditingName] = useState('');

 useEffect(() => {
 if (!wallets?.length) return;
 Promise.all(
 wallets.map(async (w) => [w.id, await new WalletDb(w.id).walletCards.count()] as [string, number]),
 ).then((entries) => setCardCounts(Object.fromEntries(entries)));
 }, [wallets]);

 function startEdit(walletId: string, currentName: string) {
 setEditingId(walletId);
 setEditingName(currentName);
 }

 function cancelEdit() {
 setEditingId(null);
 setEditingName('');
 }

 async function saveEdit(walletId: string) {
 if (!editingName.trim()) return;
 await appDb.wallets.update(walletId, { name: editingName.trim() });
 cancelEdit();
 }

 async function handleCreateWallet() {
 const id = crypto.randomUUID();
 await appDb.wallets.add({ id, name: 'Ví mới', createdAt: new Date() });
 await switchWallet(id);
 }

 async function handleDeleteWallet(walletId: string, name: string) {
 if (!window.confirm(`Xóa ví"${name}"? Toàn bộ thẻ và dữ liệu trong ví này sẽ bị mất vĩnh viễn.`)) return;
 await appDb.wallets.delete(walletId);
 await Dexie.delete(`openwallet-wallet-${walletId}`);
 }

 return (
 <>
 {/* Local account */}
 {account && (
 <>
 <section className="mb-8">
 <h2 className="text-label text-text-muted mb-1">Tài khoản cục bộ</h2>
 <p className="text-slate-500 text-sm mb-3">ID dùng để nhận diện thiết bị này. Sẽ được dùng khi tính năng đồng bộ ra mắt.</p>
 <div className="px-3 py-2 border border-dashed border-slate-200 rounded bg-slate-50">
 <p className="text-sm font-mono text-slate-500 break-all">{account.id}</p>
 </div>
 </section>
 <div className="border-t border-dashed border-slate-200 mb-8" />
 </>
 )}

 {/* Wallets */}
 <section>
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-label text-text-muted">Các ví</h2>
 <button
 onClick={handleCreateWallet}
 className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded text-sm text-slate-600 hover:border-slate-500 hover:text-slate-900 transition-colors"
 >
 <IconPlus size={14} />
 Thêm ví mới
 </button>
 </div>
 <div className="space-y-2">
 {(wallets ?? []).map((wallet) => {
 const isActive = wallet.id === activeWallet.id;
 const isEditing = editingId === wallet.id;
 const cardCount = cardCounts[wallet.id] ?? 0;

 return (
 <div
 key={wallet.id}
 onClick={() => !isActive && !isEditing && switchWallet(wallet.id)}
 className={cn('flex items-center gap-3 p-3 border border-dashed rounded transition-colors', isActive ? 'border-brand-blue bg-blue-50/40' : 'border-slate-200 cursor-pointer hover:border-slate-400')}
 >
 {/* Name + active badge */}
 <div className="flex-1 flex items-center gap-2 min-w-0">
 {isEditing ? (
 <input
 autoFocus
 type="text"
 value={editingName}
 onChange={(e) => setEditingName(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter') saveEdit(wallet.id);
 if (e.key === 'Escape') cancelEdit();
 }}
 className="flex-1 px-2 py-1 border border-dashed border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-brand-blue"
 />
 ) : (
 <>
 <button
 onClick={(e) => { e.stopPropagation(); startEdit(wallet.id, wallet.name); }}
 className={cn('text-left text-sm font-medium truncate cursor-text', isActive ? 'text-brand-blue' : 'text-slate-700')}
 >
 {wallet.name}
 </button>
 {isActive && (
 <span className="text-sm border border-dashed border-brand-blue text-brand-blue px-1.5 py-0.5 rounded shrink-0">
 Đang dùng
 </span>
 )}
 </>
 )}
 </div>

 {/* Card count */}
 {!isEditing && (
 <span className="text-sm text-slate-400 shrink-0">{cardCount} thẻ</span>
 )}

 {/* Action buttons */}
 {isEditing ? (
 <>
 <button onClick={() => saveEdit(wallet.id)} className="shrink-0 p-1 text-green-600 hover:text-green-700 transition-colors" title="Lưu">
 <IconCheck size={15} />
 </button>
 <button onClick={cancelEdit} className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors" title="Huỷ">
 <IconX size={15} />
 </button>
 </>
 ) : (
 !isActive && (
 <button onClick={() => handleDeleteWallet(wallet.id, wallet.name)} className="shrink-0 p-1 text-slate-300 hover:text-brand-red transition-colors" title="Xóa ví">
 <IconTrash size={15} />
 </button>
 )
 )}
 </div>
 );
 })}
 </div>
 </section>
 </>
 );
}
