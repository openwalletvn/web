'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical } from '@tabler/icons-react';
import { getCardImageUrl, type Card, type Bank } from '@/lib/api';
import type { UserCard } from '@/lib/db';
import { DashedBadge } from '@/components/ui/dashed-badge';

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  expired:  'Hết hạn',
  canceled: 'Đã huỷ',
};

// ─── Shared inner content ─────────────────────────────────────────────────────

export function WalletCardContent({
  userCard,
  catalogCard,
  bank,
  onEdit,
}: {
  userCard: UserCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  onEdit: (userCard: UserCard) => void;
}) {
  const isInactive = userCard.status === 'expired' || userCard.status === 'canceled';

  return (
    <button
      onClick={() => onEdit(userCard)}
      className="flex items-center gap-3 flex-1 min-w-0 text-left"
    >
      {/* Card image */}
      <div className={`shrink-0 w-20 aspect-[16/10] bg-slate-50 overflow-hidden rounded-sm ${isInactive ? 'opacity-50' : ''}`}>
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
        <p className={`font-medium leading-tight truncate text-sm ${isInactive ? 'text-slate-400' : 'text-slate-900'}`}>
          {catalogCard?.name ?? (
            <span className="inline-block w-28 h-4 bg-slate-100 rounded animate-pulse" />
          )}
        </p>

        <div className="flex flex-wrap gap-1 mt-1.5">
          {/* Status badge — only for non-active */}
          {isInactive && userCard.status && (
            <DashedBadge variant="amber">{STATUS_LABELS[userCard.status]}</DashedBadge>
          )}

          {userCard.last4 && (
            <DashedBadge>•••• {userCard.last4}</DashedBadge>
          )}

          {userCard.validThru && (
            <DashedBadge>Đến {userCard.validThru}</DashedBadge>
          )}

          {userCard.statementDate && (
            <DashedBadge variant="blue">Sao kê: ngày {userCard.statementDate}</DashedBadge>
          )}

          {userCard.paymentDueDate && (
            <DashedBadge variant="red">Đến hạn: ngày {userCard.paymentDueDate}</DashedBadge>
          )}

          {userCard.creditLimit && (
            <DashedBadge>{userCard.creditLimit.toLocaleString('vi-VN')}đ</DashedBadge>
          )}
        </div>

        {userCard.note && (
          <p className="text-xs text-slate-400 mt-1 truncate">{userCard.note}</p>
        )}
      </div>
    </button>
  );
}

// ─── Plain row (used when sorted) ────────────────────────────────────────────

export function WalletCardRow({
  userCard,
  catalogCard,
  bank,
  onEdit,
}: {
  userCard: UserCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  onEdit: (userCard: UserCard) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 border border-dashed border-slate-200 rounded-sm bg-white hover:border-slate-300 transition-colors">
      <WalletCardContent userCard={userCard} catalogCard={catalogCard} bank={bank} onEdit={onEdit} />
    </div>
  );
}

// ─── Sortable row (used in custom order mode) ─────────────────────────────────

export function SortableWalletCard({
  userCard,
  catalogCard,
  bank,
  onEdit,
}: {
  userCard: UserCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  onEdit: (userCard: UserCard) => void;
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
      <WalletCardContent userCard={userCard} catalogCard={catalogCard} bank={bank} onEdit={onEdit} />
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
