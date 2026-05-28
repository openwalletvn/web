'use client';

import { useState, useEffect } from 'react';
import { getCreditAccountsForBank, getCardsForCreditAccount } from '@/lib/credit-account';
import { inputClass } from '@/lib/ui-constants';
import { cn } from '@/lib/utils';
import type { CreditAccount } from '@/lib/db';
import { useWalletDb } from '@/providers/wallet-db-provider';

export interface PoolSelection {
  poolChoice: 'new' | string; // 'new' or creditAccountId
  creditLimit: string;
  isSupplementary: boolean;
}

interface Props {
  bankId: string;
  value: PoolSelection;
  onChange: (value: PoolSelection) => void;
  canBeSupplementary?: boolean;
}

export function CreditPoolSelector({ bankId, value, onChange, canBeSupplementary = false }: Props) {
  const db = useWalletDb();
  const [accounts, setAccounts] = useState<CreditAccount[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const existingAccounts = await getCreditAccountsForBank(db, bankId);
      if (cancelled) return;

      const counts: Record<string, number> = {};
      for (const account of existingAccounts) {
        const cards = await getCardsForCreditAccount(db, account.id);
        counts[account.id] = cards.filter(
          (card) => card.status !== 'expired' && card.status !== 'canceled',
        ).length;
      }

      if (!cancelled) {
        setAccounts(existingAccounts);
        setCardCounts(counts);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [db, bankId]);

  if (loading) {
    return <div className="ow-credit-pool-selector h-16 bg-slate-50 border border-dashed border-slate-200 rounded-sm animate-pulse" />;
  }

  if (accounts.length === 0) {
    return (
      <div className="ow-credit-pool-selector">
        <label className="block font-medium text-slate-600 mb-1">Hạn mức tín dụng (VND)</label>
        <input
          type="number"
          value={value.creditLimit}
          onChange={(e) => onChange({ poolChoice: 'new', creditLimit: e.target.value, isSupplementary: false })}
          placeholder="50.000.000"
          className={inputClass}
        />
      </div>
    );
  }

  return (
    <div className="ow-credit-pool-selector">
      <label className="block font-medium text-slate-600 mb-2">Hạn mức tín dụng</label>
      <div className="space-y-2">
        {/* Create new pool */}
        <label className={cn('flex items-start gap-2.5 p-2.5 border border-dashed rounded-sm cursor-pointer transition-colors', value.poolChoice === 'new' ? 'border-brand-blue bg-blue-50/40' : 'border-slate-200 hover:border-slate-300')}>
          <input
            type="radio"
            name={`pool-${bankId}`}
            checked={value.poolChoice === 'new'}
            onChange={() => onChange({ poolChoice: 'new', creditLimit: value.creditLimit, isSupplementary: false })}
            className="mt-0.5 shrink-0 accent-brand-blue"
          />
          <div className="flex-1">
            <p className="font-medium text-slate-700">Tạo pool mới riêng</p>
            {value.poolChoice === 'new' && (
              <input
                type="number"
                value={value.creditLimit}
                onChange={(e) => onChange({ poolChoice: 'new', creditLimit: e.target.value, isSupplementary: false })}
                placeholder="50.000.000"
                onClick={(e) => e.stopPropagation()}
                className={cn('mt-1.5', inputClass)}
              />
            )}
          </div>
        </label>

        {/* Existing pools */}
        {accounts.map((account) => {
          const count = cardCounts[account.id] ?? 0;
          const isSelected = value.poolChoice === account.id;
          return (
            <label key={account.id} className={cn('flex items-start gap-2.5 p-2.5 border border-dashed rounded-sm cursor-pointer transition-colors', isSelected ? 'border-brand-blue bg-blue-50/40' : 'border-slate-200 hover:border-slate-300')}>
              <input
                type="radio"
                name={`pool-${bankId}`}
                checked={isSelected}
                onChange={() => onChange({ poolChoice: account.id, creditLimit: account.creditLimit.toString(), isSupplementary: value.isSupplementary })}
                className="mt-0.5 shrink-0 accent-brand-blue"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-700">Dùng chung pool hiện có ({count} thẻ)</p>
                <p className="text-slate-400">Hạn mức: {account.creditLimit.toLocaleString('vi-VN')}đ</p>
                {isSelected && canBeSupplementary && (
                  <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value.isSupplementary}
                      onChange={(e) => onChange({ ...value, isSupplementary: e.target.checked })}
                      className="accent-brand-blue"
                    />
                    <span className="text-slate-600">Đây là thẻ phụ</span>
                  </label>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
