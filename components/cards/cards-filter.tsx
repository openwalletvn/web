'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Bank, CardType, CardNetwork } from '@/lib/api';
import posthog from 'posthog-js';

interface Props {
  banks: Bank[];
  types: CardType[];
  networks: CardNetwork[];
  enabledFilters: Array<'type' | 'network' | 'bank' | 'sort'>;
  coBrandAvailable: boolean;
  coBrandDisabled: boolean;
}

export function CardsFilter({
  banks,
  types,
  networks,
  enabledFilters,
  coBrandAvailable,
  coBrandDisabled,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('CardsFilter');

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === '' || value === 'default') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/the?${params.toString()}`);
    posthog.capture('catalog_filter_applied', {
      filter_key: key,
      filter_value: value === 'all' || value === 'default' ? null : value,
    });
  }

  function toggleCoBrand() {
    const params = new URLSearchParams(searchParams.toString());
    const isEnabling = params.get('co_brand') !== '1';
    if (!isEnabling) {
      params.delete('co_brand');
    } else {
      params.set('co_brand', '1');
    }
    router.push(`/the?${params.toString()}`);
    posthog.capture('catalog_filter_applied', {
      filter_key: 'co_brand',
      filter_value: isEnabling ? '1' : null,
    });
  }

  function cycleSortOrder() {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get('sort');
    let next: string;

    if (!current || current === 'default') {
      next = 'fee_asc';
    } else if (current === 'fee_asc') {
      next = 'fee_desc';
    } else {
      next = 'default';
    }

    if (next === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', next);
    }

    router.push(`/the?${params.toString()}`);
    posthog.capture('catalog_filter_applied', {
      filter_key: 'sort',
      filter_value: next === 'default' ? null : next,
    });
  }

  const isCoBrand = searchParams.get('co_brand') === '1';
  const sortValue = searchParams.get('sort') ?? 'default';

  const hasFilter = !!(
    searchParams.get('type') ||
    searchParams.get('network') ||
    searchParams.get('bank') ||
    searchParams.get('co_brand') ||
    searchParams.get('sort')
  );

  const hasEnabledFilters = enabledFilters.length > 0;

  // Sort button label
  const sortLabel = sortValue === 'fee_asc'
    ? 'Fee ↑'
    : sortValue === 'fee_desc'
    ? 'Fee ↓'
    : t('default_order');

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {enabledFilters.includes('type') && (
        <Select value={searchParams.get('type') ?? 'all'} onValueChange={(v) => update('type', v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder={t('all_types')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_types')}</SelectItem>
            <SelectItem value="credit">{t('type_credit')}</SelectItem>
            <SelectItem value="debit">{t('type_debit')}</SelectItem>
          </SelectContent>
        </Select>
      )}

      {enabledFilters.includes('network') && (
        <Select value={searchParams.get('network') ?? 'all'} onValueChange={(v) => update('network', v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder={t('all_networks')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_networks')}</SelectItem>
            {networks.map((key) => (
              <SelectItem key={key} value={key}>{t(`network_${key}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {enabledFilters.includes('bank') && (
        <Select value={searchParams.get('bank') ?? 'all'} onValueChange={(v) => update('bank', v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t('all_banks')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_banks')}</SelectItem>
            {banks.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {enabledFilters.includes('sort') && (
        <button
          onClick={cycleSortOrder}
          className="h-9 px-3 rounded-md border bg-white text-slate-700 border-slate-300 hover:bg-slate-50 text-base font-medium transition-colors"
        >
          {sortLabel}
        </button>
      )}

      {coBrandAvailable && (
        <button
          onClick={toggleCoBrand}
          disabled={coBrandDisabled}
          className={`h-9 px-3 rounded-md border text-base font-medium transition-colors ${
            coBrandDisabled
              ? 'opacity-40 pointer-events-none bg-white text-slate-700 border-slate-300'
              : isCoBrand
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {t('co_branded')}
        </button>
      )}

      {hasFilter && hasEnabledFilters && (
        <button
          onClick={() => router.push('/the')}
          className="h-9 px-3 text-base text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2"
        >
          {t('reset')}
        </button>
      )}
    </div>
  );
}
