'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Bank } from '@/lib/api';
import { getBankImageUrl, getBrandImageUrl, getNetworkImageUrl, getWalletImageUrl } from '@/lib/api';
import { FEE_BUCKETS } from '@/lib/fee-buckets';
import posthog from 'posthog-js';
import {
  TypeSelect,
  NetworkSelect,
  BankCombobox,
  CoBrandSelect,
  WalletSelect,
  FeeSelect,
  SortSelect,
  FilterChip,
} from './filter-controls';

interface Props {
  banks: Bank[];
  enabledFilters: Array<'type' | 'network' | 'bank' | 'sort' | 'wallet' | 'fee' | 'co_brand'>;
  typeFilterUseful: boolean;
  networkFilterUseful: boolean;
  bankFilterUseful: boolean;
  walletFilterUseful: boolean;
  feeFilterUseful: boolean;
  sortFilterUseful: boolean;
  coBrandFilterUseful: boolean;
  availableNetworks: Array<{ id: string; name: string; logo_url: string }>;
  availableBrands: Array<{ id: string; name: string; logo_url: string }>;
  availableWallets: Array<{ id: string; name: string; logo_url: string }>;
  wallet: string | null;
  fee: string | null;
  coBrand: string | null;
}

export function CardsFilter({
  banks,
  enabledFilters,
  typeFilterUseful,
  networkFilterUseful,
  bankFilterUseful,
  walletFilterUseful,
  feeFilterUseful,
  sortFilterUseful,
  coBrandFilterUseful,
  availableNetworks,
  availableBrands,
  availableWallets,
  wallet,
  fee,
  coBrand,
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

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    ['type', 'network', 'bank', 'co_brand', 'sort', 'wallet', 'fee'].forEach((k) => params.delete(k));
    router.push(`/the?${params.toString()}`);
    posthog.capture('catalog_filter_cleared');
  }

  const sortValue = searchParams.get('sort') ?? 'default';
  const activeType = searchParams.get('type');
  const activeNetwork = searchParams.get('network');
  const activeBankId = searchParams.get('bank');

  const hasFilter = !!(
    activeType ||
    activeNetwork ||
    activeBankId ||
    coBrand ||
    sortValue !== 'default' ||
    wallet ||
    fee
  );

  // Chip lookup data
  const networkChipData = activeNetwork ? availableNetworks.find((n) => n.id === activeNetwork) : null;
  const bankChipData = activeBankId ? banks.find((b) => b.id === activeBankId) : null;
  const brandChipData = coBrand ? availableBrands.find((b) => b.id === coBrand) : null;
  const walletChipData = wallet ? availableWallets.find((w) => w.id === wallet) : null;

  return (
    <div className="space-y-3">
      {/* Filter controls */}
      <div className="flex gap-2 flex-wrap items-center">
        {enabledFilters.includes('type') && typeFilterUseful && (
          <TypeSelect value={activeType} onChange={(v) => update('type', v)} />
        )}

        {enabledFilters.includes('network') && networkFilterUseful && (
          <NetworkSelect
            value={activeNetwork}
            networks={availableNetworks}
            onChange={(v) => update('network', v)}
          />
        )}

        {enabledFilters.includes('bank') && bankFilterUseful && (
          <BankCombobox
            value={activeBankId}
            banks={banks}
            onChange={(v) => update('bank', v)}
            placeholder={t('all_banks')}
            searchPlaceholder={t('search_bank')}
            allLabel={t('all_banks')}
          />
        )}

        {enabledFilters.includes('co_brand') && coBrandFilterUseful && (
          <CoBrandSelect
            value={coBrand}
            brands={availableBrands}
            onChange={(v) => update('co_brand', v)}
          />
        )}

        {enabledFilters.includes('wallet') && walletFilterUseful && (
          <WalletSelect
            value={wallet}
            wallets={availableWallets}
            onChange={(v) => update('wallet', v)}
          />
        )}

        {enabledFilters.includes('fee') && feeFilterUseful && (
          <FeeSelect value={fee} onChange={(v) => update('fee', v)} />
        )}

        {enabledFilters.includes('sort') && sortFilterUseful && (
          <SortSelect value={sortValue} onChange={(v) => update('sort', v)} />
        )}
      </div>

      {/* Active filter chips */}
      {hasFilter && (
        <div className="flex gap-2 flex-wrap items-center">
          {activeType && (
            <FilterChip
              label={t(`type_${activeType}`)}
              onRemove={() => update('type', 'all')}
            />
          )}
          {activeNetwork && (
            <FilterChip
              label={networkChipData?.name ?? t(`network_${activeNetwork}`)}
              logoUrl={networkChipData?.logo_url ? getNetworkImageUrl(networkChipData.logo_url) : undefined}
              onRemove={() => update('network', 'all')}
            />
          )}
          {activeBankId && (
            <FilterChip
              label={bankChipData?.name ?? activeBankId}
              logoUrl={bankChipData?.logo_url ? getBankImageUrl(bankChipData.logo_url) : undefined}
              onRemove={() => update('bank', 'all')}
            />
          )}
          {coBrand && (
            <FilterChip
              label={brandChipData?.name ?? coBrand}
              logoUrl={brandChipData?.logo_url ? getBrandImageUrl(brandChipData.logo_url) : undefined}
              onRemove={() => update('co_brand', 'all')}
            />
          )}
          {wallet && (
            <FilterChip
              label={walletChipData?.name ?? wallet}
              logoUrl={walletChipData?.logo_url ? getWalletImageUrl(walletChipData.logo_url) : undefined}
              onRemove={() => update('wallet', 'all')}
            />
          )}
          {fee && (
            <FilterChip
              label={fee === 'free' ? t('fee_free') : (FEE_BUCKETS.find((b) => b.value === fee)?.label ?? fee)}
              onRemove={() => update('fee', 'all')}
            />
          )}
          {sortValue !== 'default' && (
            <FilterChip
              label={sortValue === 'fee_asc' ? t('sort_fee_asc') : t('sort_fee_desc')}
              onRemove={() => update('sort', 'default')}
            />
          )}
          <button
            onClick={clearAll}
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            {t('clear_all')}
          </button>
        </div>
      )}
    </div>
  );
}
