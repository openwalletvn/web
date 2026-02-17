'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Bank, CardType, CardNetwork, CardSort } from '@/lib/api';

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

const SORTS: { value: CardSort; label: string }[] = [
  { value: 'fee_asc', label: 'Fee: Low to High' },
  { value: 'fee_desc', label: 'Fee: High to Low' },
];

interface Props {
  banks: Bank[];
}

export function CardsFilter({ banks }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/cards?${params.toString()}`);
  }

  function toggleCoBrand() {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('co_brand') === '1') {
      params.delete('co_brand');
    } else {
      params.set('co_brand', '1');
    }
    router.push(`/cards?${params.toString()}`);
  }

  const isCoBrand = searchParams.get('co_brand') === '1';
  const hasFilter = !!(
    searchParams.get('type') ||
    searchParams.get('network') ||
    searchParams.get('bank') ||
    searchParams.get('co_brand') ||
    searchParams.get('sort')
  );

  return (
    <div className="flex gap-2 flex-wrap items-center">
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

      <Select
        value={searchParams.get('bank') ?? 'all'}
        onValueChange={(v) => update('bank', v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Bank" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All banks</SelectItem>
          {banks.map((b) => (
            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get('sort') ?? 'default'}
        onValueChange={(v) => update('sort', v === 'default' ? '' : v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default order</SelectItem>
          {SORTS.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={toggleCoBrand}
        className={`h-9 px-3 rounded-md border text-base font-medium transition-colors ${
          isCoBrand
            ? 'bg-brand-blue text-white border-brand-blue'
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
      >
        Co-branded
      </button>

      {hasFilter && (
        <button
          onClick={() => router.push('/cards')}
          className="h-9 px-3 text-base text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2"
        >
          Reset
        </button>
      )}
    </div>
  );
}
