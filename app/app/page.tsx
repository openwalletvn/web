'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { IconPlus, IconCreditCard } from '@tabler/icons-react';
import { db, type UserCard } from '@/lib/db';
import { reorderCards } from '@/lib/wallet';
import { getBanks, getCard, type Card, type Bank } from '@/lib/api';
import { CardFormDialog } from '@/components/wallet/card-form-dialog';
import { SortableWalletCard, WalletCardRow } from '@/components/wallet/wallet-card-row';
import { BankFilterBar } from '@/components/wallet/bank-filter-bar';
import { StatsWidget } from '@/components/wallet/widgets/stats-widget';
import { BanksWidget } from '@/components/wallet/widgets/banks-widget';

// ─── Sort ─────────────────────────────────────────────────────────────────────

type SortOption = 'custom' | 'credit_limit' | 'added' | 'updated' | 'due_date';

const SORT_LABELS: Record<SortOption, string> = {
  custom:       'Tùy chỉnh',
  credit_limit: 'Hạn mức',
  added:        'Ngày thêm',
  updated:      'Ngày cập nhật',
  due_date:     'Ngày đến hạn',
};

function applySortOrder(cards: UserCard[], sortBy: SortOption): UserCard[] {
  if (sortBy === 'custom') return cards;
  const sorted = [...cards];
  if (sortBy === 'credit_limit') {
    sorted.sort((a, b) => (b.creditLimit ?? -1) - (a.creditLimit ?? -1));
  } else if (sortBy === 'added') {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'updated') {
    sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } else if (sortBy === 'due_date') {
    sorted.sort((a, b) => {
      if (!a.paymentDueDate && !b.paymentDueDate) return 0;
      if (!a.paymentDueDate) return 1;
      if (!b.paymentDueDate) return -1;
      return a.paymentDueDate - b.paymentDueDate;
    });
  }
  return sorted;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalletPage() {
  const userCards = useLiveQuery(() => db.userCards.orderBy('order').toArray());
  const [catalogCards, setCatalogCards] = useState<Record<string, Card>>({});
  const [banks, setBanks] = useState<Record<string, Bank>>({});
  const [editingCard, setEditingCard] = useState<UserCard | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('custom');
  const [bankFilter, setBankFilter] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    getBanks().then((list) =>
      setBanks(Object.fromEntries(list.map((bank) => [bank.id, bank]))),
    );
  }, []);

  useEffect(() => {
    if (!userCards?.length) return;
    const missing = userCards.filter((userCard) => !catalogCards[userCard.catalogId]);
    if (!missing.length) return;
    Promise.all(
      missing.map((userCard) =>
        getCard(userCard.catalogId)
          .then((card) => [userCard.catalogId, card] as const)
          .catch(() => null),
      ),
    ).then((results) => {
      const entries = Object.fromEntries(
        results.filter((result): result is [string, Card] => result !== null),
      );
      setCatalogCards((previous) => ({ ...previous, ...entries }));
    });
  }, [userCards]);

  // Unique bank count for sidebar widget
  const uniqueBankCount = useMemo(() => {
    if (!userCards) return 0;
    const bankIds = new Set(
      userCards.map((userCard) => catalogCards[userCard.catalogId]?.bank_id).filter(Boolean),
    );
    return bankIds.size;
  }, [userCards, catalogCards]);

  // Apply bank filter then sort
  const displayCards = useMemo(() => {
    let cards = userCards ?? [];
    if (bankFilter) {
      cards = cards.filter(
        (userCard) => catalogCards[userCard.catalogId]?.bank_id === bankFilter,
      );
    }
    return applySortOrder(cards, sortBy);
  }, [userCards, catalogCards, bankFilter, sortBy]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !userCards) return;
    const oldIndex = userCards.findIndex((card) => card.id === (active.id as number));
    const newIndex = userCards.findIndex((card) => card.id === (over.id as number));
    await reorderCards(arrayMove(userCards, oldIndex, newIndex));
  }

  const isLoading = userCards === undefined;
  const editingCatalogCard = editingCard ? catalogCards[editingCard.catalogId] : null;
  const isSorted = sortBy !== 'custom';

  function getCardBank(userCard: UserCard): Bank | undefined {
    const catalogCard = catalogCards[userCard.catalogId];
    return catalogCard ? banks[catalogCard.bank_id] : undefined;
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">

        {/* ── Main column ── */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Ví của tôi</h1>
              {!isLoading && userCards.length > 0 && (
                <p className="text-sm text-slate-400 mt-0.5">{userCards.length} thẻ</p>
              )}
            </div>
            <Link
              href="/app/add"
              className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-brand-blue text-brand-blue font-medium rounded-sm hover:bg-blue-50/60 transition-colors text-sm"
            >
              <IconPlus size={15} />
              Thêm thẻ
            </Link>
          </div>

          {/* Bank filter row */}
          {!isLoading && userCards.length > 0 && (
            <BankFilterBar
              userCards={userCards}
              banks={banks}
              catalogCards={catalogCards}
              selectedBankId={bankFilter}
              onSelect={setBankFilter}
            />
          )}

          {/* Sort bar */}
          {!isLoading && userCards.length > 1 && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-slate-400 shrink-0">Sắp xếp:</span>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`text-xs px-2.5 py-1 border border-dashed rounded-sm transition-colors ${
                      sortBy === option
                        ? 'border-brand-blue text-brand-blue bg-blue-50/60'
                        : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {SORT_LABELS[option]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-dashed border-slate-200 rounded-sm">
                  <div className="w-20 aspect-[16/10] bg-slate-100 rounded-sm animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && userCards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 border border-dashed border-slate-200 rounded-sm flex items-center justify-center mb-5">
                <IconCreditCard size={26} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm mb-1">Chưa có thẻ nào.</p>
              <p className="text-slate-400 text-xs mb-6">Thêm thẻ để theo dõi sao kê và đến hạn.</p>
              <Link
                href="/app/add"
                className="px-6 py-2.5 border border-dashed border-brand-blue text-brand-blue font-medium rounded-sm hover:bg-blue-50/60 transition-colors text-sm"
              >
                Thêm thẻ đầu tiên
              </Link>
            </div>
          )}

          {/* Card list */}
          {!isLoading && userCards.length > 0 && (
            isSorted || bankFilter ? (
              <div className="space-y-2">
                {displayCards.map((userCard) => (
                  <WalletCardRow
                    key={userCard.id}
                    userCard={userCard}
                    catalogCard={catalogCards[userCard.catalogId]}
                    bank={getCardBank(userCard)}
                    onEdit={setEditingCard}
                  />
                ))}
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={displayCards.map((card) => card.id!)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {displayCards.map((userCard) => (
                      <SortableWalletCard
                        key={userCard.id}
                        userCard={userCard}
                        catalogCard={catalogCards[userCard.catalogId]}
                        bank={getCardBank(userCard)}
                        onEdit={setEditingCard}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-[57px] space-y-4">
            <StatsWidget />
            <BanksWidget count={uniqueBankCount} />
            {/* Future widgets go here */}
          </div>
        </aside>
      </div>

      {/* Edit dialog */}
      {editingCard && editingCatalogCard && (
        <CardFormDialog
          card={editingCatalogCard}
          userCard={editingCard}
          open={!!editingCard}
          onClose={() => setEditingCard(null)}
          onAfterDelete={() => setEditingCard(null)}
        />
      )}
    </div>
  );
}
