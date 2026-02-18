'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Widget } from './widget';

export function StatsWidget() {
  const userCards = useLiveQuery(() => db.userCards.toArray(), [], []);

  const totalCards = userCards?.length ?? 0;

  const creditCards = userCards?.filter(
    (card) => card.creditLimit !== undefined && card.creditLimit > 0,
  ) ?? [];

  const totalCreditLimit = creditCards.reduce(
    (sum, card) => sum + (card.creditLimit ?? 0),
    0,
  );

  const configuredCards = userCards?.filter(
    (card) => card.statementDate || card.paymentDueDate,
  ) ?? [];

  if (totalCards === 0) return null;

  return (
    <Widget title="Tổng quan">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Số thẻ</span>
          <span className="text-sm font-semibold text-slate-900">{totalCards}</span>
        </div>

        {creditCards.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Thẻ tín dụng</span>
            <span className="text-sm font-semibold text-slate-900">{creditCards.length}</span>
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

        {configuredCards.length > 0 && configuredCards.length < totalCards && (
          <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-200">
            <span className="text-xs text-slate-400">Đã cài sao kê/đến hạn</span>
            <span className="text-xs text-slate-500">
              {configuredCards.length}/{totalCards}
            </span>
          </div>
        )}
      </div>
    </Widget>
  );
}
