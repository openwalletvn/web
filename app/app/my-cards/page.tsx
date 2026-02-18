'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { IconCreditCard } from '@tabler/icons-react';
import type { WalletCard, CardStatus } from '@/lib/db';
import { reorderCards } from '@/lib/wallet';
import { getBanks, getCard, type Card, type Bank } from '@/lib/api';
import { PageContainer } from '@/components/ui/page-container';
import { EmptyState } from '@/components/ui/empty-state';
import { CardFormDialog } from '@/components/wallet/card-form-dialog';
import { SortableWalletCard, WalletCardRow, type CreditBadge } from '@/components/wallet/wallet-card-row';
import { BankFilterBar } from '@/components/wallet/bank-filter-bar';
import { useWalletDb } from '@/providers/wallet-db-provider';

// ─── Sort ─────────────────────────────────────────────────────────────────────

type SortOption = 'custom' | 'credit_limit' | 'annual_fee' | 'added' | 'updated' | 'due_date';

const SORT_LABELS: Record<SortOption, string> = {
  custom:       'Tùy chỉnh',
  credit_limit: 'Hạn mức',
  annual_fee:   'PTN',
  added:        'Ngày thêm',
  updated:      'Ngày cập nhật',
  due_date:     'Ngày đến hạn',
};

function applySortOrder(
  cards: WalletCard[],
  sortBy: SortOption,
  creditLimitMap: Map<string, number>,
  catalogCards: Record<string, Card>,
): WalletCard[] {
  if (sortBy === 'custom') return cards;
  const sorted = [...cards];
  if (sortBy === 'credit_limit') {
    sorted.sort((a, b) => (creditLimitMap.get(b.creditAccountId ?? '') ?? -1) - (creditLimitMap.get(a.creditAccountId ?? '') ?? -1));
  } else if (sortBy === 'annual_fee') {
    sorted.sort((a, b) => {
      const feeA = catalogCards[a.cardId]?.annual_fee;
      const feeB = catalogCards[b.cardId]?.annual_fee;
      if (feeA === undefined && feeB === undefined) return 0;
      if (feeA === undefined) return 1;
      if (feeB === undefined) return -1;
      return feeA - feeB;
    });
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

// ─── Local sub-components ─────────────────────────────────────────────────────

function WalletSortBar({
  sortBy,
  cardCount,
  onSort,
}: {
  sortBy: SortOption;
  cardCount: number;
  onSort: (option: SortOption) => void;
}) {
  if (cardCount <= 1) return null;
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-slate-400 shrink-0">Sắp xếp:</span>
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
          <button
            key={option}
            onClick={() => onSort(option)}
            className={`px-2.5 py-1 border border-dashed rounded-sm transition-colors ${
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
  );
}

function WalletLoadingSkeleton() {
  return (
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
  );
}

function WalletCardList({
  displayCards,
  catalogCards,
  banks,
  getCreditBadge,
  creditLimitMap,
  onEdit,
  onStatusChange,
  isSorted,
  bankFilter,
  sensors,
  onDragEnd,
}: {
  displayCards: WalletCard[];
  catalogCards: Record<string, Card>;
  banks: Record<string, Bank>;
  getCreditBadge: (card: WalletCard) => CreditBadge | undefined;
  creditLimitMap: Map<string, number>;
  onEdit: (card: WalletCard) => void;
  onStatusChange: (card: WalletCard, status: CardStatus) => void;
  isSorted: boolean;
  bankFilter: string | null;
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
}) {
  const sharedProps = (walletCard: WalletCard) => ({
    walletCard,
    catalogCard: catalogCards[walletCard.cardId],
    bank: banks[walletCard.bankId],
    creditBadge: getCreditBadge(walletCard),
    creditLimit: walletCard.creditAccountId ? creditLimitMap.get(walletCard.creditAccountId) : undefined,
    onEdit,
    onStatusChange,
  });

  if (isSorted || bankFilter) {
    return (
      <div className="space-y-2">
        {displayCards.map((walletCard) => (
          <WalletCardRow key={walletCard.id} {...sharedProps(walletCard)} />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={displayCards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {displayCards.map((walletCard) => (
            <SortableWalletCard key={walletCard.id} {...sharedProps(walletCard)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalletPage() {
  const db = useWalletDb();
  const walletCards = useLiveQuery(() => db.walletCards.orderBy('order').toArray(), [db]);
  const creditAccounts = useLiveQuery(() => db.creditAccounts.toArray(), [db], []);
  const [catalogCards, setCatalogCards] = useState<Record<string, Card>>({});
  const [banks, setBanks] = useState<Record<string, Bank>>({});
  const [editingCard, setEditingCard] = useState<WalletCard | null>(null);
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
    if (!walletCards?.length) return;
    const missing = walletCards.filter((walletCard) => !catalogCards[walletCard.cardId]);
    if (!missing.length) return;
    Promise.all(
      missing.map((walletCard) =>
        getCard(walletCard.cardId)
          .then((card) => [walletCard.cardId, card] as const)
          .catch(() => null),
      ),
    ).then((results) => {
      const entries = Object.fromEntries(
        results.filter((result): result is [string, Card] => result !== null),
      );
      setCatalogCards((previous) => ({ ...previous, ...entries }));
    });
  }, [walletCards]);

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

  const displayCards = useMemo(() => {
    let cards = walletCards ?? [];
    if (bankFilter) {
      cards = cards.filter((walletCard) => walletCard.bankId === bankFilter);
    }
    return applySortOrder(cards, sortBy, creditLimitMap, catalogCards);
  }, [walletCards, bankFilter, sortBy, creditLimitMap, catalogCards]);

  async function handleStatusChange(walletCard: WalletCard, status: CardStatus) {
    await db.walletCards.update(walletCard.id, { status, updatedAt: new Date() });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !walletCards) return;
    const oldIndex = walletCards.findIndex((card) => card.id === (active.id as string));
    const newIndex = walletCards.findIndex((card) => card.id === (over.id as string));
    await reorderCards(db, arrayMove(walletCards, oldIndex, newIndex));
  }

  const isLoading = walletCards === undefined;
  const editingCatalogCard = editingCard ? catalogCards[editingCard.cardId] : null;
  const isSorted = sortBy !== 'custom';

  return (
    <PageContainer>
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Ví của tôi</h1>
          {!isLoading && (
            <span className="text-sm text-slate-400">{walletCards.length} thẻ</span>
          )}
        </div>
        <div className="border-t border-dashed border-slate-200 mb-6" />

        {!isLoading && walletCards.length > 0 && (
          <BankFilterBar
            walletCards={walletCards}
            banks={banks}
            selectedBankId={bankFilter}
            onSelect={setBankFilter}
          />
        )}

        {!isLoading && (
          <WalletSortBar
            sortBy={sortBy}
            cardCount={walletCards.length}
            onSort={setSortBy}
          />
        )}

        {isLoading && <WalletLoadingSkeleton />}

        {!isLoading && walletCards.length === 0 && (
          <EmptyState
            icon={<IconCreditCard size={26} className="text-slate-300" />}
            title="Chưa có thẻ nào."
            description="Thêm thẻ để theo dõi sao kê và đến hạn."
            action={{ label: 'Thêm thẻ đầu tiên', href: '/app/add' }}
          />
        )}

        {!isLoading && walletCards.length > 0 && (
          <WalletCardList
            displayCards={displayCards}
            catalogCards={catalogCards}
            banks={banks}
            getCreditBadge={getCreditBadge}
            creditLimitMap={creditLimitMap}
            onEdit={setEditingCard}
            onStatusChange={handleStatusChange}
            isSorted={isSorted}
            bankFilter={bankFilter}
            sensors={sensors}
            onDragEnd={handleDragEnd}
          />
        )}
      </div>

      {editingCard && editingCatalogCard && (
        <CardFormDialog
          card={editingCatalogCard}
          walletCard={editingCard}
          open={!!editingCard}
          onClose={() => setEditingCard(null)}
          onAfterDelete={() => setEditingCard(null)}
        />
      )}
    </PageContainer>
  );
}
