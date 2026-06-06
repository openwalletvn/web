'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconBell, IconBellOff } from '@tabler/icons-react';
import { useWalletCatalog } from '@/hooks/use-wallet-catalog';
import { appDb, type NotificationAdapter } from '@/lib/app-db';
import { PageContainer } from '@/components/ui/page-container';
import { EmptyState } from '@/components/ui/empty-state';
import { useWalletDb } from '@/providers/wallet-db-provider';
import { ReminderCardRow } from './reminder-card-row';
import { WalletCardListSkeleton } from '@/components/wallet/wallet-card-list-skeleton';

// const MAX_REMINDERS = 5; // reserved for future enforcement


export default function RemindersPage() {
 const db = useWalletDb();
 const walletCards = useLiveQuery(() => db.walletCards.toArray(), [db]);
 const adapters = useLiveQuery(() => appDb.notificationAdapters.toArray(), [], []);
 const { banks, catalogCards } = useWalletCatalog(walletCards);

 const activeAdapter = useMemo(
 () => adapters?.find((a) => a.enabled),
 [adapters],
 );

 const activeCards = useMemo(
 () => (walletCards ?? []).filter((c) => c.status !== 'expired' && c.status !== 'canceled'),
 [walletCards],
 );

 const activeRemoteCount = useMemo(
 () =>
 activeCards.reduce((count, c) => {
 const n = c.notifications;
 if (n?.statementDate?.enabled) count++;
 if (n?.paymentDueDate?.enabled) count++;
 return count;
 }, 0),
 [activeCards],
 );


 return (
 <PageContainer>
 <div className="flex items-baseline justify-between mb-2">
 <h1 className="">Nhắc nhở</h1>
 </div>
 <div className="border-t border-dashed border-slate-200 mb-6" />

 {/* Adapter banner */}
 {!activeAdapter ? (
 <div className="mb-6 flex items-center gap-3 p-4 border border-dashed border-amber-300 bg-amber-50/40 rounded-sm">
 <IconBellOff size={20} className="text-amber-500 shrink-0" />
 <div className="flex-1 text-sm text-amber-700">
 Chưa cài kênh thông báo.{' '}
 <Link href="/app/settings" className="underline text-brand-blue">Cài đặt ngay</Link>
 </div>
 </div>
 ) : (
 <div className="mb-6 flex items-center gap-3 p-4 border border-dashed border-green-300 bg-green-50/40 rounded-sm">
 <IconBell size={20} className="text-green-600 shrink-0" />
 <span className="text-sm text-green-700">
 Đã kết nối {activeAdapter.id === 'discord' ? 'Discord' : activeAdapter.id}
 </span>
 </div>
 )}

 {/* Card list */}
 {walletCards === undefined ? (
 <WalletCardListSkeleton />
 ) : activeCards.length === 0 ? (
 <EmptyState
 icon={<IconBell size={26} className="text-slate-300" />}
 title="Chưa có thẻ nào trong ví"
 description="Thêm thẻ để bật nhắc nhở sao kê và đến hạn."
 action={{ label: 'Thêm thẻ', href: '/app/add' }}
 />
 ) : (
 <div className="border border-dashed border-slate-200 rounded-sm px-4">
 {activeCards.map((card) => (
 <ReminderCardRow
 key={card.id}
 walletCard={card}
 catalogCard={catalogCards[card.cardId]}
 bank={banks[card.bankId]}
 adapter={activeAdapter}
 db={db}
 limitReached={false}
 />
 ))}
 </div>
 )}

 {/* Footer */}
 <div className="mt-4 flex items-center justify-center">
 <p className="text-sm text-slate-400">
 {activeRemoteCount} nhắc nhở đang bật
 {activeAdapter ? ` (${activeAdapter.id === 'discord' ? 'Discord' : activeAdapter.id})` : ''}
 </p>
 </div>
 </PageContainer>
 );
}
