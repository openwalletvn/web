import { getCardImageUrl, type Bank, type Card } from '@/lib/api';
import type { WalletCard } from '@/lib/db';

export const MONTH_VI = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

export function getNextOccurrence(dayOfMonth: number): Date {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
  return thisMonth > now
    ? thisMonth
    : new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth);
}

export function PaymentRow({
  date,
  walletCard,
  catalogCard,
  bank,
  isNext,
}: {
  date: Date;
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  isNext: boolean;
}) {
  const daysUntil = Math.ceil((date.getTime() - Date.now()) / 86_400_000);
  const label = daysUntil === 0 ? 'Hôm nay' : daysUntil === 1 ? 'Ngày mai' : `${daysUntil} ngày nữa`;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-dashed border-slate-100 last:border-0">
      {/* Date block */}
      <div className="shrink-0 w-12 text-center">
        <p className={`text-3xl font-bold leading-none ${isNext ? 'text-brand-blue' : 'text-slate-800'}`}>
          {date.getDate()}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{MONTH_VI[date.getMonth()]}</p>
      </div>

      {/* Divider */}
      <div className={`self-stretch w-px shrink-0 ${isNext ? 'bg-brand-blue' : 'bg-slate-100'}`} />

      {/* Card image */}
      <div className="shrink-0 w-16 aspect-[16/10] bg-slate-50 rounded-sm overflow-hidden self-center">
        {catalogCard ? (
          <img src={getCardImageUrl(catalogCard)} alt={catalogCard.name} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full bg-slate-100 animate-pulse" />
        )}
      </div>

      {/* Card info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate">
          {walletCard.nickname ?? catalogCard?.name ?? '—'}
        </p>
        {walletCard.nickname && catalogCard?.name && (
          <p className="text-xs text-slate-400 truncate">{catalogCard.name}</p>
        )}
        <p className="text-xs text-slate-400 mt-0.5">{bank?.name ?? '—'}</p>
      </div>

      {/* Days badge */}
      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-sm border border-dashed ${
        isNext
          ? 'border-brand-blue text-brand-blue bg-blue-50/60'
          : 'border-slate-200 text-slate-400'
      }`}>
        {label}
      </span>
    </div>
  );
}
