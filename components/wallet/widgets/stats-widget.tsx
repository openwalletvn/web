'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useWalletDb } from '@/providers/wallet-db-provider';
import { Widget } from './widget';

export function StatsWidget() {
  const db = useWalletDb();
  const walletCards = useLiveQuery(() => db.walletCards.toArray(), [db], []);
  const creditAccounts = useLiveQuery(() => db.creditAccounts.toArray(), [db], []);

  const totalCards = walletCards?.length ?? 0;
  if (totalCards === 0) return null;

  const creditCardCount = walletCards?.filter(
    (card) => card.cardType === 'credit' || card.cardType === '2in1',
  ).length ?? 0;

  const activeAccountIds = new Set(
    (walletCards ?? [])
      .filter((card) => card.creditAccountId && card.status !== 'expired' && card.status !== 'canceled')
      .map((card) => card.creditAccountId!),
  );

  const totalCreditLimit = creditAccounts
    ?.filter((account) => activeAccountIds.has(account.id))
    .reduce((sum, account) => sum + account.creditLimit, 0) ?? 0;

  const configuredCards = walletCards?.filter(
    (card) => card.statementDate || card.paymentDueDate,
  ).length ?? 0;

  return (
    <Widget title="Tổng quan">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Số thẻ</span>
          <span className="text-sm font-semibold text-slate-900">{totalCards}</span>
        </div>

        {creditCardCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Thẻ tín dụng</span>
            <span className="text-sm font-semibold text-slate-900">{creditCardCount}</span>
          </div>
        )}

        {totalCreditLimit > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Tổng hạn mức</span>
            <span className="text-sm font-semibold text-brand-blue">
              {totalCreditLimit.toLocaleString('vi-VN')}đ
            </span>
          </div>
        )}

        {configuredCards > 0 && configuredCards < totalCards && (
          <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-200">
            <span className="text-slate-400">Đã cài sao kê/đến hạn</span>
            <span className="text-slate-500">{configuredCards}/{totalCards}</span>
          </div>
        )}
      </div>
    </Widget>
  );
}
