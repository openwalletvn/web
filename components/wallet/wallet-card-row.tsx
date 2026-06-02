'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type Bank, type Card } from '@/lib/api';
import {CardModel} from '@/lib/card-model';
import { getMyCardUrl } from '@/lib/routes';
import {OwCardImage} from '@/components/ow-ui/ow-card-image';
import type { CardStatus, WalletCard } from '@/lib/db';
import { WalletCardBadges } from './wallet-card-badges';

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
        href={getMyCardUrl(walletCard.id)}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        {/* Card image */}
          <div className={cn('shrink-0 w-20', isInactive ? 'opacity-50' : '')}>
          {catalogCard ? (
              <>
                  {catalogCard.image?.orientation === "vertical" ? (
                      <div className="h-20 flex justify-center items-center">
                          <OwCardImage card={new CardModel(catalogCard)} className="h-full w-auto"/>
                      </div>
                  ) : (
                      <div className="w-full flex justify-center items-center">
                          <OwCardImage card={new CardModel(catalogCard)} className="w-full"/>
                      </div>
                  )}
              </>

          ) : (
            <div className="w-full h-full bg-slate-100 animate-pulse" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium leading-tight truncate text-sm', isInactive ? 'text-slate-400' : 'text-slate-900')}>
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
