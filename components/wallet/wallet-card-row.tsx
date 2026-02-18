'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical } from '@tabler/icons-react';
import { getCardImageUrl, type Card, type Bank } from '@/lib/api';
import type { WalletCard, CardStatus } from '@/lib/db';
import { DashedBadge } from '@/components/ui/dashed-badge';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreditBadge = 'primary_shared' | 'supplementary';

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  locked:   'Đã khoá',
  expired:  'Hết hạn',
  canceled: 'Đã huỷ',
};

const ALL_STATUSES: { value: CardStatus; label: string }[] = [
  { value: 'active',   label: 'Đang dùng' },
  { value: 'locked',   label: 'Đã khoá' },
  { value: 'expired',  label: 'Hết hạn' },
  { value: 'canceled', label: 'Đã huỷ' },
];

// ─── Shared inner content ─────────────────────────────────────────────────────

export function WalletCardContent({
  walletCard,
  catalogCard,
  bank,
  creditBadge,
  creditLimit,
  onEdit,
  onStatusChange,
}: {
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  creditBadge?: CreditBadge;
  creditLimit?: number;
  onEdit: (walletCard: WalletCard) => void;
  onStatusChange?: (walletCard: WalletCard, status: CardStatus) => void;
}) {
  // Locked counts as active — only expired and canceled are truly inactive
  const isInactive = walletCard.status === 'expired' || walletCard.status === 'canceled';

  return (
    <>
      {/* Clickable area: image + info */}
      <button
        onClick={() => onEdit(walletCard)}
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
          <p className="text-slate-400 truncate">{bank?.name ?? '—'}</p>
          <p className={`font-medium leading-tight truncate text-sm ${isInactive ? 'text-slate-400' : 'text-slate-900'}`}>
            {walletCard.nickname ?? catalogCard?.name ?? (
              <span className="inline-block w-28 h-4 bg-slate-100 rounded animate-pulse" />
            )}
          </p>

          <div className="flex flex-wrap gap-1 mt-1.5">
            {/* Status badge — locked, expired, canceled */}
            {walletCard.status && walletCard.status !== 'active' && (
              <DashedBadge variant={isInactive ? 'amber' : 'default'}>
                {STATUS_LABELS[walletCard.status]}
              </DashedBadge>
            )}

            {/* Credit role badge */}
            {creditBadge === 'supplementary' && (
              <DashedBadge variant="default">Thẻ phụ</DashedBadge>
            )}
            {creditBadge === 'primary_shared' && (
              <DashedBadge variant="blue">Thẻ thông</DashedBadge>
            )}

            {walletCard.last4 && (
              <DashedBadge>•••• {walletCard.last4}</DashedBadge>
            )}

            {walletCard.validThru && (
              <DashedBadge>Đến {walletCard.validThru}</DashedBadge>
            )}

            {/* Annual fee from catalog */}
            {catalogCard?.annual_fee !== undefined && (
              catalogCard.annual_fee === 0 ? (
                <DashedBadge variant="green">Miễn phí thường niên</DashedBadge>
              ) : (
                <DashedBadge>PTN: {catalogCard.annual_fee.toLocaleString('vi-VN')}đ</DashedBadge>
              )
            )}

            {/* Credit limit from credit account */}
            {creditLimit !== undefined && creditLimit > 0 && (
              <DashedBadge variant="blue">Hạn mức: {creditLimit.toLocaleString('vi-VN')}đ</DashedBadge>
            )}

            {walletCard.statementDate && (
              <DashedBadge variant="blue">Sao kê: ngày {walletCard.statementDate}</DashedBadge>
            )}

            {walletCard.paymentDueDate && (
              <DashedBadge variant="red">Đến hạn: ngày {walletCard.paymentDueDate}</DashedBadge>
            )}
          </div>

          {walletCard.note && (
            <p className="text-slate-400 mt-1 truncate">{walletCard.note}</p>
          )}
        </div>
      </button>

      {/* Quick status select — outside the edit button to avoid nesting */}
      {onStatusChange && (
        <select
          value={walletCard.status ?? 'active'}
          onChange={(e) => onStatusChange(walletCard, e.target.value as CardStatus)}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 self-center px-2 py-1 border border-dashed border-slate-200 rounded-sm bg-white text-slate-600 text-sm focus:outline-none focus:border-brand-blue hover:border-slate-400 transition-colors cursor-pointer"
          aria-label="Trạng thái thẻ"
        >
          {ALL_STATUSES.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
    </>
  );
}

// ─── Plain row (sorted mode) ──────────────────────────────────────────────────

export function WalletCardRow({
  walletCard,
  catalogCard,
  bank,
  creditBadge,
  creditLimit,
  onEdit,
  onStatusChange,
}: {
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  creditBadge?: CreditBadge;
  creditLimit?: number;
  onEdit: (walletCard: WalletCard) => void;
  onStatusChange?: (walletCard: WalletCard, status: CardStatus) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 border border-dashed border-slate-200 rounded-sm bg-white hover:border-slate-300 transition-colors">
      <WalletCardContent
        walletCard={walletCard}
        catalogCard={catalogCard}
        bank={bank}
        creditBadge={creditBadge}
        creditLimit={creditLimit}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}

// ─── Sortable row (custom order mode) ────────────────────────────────────────

export function SortableWalletCard({
  walletCard,
  catalogCard,
  bank,
  creditBadge,
  creditLimit,
  onEdit,
  onStatusChange,
}: {
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  creditBadge?: CreditBadge;
  creditLimit?: number;
  onEdit: (walletCard: WalletCard) => void;
  onStatusChange?: (walletCard: WalletCard, status: CardStatus) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: walletCard.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="flex items-center gap-3 p-3 border border-dashed border-slate-200 rounded-sm bg-white hover:border-slate-300 transition-colors"
    >
      <WalletCardContent
        walletCard={walletCard}
        catalogCard={catalogCard}
        bank={bank}
        creditBadge={creditBadge}
        creditLimit={creditLimit}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
      />
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
