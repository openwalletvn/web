'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CardType, CardNetwork } from '@/lib/api';

const TYPES: { value: CardType; label: string }[] = [
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'transit', label: 'Transit' },
  { value: 'atm', label: 'ATM' },
];

const NETWORKS: { value: CardNetwork; label: string }[] = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'jcb', label: 'JCB' },
  { value: 'napas', label: 'Napas' },
  { value: 'amex', label: 'Amex' },
  { value: 'unionpay', label: 'UnionPay' },
];

export function CardsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/cards?${params.toString()}`);
  }

  const hasFilter = !!(searchParams.get('type') || searchParams.get('network'));

  return (
    <div className="flex gap-3 flex-wrap items-center">
      <Select
        value={searchParams.get('type') ?? 'all'}
        onValueChange={(v) => update('type', v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get('network') ?? 'all'}
        onValueChange={(v) => update('network', v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Network" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All networks</SelectItem>
          {NETWORKS.map((n) => (
            <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilter && (
        <button
          onClick={() => router.push('/cards')}
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
