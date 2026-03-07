'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconArrowForwardUp } from '@tabler/icons-react';
import { type Card, type Bank } from '@/lib/api';
import { CardImage } from '@/components/cards/card-image';
import type { WalletCard, CardStatus } from '@/lib/db';
import type { AppWallet } from '@/lib/app-db';
import { WalletCardBadges } from './wallet-card-badges';
import { MoveToWalletPicker } from './move-to-wallet-picker';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreditBadge = 'primary_shared' | 'supplementary';

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
  onStatusChange,
}: {
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  creditBadge?: CreditBadge;
  creditLimit?: number;
  onStatusChange?: (walletCard: WalletCard, status: CardStatus) => void;
}) {
  const isInactive = walletCard.status === 'expired' || walletCard.status === 'canceled';

  return (
    <>
      <Link
        href={`/app/my-cards/${walletCard.id}`}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        {/* Card image */}
        <div className={`shrink-0 w-20 aspect-[16/10] ${isInactive ? 'opacity-50' : ''}`}>
          {catalogCard ? (
            <CardImage card={catalogCard} />
          ) : (
            <div className="w-full h-full bg-slate-100 animate-pulse" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 truncate">{bank?.name ?? '-'}</p>
          <p className={`font-medium leading-tight truncate text-sm ${isInactive ? 'text-slate-400' : 'text-slate-900'}`}>
            {walletCard.nickname ?? catalogCard?.name ?? (
              <span className="inline-block w-28 h-4 bg-slate-100 rounded animate-pulse" />
            )}
          </p>

          <WalletCardBadges
            walletCard={walletCard}
            catalogCard={catalogCard}
            creditBadge={creditBadge}
            creditLimit={creditLimit}
          />

          {walletCard.note && (
            <p className="text-slate-400 mt-1 truncate">{walletCard.note}</p>
          )}
        </div>
      </Link>

      {/* Quick status select */}
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

// ─── Move button + picker dropdown ───────────────────────────────────────────

function MoveButton({
  walletCard,
  otherWallets,
}: {
  walletCard: WalletCard;
  otherWallets: AppWallet[];
}) {
  const [open, setOpen] = useState(false);

  if (otherWallets.length === 0) return null;

  return (
    <div className="relative shrink-0 self-center">
      <button
        onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }}
        className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors"
        aria-label="Chuyển sang ví khác"
        title="Chuyển sang ví"
      >
        <IconArrowForwardUp size={16} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-white border border-dashed border-slate-200 rounded-sm shadow-md overflow-hidden">
            <MoveToWalletPicker
              walletCard={walletCard}
              otherWallets={otherWallets}
              onMoved={() => setOpen(false)}
              onClose={() => setOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Plain row (sorted mode) ──────────────────────────────────────────────────

export function WalletCardRow({
  walletCard,
  catalogCard,
  bank,
  creditBadge,
  creditLimit,
  onStatusChange,
  otherWallets = [],
}: {
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  creditBadge?: CreditBadge;
  creditLimit?: number;
  onStatusChange?: (walletCard: WalletCard, status: CardStatus) => void;
  otherWallets?: AppWallet[];
}) {
  return (
    <div className="flex items-center gap-3 p-3 border border-dashed border-slate-200 rounded-sm bg-white hover:border-slate-300 transition-colors">
      <WalletCardContent
        walletCard={walletCard}
        catalogCard={catalogCard}
        bank={bank}
        creditBadge={creditBadge}
        creditLimit={creditLimit}
        onStatusChange={onStatusChange}
      />
      <MoveButton walletCard={walletCard} otherWallets={otherWallets} />
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
  onStatusChange,
  otherWallets = [],
}: {
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  creditBadge?: CreditBadge;
  creditLimit?: number;
  onStatusChange?: (walletCard: WalletCard, status: CardStatus) => void;
  otherWallets?: AppWallet[];
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
        onStatusChange={onStatusChange}
      />
      <MoveButton walletCard={walletCard} otherWallets={otherWallets} />
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
