'use client';

import { useState, useEffect } from 'react';
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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconPlus, IconCreditCard } from '@tabler/icons-react';
import { db, type UserCard } from '@/lib/db';
import { reorderCards } from '@/lib/wallet';
import { getBanks, getCard, getCardImageUrl, type Card, type Bank } from '@/lib/api';
import { CardFormDialog } from '@/components/wallet/card-form-dialog';

// ─── Sortable card item ───────────────────────────────────────────────────────

function SortableWalletCard({
  userCard,
  catalogCard,
  bank,
  onEdit,
}: {
  userCard: UserCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  onEdit: (uc: UserCard) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: userCard.id!,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="flex items-center gap-3 p-3 border border-dashed border-slate-200 rounded-sm bg-white hover:border-slate-300 transition-colors"
    >
      {/* Tappable area → opens edit */}
      <button
        onClick={() => onEdit(userCard)}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        {/* Card image */}
        <div className="shrink-0 w-20 aspect-[16/10] bg-slate-50 overflow-hidden rounded-sm">
          {catalogCard ? (
            <img
              src={getCardImageUrl(catalogCard)}
              alt={catalogCard.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 animate-pulse" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 truncate">{bank?.name ?? '—'}</p>
          <p className="font-medium text-slate-900 leading-tight truncate text-sm">
            {catalogCard?.name ?? (
              <span className="inline-block w-28 h-4 bg-slate-100 rounded animate-pulse" />
            )}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {userCard.last4 && (
              <span className="text-xs px-1.5 py-0.5 border border-dashed border-slate-300 text-slate-500">
                •••• {userCard.last4}
              </span>
            )}
            {userCard.statementDate && (
              <span className="text-xs px-1.5 py-0.5 border border-dashed border-brand-blue text-brand-blue">
                Sao kê: ngày {userCard.statementDate}
              </span>
            )}
            {userCard.paymentDueDate && (
              <span className="text-xs px-1.5 py-0.5 border border-dashed border-brand-red text-brand-red">
                Đến hạn: ngày {userCard.paymentDueDate}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 p-1.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none"
        aria-label="Kéo để sắp xếp"
      >
        <IconGripVertical size={18} />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalletPage() {
  const userCards = useLiveQuery(() => db.userCards.orderBy('order').toArray());
  const [catalogCards, setCatalogCards] = useState<Record<string, Card>>({});
  const [banks, setBanks] = useState<Record<string, Bank>>({});
  const [editingCard, setEditingCard] = useState<UserCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Fetch all banks once for name lookup
  useEffect(() => {
    getBanks().then((list) =>
      setBanks(Object.fromEntries(list.map((b) => [b.id, b]))),
    );
  }, []);

  // Fetch catalog data for any new userCards
  useEffect(() => {
    if (!userCards?.length) return;
    const missing = userCards.filter((uc) => !catalogCards[uc.catalogId]);
    if (!missing.length) return;
    Promise.all(
      missing.map((uc) =>
        getCard(uc.catalogId)
          .then((card) => [uc.catalogId, card] as const)
          .catch(() => null),
      ),
    ).then((results) => {
      const entries = Object.fromEntries(
        results.filter((r): r is [string, Card] => r !== null),
      );
      setCatalogCards((prev) => ({ ...prev, ...entries }));
    });
  }, [userCards]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !userCards) return;

    const oldIndex = userCards.findIndex((c) => c.id === (active.id as number));
    const newIndex = userCards.findIndex((c) => c.id === (over.id as number));
    await reorderCards(arrayMove(userCards, oldIndex, newIndex));
  }

  const isLoading = userCards === undefined;
  const editingCatalogCard = editingCard ? catalogCards[editingCard.catalogId] : null;

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
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

      {/* Card list with drag-to-reorder */}
      {!isLoading && userCards.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={userCards.map((c) => c.id!)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {userCards.map((userCard) => (
                <SortableWalletCard
                  key={userCard.id}
                  userCard={userCard}
                  catalogCard={catalogCards[userCard.catalogId]}
                  bank={
                    catalogCards[userCard.catalogId]
                      ? banks[catalogCards[userCard.catalogId].bank_id]
                      : undefined
                  }
                  onEdit={setEditingCard}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Edit dialog — rendered outside the list to avoid DnD context issues */}
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
