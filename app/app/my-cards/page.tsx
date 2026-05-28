'use client';

import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
 DndContext,
 closestCenter,
 KeyboardSensor,
 PointerSensor,
 useSensor,
 useSensors,
 type DragEndEvent,
} from '@dnd-kit/core';
import {
 SortableContext,
 sortableKeyboardCoordinates,
 useSortable,
 verticalListSortingStrategy,
 arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconArrowForwardUp, IconCreditCard, IconGripVertical } from '@tabler/icons-react';
import type { WalletCard, CardStatus } from '@/lib/db';
import type { AppWallet } from '@/lib/app-db';
import { appDb } from '@/lib/app-db';
import { reorderCards } from '@/lib/wallet';
import { type Card, type Bank } from '@/lib/api';
import { useWalletCatalog } from '@/hooks/use-wallet-catalog';
import { PageContainer } from '@/components/ui/page-container';
import { EmptyState } from '@/components/ui/empty-state';
import { WalletCardContent, type CreditBadge } from '@/components/wallet/wallet-card-row';
import { WalletCardListSkeleton } from '@/components/wallet/wallet-card-list-skeleton';
import { MoveToWalletPicker } from '@/components/wallet/move-to-wallet-picker';
import { useWalletDb, useActiveWallet } from '@/providers/wallet-db-provider';
import posthog from 'posthog-js';

// ─── Local sub-components ─────────────────────────────────────────────────────

function BankSectionHeader({ label, count }: { label: string; count: number }) {
 return (
 <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-dashed border-slate-200">
 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
 <p className="text-sm text-slate-400">{count} thẻ</p>
 </div>
 );
}


function SortableCardRow({
 walletCard,
 catalogCard,
 bank,
 creditBadge,
 creditLimit,
 onStatusChange,
 otherWallets,
 sortable,
}: {
 walletCard: WalletCard;
 catalogCard: Card | undefined;
 bank: Bank | undefined;
 creditBadge?: CreditBadge;
 creditLimit?: number;
 onStatusChange: (walletCard: WalletCard, status: CardStatus) => void;
 otherWallets: AppWallet[];
 sortable: boolean;
}) {
 const [moveOpen, setMoveOpen] = useState(false);
 const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
 id: walletCard.id,
 disabled: !sortable,
 });

 return (
 <div
 ref={setNodeRef}
 style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
 className="flex items-center gap-3 py-4 border-b border-dashed border-slate-100 last:border-0"
 >
 <WalletCardContent
 walletCard={walletCard}
 catalogCard={catalogCard}
 bank={bank}
 creditBadge={creditBadge}
 creditLimit={creditLimit}
 onStatusChange={onStatusChange}
 />

 {/* Move button */}
 {otherWallets.length > 0 && (
 <div className="relative shrink-0 self-center">
 <button
 onClick={(e) => { e.preventDefault(); setMoveOpen((v) => !v); }}
 className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors"
 aria-label="Chuyển sang ví khác"
 title="Chuyển sang ví"
 >
 <IconArrowForwardUp size={16} />
 </button>
 {moveOpen && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setMoveOpen(false)} />
 <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-white border border-dashed border-slate-200 rounded-sm shadow-md overflow-hidden">
 <MoveToWalletPicker
 walletCard={walletCard}
 otherWallets={otherWallets}
 onMoved={() => setMoveOpen(false)}
 onClose={() => setMoveOpen(false)}
 />
 </div>
 </>
 )}
 </div>
 )}

 {/* Drag handle — only shown when group has more than 1 card */}
 {sortable && (
 <button
 {...attributes}
 {...listeners}
 className="shrink-0 p-1.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none"
 aria-label="Kéo để sắp xếp"
 >
 <IconGripVertical size={18} />
 </button>
 )}
 </div>
 );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalletPage() {
 const db = useWalletDb();
 const activeWallet = useActiveWallet();
 const walletCards = useLiveQuery(() => db.walletCards.orderBy('order').toArray(), [db]);
 const creditAccounts = useLiveQuery(() => db.creditAccounts.toArray(), [db], []);
 const allWallets = useLiveQuery(() => appDb.wallets.toArray(), [], []);
 const { banks, catalogCards } = useWalletCatalog(walletCards);

 const otherWallets = useMemo(
 () => (allWallets ?? []).filter((w) => w.id !== activeWallet.id),
 [allWallets, activeWallet.id],
 );

 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );

 const creditLimitMap = useMemo(() => {
 const map = new Map<string, number>();
 for (const account of creditAccounts ?? []) {
 map.set(account.id, account.creditLimit);
 }
 return map;
 }, [creditAccounts]);

 const cardsPerAccount = useMemo(() => {
 const map = new Map<string, number>();
 for (const walletCard of walletCards ?? []) {
 if (walletCard.creditAccountId) {
 map.set(walletCard.creditAccountId, (map.get(walletCard.creditAccountId) ?? 0) + 1);
 }
 }
 return map;
 }, [walletCards]);

 function getCreditBadge(walletCard: WalletCard): CreditBadge | undefined {
 if (!walletCard.creditAccountId) return undefined;
 if (walletCard.isSupplementary) return 'supplementary';
 const count = cardsPerAccount.get(walletCard.creditAccountId) ?? 0;
 return count >= 2 ? 'primary_shared' : undefined;
 }

 async function handleStatusChange(walletCard: WalletCard, status: CardStatus) {
 await db.walletCards.update(walletCard.id, { status, updatedAt: new Date() });
 posthog.capture('card_status_changed', {
 card_id: walletCard.cardId,
 bank_id: walletCard.bankId,
 previous_status: walletCard.status ?? 'active',
 new_status: status,
 });
 }

 // Group by bankId, preserving `order` within each group
 const cardsByBank = useMemo(() => {
 const groups = new Map<string, WalletCard[]>();
 for (const card of walletCards ?? []) {
 if (!groups.has(card.bankId)) groups.set(card.bankId, []);
 groups.get(card.bankId)!.push(card);
 }
 return groups;
 }, [walletCards]);

 function makeHandleDragEnd(bankId: string) {
 return async (event: DragEndEvent) => {
 const { active, over } = event;
 if (!over || active.id === over.id || !walletCards) return;

 const groupCards = cardsByBank.get(bankId) ?? [];
 const oldIndex = groupCards.findIndex((c) => c.id === active.id);
 const newIndex = groupCards.findIndex((c) => c.id === over.id);
 if (oldIndex === -1 || newIndex === -1) return;

 const reorderedGroup = arrayMove(groupCards, oldIndex, newIndex);

 // Reconstruct global list: replace this bank's cards with the reordered group
 let groupCursor = 0;
 const newOrder = walletCards.map((card) =>
 card.bankId === bankId ? reorderedGroup[groupCursor++] : card,
 );

 await reorderCards(db, newOrder);
 posthog.capture('card_reordered', {
 card_id: groupCards[oldIndex]?.cardId,
 bank_id: bankId,
 old_position: oldIndex,
 new_position: newIndex,
 group_size: groupCards.length,
 });
 };
 }

 const isLoading = walletCards === undefined;

 return (
 <PageContainer>
 <div>
 <div className="flex items-baseline justify-between mb-2">
 <h1 className="">Ví của tôi</h1>
 {!isLoading && (
 <span className="text-sm text-slate-500">{walletCards.length} thẻ</span>
 )}
 </div>
 <div className="border-t border-dashed border-slate-200 mb-6" />

 {isLoading && <WalletCardListSkeleton />}

 {!isLoading && walletCards.length === 0 && (
 <EmptyState
 icon={<IconCreditCard size={26} className="text-slate-300" />}
 title="Chưa có thẻ nào."
 description="Thêm thẻ để theo dõi sao kê và đến hạn."
 action={{ label: 'Thêm thẻ đầu tiên', href: '/app/add' }}
 />
 )}

 {!isLoading && walletCards.length > 0 && (
 <div className="space-y-4">
 {[...cardsByBank.entries()].map(([bankId, cards]) => {
 const bank = banks[bankId];
 return (
 <div key={bankId} className="border border-dashed border-slate-200 rounded-sm overflow-hidden">
 <BankSectionHeader label={bank?.name ?? bankId} count={cards.length} />
 <DndContext
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragEnd={makeHandleDragEnd(bankId)}
 >
 <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
 <div className="px-4">
 {cards.map((walletCard) => (
 <SortableCardRow
 key={walletCard.id}
 walletCard={walletCard}
 catalogCard={catalogCards[walletCard.cardId]}
 bank={bank}
 creditBadge={getCreditBadge(walletCard)}
 creditLimit={walletCard.creditAccountId ? creditLimitMap.get(walletCard.creditAccountId) : undefined}
 onStatusChange={handleStatusChange}
 otherWallets={otherWallets}
 sortable={cards.length > 1}
 />
 ))}
 </div>
 </SortableContext>
 </DndContext>
 </div>
 );
 })}
 </div>
 )}

 </div>
 </PageContainer>
 );
}
