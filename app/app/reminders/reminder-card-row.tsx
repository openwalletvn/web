'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconAlertTriangle } from '@tabler/icons-react';
import { getBankImageUrl, type Bank, type Card } from '@/lib/api';
import type { WalletCard } from '@/lib/db';
import {formatDueDate, getRelatedStatements} from '@/lib/card-dates';
import {CardModel} from '@/lib/card-model';
import { Switch } from '@/components/ui/switch';
import type { WalletDb } from '@/lib/db';
import type { NotificationAdapter } from '@/lib/app-db';

type ReminderType = 'statementDate' | 'paymentDueDate';

export function ReminderCardRow({
  walletCard,
  catalogCard,
  bank,
  adapter,
  db,
  limitReached: _limitReached,
}: {
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  bank: Bank | undefined;
  adapter: NotificationAdapter | undefined;
  db: WalletDb;
  limitReached: boolean;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  const cardName = walletCard.nickname ?? catalogCard?.name ?? '-';
  const bankName = bank?.name ?? '-';

  const daysBefore = adapter?.daysBefore ?? 1;
  const notifyHour = adapter?.notifyHour ?? 8;
  const hourStr = notifyHour.toString().padStart(2, '0');

  const today = (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); })();
  const cardModel = catalogCard ? new CardModel(catalogCard) : null;
  const statementDay = cardModel?.resolveStatementDay(walletCard.statementDate) ?? null;

  const stmts = (statementDay != null && catalogCard?.interest_free_days != null)
    ? getRelatedStatements(today, statementDay, catalogCard.interest_free_days)
    : null;

  const nextCloseDate = stmts?.find((s) => s.close > today)?.close ?? null;
  const dueDateObj = cardModel?.getNextDueDate(walletCard.statementDate, today) ?? null;

  const stmtFireDate = nextCloseDate
    ? (() => { const d = new Date(nextCloseDate.getTime()); d.setDate(d.getDate() - daysBefore); return d; })()
    : null;

  const dueFireDate = dueDateObj
    ? (() => { const d = new Date(dueDateObj.getTime()); d.setDate(d.getDate() - daysBefore); return d; })()
    : null;

  function formatFireHint(fireDate: Date): string {
    return `→ sẽ nhắc ${formatDueDate(fireDate)} lúc ${hourStr}:00`;
  }

  async function handleToggle(type: ReminderType, enabled: boolean) {
    if (!adapter) return;
    setBusy(`${type}-toggle`);
    try {
      await db.walletCards.update(walletCard.id, {
        [`notifications.${type}`]: {
          enabled,
          daysBefore,
          adapter: adapter.id,
        },
      });
    } catch {
      // silently fail
    } finally {
      setBusy(null);
    }
  }

  function renderStatementRow() {
    if (statementDay == null) {
      return (
        <div className="flex items-center gap-2 text-amber-600 text-sm py-2">
          <IconAlertTriangle size={14} className="shrink-0" />
          <span>Chưa có ngày sao kê</span>
          <Link href="/app/my-cards" className="underline text-brand-blue ml-1">
            Cài đặt thẻ
          </Link>
        </div>
      );
    }

    const config = walletCard.notifications?.statementDate;
    const isEnabled = !!config?.enabled;
    const disabled = !adapter || busy !== null;

    return (
      <div className="py-2">
        <div className="flex items-center gap-3">
          <Switch
            checked={isEnabled}
            disabled={disabled}
            onCheckedChange={(checked) => handleToggle('statementDate', checked)}
          />
          <span className="text-sm text-slate-600">
            Ngày sao kê tiếp theo{nextCloseDate ? ` · ${formatDueDate(nextCloseDate)}` : ''}
          </span>
        </div>
        {isEnabled && stmtFireDate && (
          <p className="text-xs text-slate-400 mt-0.5 ml-12">
            {formatFireHint(stmtFireDate)}
          </p>
        )}
      </div>
    );
  }

  function renderDueDateRow() {
    if (dueDateObj == null && statementDay == null) return null;

    if (dueDateObj == null) {
      return (
        <div className="flex items-center gap-2 text-amber-600 text-sm py-2">
          <IconAlertTriangle size={14} className="shrink-0" />
          <span>Không có dữ liệu ngày miễn lãi</span>
          <Link href="/app/my-cards" className="underline text-brand-blue ml-1">
            Cài đặt thẻ
          </Link>
        </div>
      );
    }

    const config = walletCard.notifications?.paymentDueDate;
    const isEnabled = !!config?.enabled;
    const disabled = !adapter || busy !== null;

    return (
      <div className="py-2">
        <div className="flex items-center gap-3">
          <Switch
            checked={isEnabled}
            disabled={disabled}
            onCheckedChange={(checked) => handleToggle('paymentDueDate', checked)}
          />
          <span className="text-sm text-slate-600">
            Ngày đến hạn tiếp theo · {formatDueDate(dueDateObj)}
          </span>
        </div>
        {isEnabled && dueFireDate && (
          <p className="text-xs text-slate-400 mt-0.5 ml-12">
            {formatFireHint(dueFireDate)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="py-4 border-b border-dashed border-slate-100 last:border-0">
      <div className="flex items-center gap-3 mb-2">
        {bank?.logo_url ? (
          <img
            src={getBankImageUrl(bank.logo_url)}
            alt={bankName}
            className="h-6 w-6 object-contain shrink-0"
          />
        ) : (
          <div className="h-6 w-6 bg-slate-100 rounded shrink-0" />
        )}
        <span className="font-medium text-slate-900 truncate flex-1">{cardName}</span>
        {walletCard.last4 && (
          <span className="text-sm text-slate-400 shrink-0">•••• {walletCard.last4}</span>
        )}
      </div>

      <div className="ml-9">
        {renderStatementRow()}
        {renderDueDateRow()}
      </div>
    </div>
  );
}
