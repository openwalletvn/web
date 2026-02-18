'use client';

import { getBankImageUrl, type Bank, type Card } from '@/lib/api';
import type { UserCard } from '@/lib/db';

interface Props {
  userCards: UserCard[];
  banks: Record<string, Bank>;
  catalogCards: Record<string, Card>;
  selectedBankId: string | null;
  onSelect: (bankId: string | null) => void;
}

export function BankFilterBar({ userCards, banks, catalogCards, selectedBankId, onSelect }: Props) {
  // Count cards per bank using resolved catalog data
  const bankCardCounts = new Map<string, number>();
  for (const userCard of userCards) {
    const catalogCard = catalogCards[userCard.catalogId];
    if (!catalogCard) continue;
    const count = bankCardCounts.get(catalogCard.bank_id) ?? 0;
    bankCardCounts.set(catalogCard.bank_id, count + 1);
  }

  const bankIds = [...bankCardCounts.keys()];

  // Only render when there are 2+ banks
  if (bankIds.length < 2) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
      {bankIds.map((bankId) => {
        const bank = banks[bankId];
        if (!bank) return null;
        const cardCount = bankCardCounts.get(bankId) ?? 0;
        const isSelected = selectedBankId === bankId;

        return (
          <button
            key={bankId}
            onClick={() => onSelect(isSelected ? null : bankId)}
            className={`flex flex-col items-center gap-1 p-2.5 border border-dashed rounded-sm shrink-0 w-20 transition-colors ${
              isSelected
                ? 'border-brand-blue bg-blue-50/60'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
            }`}
          >
            <img
              src={getBankImageUrl(bank.logo_url)}
              alt={bank.name}
              className="w-8 h-8 object-contain"
            />
            <p className="text-xs text-slate-600 text-center leading-tight line-clamp-2">{bank.name}</p>
            <p className="text-xs text-slate-400">{cardCount} thẻ</p>
          </button>
        );
      })}
    </div>
  );
}
