'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';
import { getBankImageUrl, type Bank, type Card } from '@/lib/api';
import type { WalletCard, CardNotificationConfig } from '@/lib/db';
import { buildReminderMessage } from '@/lib/reminder-message';
import { createReminder, updateReminder, deleteReminder } from '@/lib/notify-api';
import type { WalletDb } from '@/lib/db';
import type { NotificationAdapter } from '@/lib/app-db';

const DAYS_OPTIONS = [
  { value: 0, label: 'Đúng ngày' },
  { value: 1, label: '1 ngày trước' },
  { value: 2, label: '2 ngày trước' },
  { value: 3, label: '3 ngày trước' },
];

type ReminderType = 'statementDate' | 'paymentDueDate';

function StatusIcon({ config }: { config?: CardNotificationConfig }) {
  if (!config?.remoteId) return null;
  return <IconCheck size={14} className="text-green-500 shrink-0" />;
}

export function ReminderCardRow({
  walletCard,
  catalogCard,
  bank,
  adapter,
  db,
  limitReached,
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
  const hasStatement = walletCard.statementDate != null;
  const hasDue = walletCard.paymentDueDate != null;
  const noDates = !hasStatement && !hasDue;

  async function handleToggle(type: ReminderType, dayOfMonth: number, enabled: boolean) {
    if (!adapter) return;
    const key = `${type}-toggle`;
    setBusy(key);
    try {
      const existing = walletCard.notifications?.[type];
      if (enabled && !existing?.remoteId) {
        const msg = buildReminderMessage(bankName, cardName, type, existing?.daysBefore ?? 1);
        const result = await createReminder({
          wallet_id: walletCard.id,
          adapter: adapter.id,
          credential: adapter.config.webhook_url,
          fire_on_day: dayOfMonth,
          days_before: existing?.daysBefore ?? 1,
          message: msg,
        });
        await db.walletCards.update(walletCard.id, {
          [`notifications.${type}`]: { enabled: true, daysBefore: existing?.daysBefore ?? 1, adapter: adapter.id, remoteId: result.id },
        });
      } else if (!enabled && existing?.remoteId) {
        await deleteReminder(existing.remoteId);
        await db.walletCards.update(walletCard.id, {
          [`notifications.${type}`]: { enabled: false, daysBefore: existing.daysBefore, adapter: adapter.id },
        });
      }
    } catch {
      // silently fail — user sees no status icon
    } finally {
      setBusy(null);
    }
  }

  async function handleDaysChange(type: ReminderType, dayOfMonth: number, daysBefore: number) {
    if (!adapter) return;
    const existing = walletCard.notifications?.[type];
    if (!existing?.remoteId) return;
    setBusy(`${type}-days`);
    try {
      const msg = buildReminderMessage(bankName, cardName, type, daysBefore);
      await updateReminder(existing.remoteId, { days_before: daysBefore, message: msg, fire_on_day: dayOfMonth });
      await db.walletCards.update(walletCard.id, {
        [`notifications.${type}`]: { ...existing, daysBefore },
      });
    } catch {
      // silently fail
    } finally {
      setBusy(null);
    }
  }

  function renderRow(type: ReminderType, dayOfMonth: number, label: string) {
    const config = walletCard.notifications?.[type];
    const isEnabled = config?.enabled && !!config.remoteId;
    const disabled = !adapter || (limitReached && !isEnabled) || busy !== null;

    return (
      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          checked={isEnabled}
          disabled={disabled}
          onChange={(e) => handleToggle(type, dayOfMonth, e.target.checked)}
          className="accent-[var(--color-brand-blue)] shrink-0"
        />
        <span className="text-sm text-slate-600 flex-1 min-w-0">{label}</span>
        <select
          value={config?.daysBefore ?? 1}
          disabled={!isEnabled || busy !== null}
          onChange={(e) => handleDaysChange(type, dayOfMonth, Number(e.target.value))}
          className="text-sm border border-dashed border-slate-300 rounded-sm px-2 py-1 text-slate-700 focus:outline-none focus:border-brand-blue"
        >
          {DAYS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <StatusIcon config={config} />
      </div>
    );
  }

  return (
    <div className="py-4 border-b border-dashed border-slate-100 last:border-0">
      <div className="flex items-center gap-3 mb-2">
        {bank?.logo_url ? (
          <img src={getBankImageUrl(bank.logo_url)} alt={bankName} className="h-6 w-6 object-contain shrink-0" />
        ) : (
          <div className="h-6 w-6 bg-slate-100 rounded-sm shrink-0" />
        )}
        <span className="font-medium text-slate-900 truncate flex-1">{cardName}</span>
        {walletCard.last4 && <span className="text-sm text-slate-400 shrink-0">•••• {walletCard.last4}</span>}
      </div>

      {noDates ? (
        <div className="flex items-center gap-2 text-amber-600 text-sm ml-9">
          <IconAlertTriangle size={14} />
          <span>Chưa cài ngày đến hạn</span>
          <Link href={`/app/my-cards`} className="underline text-brand-blue ml-1">Sửa thẻ</Link>
        </div>
      ) : (
        <div className="ml-9">
          {hasStatement && renderRow('statementDate', walletCard.statementDate!, 'Ngày sao kê')}
          {hasDue && renderRow('paymentDueDate', walletCard.paymentDueDate!, 'Ngày đến hạn')}
        </div>
      )}
    </div>
  );
}
