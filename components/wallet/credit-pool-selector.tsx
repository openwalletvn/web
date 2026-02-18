'use client';

import { useState, useEffect } from 'react';
import { getCreditAccountsForBank, getCardsForCreditAccount } from '@/lib/credit-account';
import type { CreditAccount } from '@/lib/db';

export interface PoolSelection {
  poolChoice: 'new' | string; // 'new' or creditAccountId
  creditLimit: string;
  isSupplementary: boolean;
}

interface Props {
  bankId: string;
  value: PoolSelection;
  onChange: (value: PoolSelection) => void;
  /** Show the supplementary checkbox only when wallet already has another card
   *  with the same catalog cardId (same product = possible primary/supplementary pair). */
  canBeSupplementary?: boolean;
}

const inputClass =
  'w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm';

export function CreditPoolSelector({ bankId, value, onChange, canBeSupplementary = false }: Props) {
  const [accounts, setAccounts] = useState<CreditAccount[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const existingAccounts = await getCreditAccountsForBank(bankId);
      if (cancelled) return;

      const counts: Record<string, number> = {};
      for (const account of existingAccounts) {
        const cards = await getCardsForCreditAccount(account.id);
        // Only count active cards — expired/canceled don't count toward pool occupancy
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
  }, [bankId]);

  if (loading) {
    return <div className="h-16 bg-slate-50 border border-dashed border-slate-200 rounded-sm animate-pulse" />;
  }

  // No existing accounts: just a credit limit input, will create new pool on save
  if (accounts.length === 0) {
    return (
      <div>
        <label className="block font-medium text-slate-600 mb-1">
          Hạn mức tín dụng (VND)
        </label>
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

  // 1+ existing accounts: show pool picker
  return (
    <div>
      <label className="block font-medium text-slate-600 mb-2">Hạn mức tín dụng</label>
      <div className="space-y-2">

        {/* Create new pool */}
        <label className={`flex items-start gap-2.5 p-2.5 border border-dashed rounded-sm cursor-pointer transition-colors ${
          value.poolChoice === 'new'
            ? 'border-brand-blue bg-blue-50/40'
            : 'border-slate-200 hover:border-slate-300'
        }`}>
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
                className={`mt-1.5 ${inputClass}`}
              />
            )}
          </div>
        </label>

        {/* Existing pools */}
        {accounts.map((account) => {
          const count = cardCounts[account.id] ?? 0;
          const isSelected = value.poolChoice === account.id;
          return (
            <label key={account.id} className={`flex items-start gap-2.5 p-2.5 border border-dashed rounded-sm cursor-pointer transition-colors ${
              isSelected ? 'border-brand-blue bg-blue-50/40' : 'border-slate-200 hover:border-slate-300'
            }`}>
              <input
                type="radio"
                name={`pool-${bankId}`}
                checked={isSelected}
                onChange={() => onChange({ poolChoice: account.id, creditLimit: account.creditLimit.toString(), isSupplementary: value.isSupplementary })}
                className="mt-0.5 shrink-0 accent-brand-blue"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-700">
                  Dùng chung pool hiện có ({count} thẻ)
                </p>
                <p className="text-slate-400">
                  Hạn mức: {account.creditLimit.toLocaleString('vi-VN')}đ
                </p>
                {/* Only show when wallet already has another card with the same catalog cardId */}
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
