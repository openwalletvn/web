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
import type { Bank, CardType, CardNetwork, CardSort } from '@/lib/api';
import posthog from 'posthog-js';

const SORT_KEYS: CardSort[] = ['fee_asc', 'fee_desc'];

interface Props {
  banks: Bank[];
  types: CardType[];
  networks: CardNetwork[];
}

export function CardsFilter({ banks, types, networks }: Props) {
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
    router.push(`/cards?${params.toString()}`);
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
    router.push(`/cards?${params.toString()}`);
    posthog.capture('catalog_filter_applied', {
      filter_key: 'co_brand',
      filter_value: isEnabling ? '1' : null,
    });
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
      <Select value={searchParams.get('type') ?? 'all'} onValueChange={(v) => update('type', v)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder={t('all_types')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all_types')}</SelectItem>
          {types.map((key) => (
            <SelectItem key={key} value={key}>{t(`type_${key}`)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

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

      <Select value={searchParams.get('sort') ?? 'default'} onValueChange={(v) => update('sort', v)}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder={t('default_order')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">{t('default_order')}</SelectItem>
          {SORT_KEYS.map((key) => (
            <SelectItem key={key} value={key}>{t(key)}</SelectItem>
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
        {t('co_branded')}
      </button>

      {hasFilter && (
        <button
          onClick={() => router.push('/cards')}
          className="h-9 px-3 text-base text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2"
        >
          {t('reset')}
        </button>
      )}
    </div>
  );
}
