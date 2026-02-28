'use client';

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
  ContactlessSelect,
  TierSelect,
  FeeSelect,
  SortSelect,
  FilterChip,
} from './filter-controls';

interface FilterValues {
  type: string | null;
  network: string | null;
  bankId: string | null;
  coBrand: string | null;
  sort: string;
  contactless: string | null;
  fee: string | null;
  tier: string | null;
}

interface Props {
  banks: Bank[];
  hideTypeFilter?: boolean;
  hideNetworkFilter?: boolean;
  hideBankFilter?: boolean;
  hideCoBrandFilter?: boolean;
  hideContactlessFilter?: boolean;
  hideTierFilter?: boolean;
  hideFeeFilter?: boolean;
  hideSortFilter?: boolean;
  typeFilterUseful: boolean;
  networkFilterUseful: boolean;
  bankFilterUseful: boolean;
  contactlessFilterUseful: boolean;
  tierFilterUseful: boolean;
  feeFilterUseful: boolean;
  sortFilterUseful: boolean;
  coBrandFilterUseful: boolean;
  availableNetworks: Array<{ id: string; name: string; logo_url: string }>;
  availableBrands: Array<{ id: string; name: string; logo_url: string }>;
  availableContactless: Array<{ id: string; name: string; logo_url: string }>;
  availableTiers: Array<{ id: string; rank: number; logo_url: string }>;
  filterValues: FilterValues;
  onUpdate: (key: string, value: string) => void;
  onClearAll: () => void;
  isPending?: boolean;
}

export function CardsFilter({
  banks,
  hideTypeFilter,
  hideNetworkFilter,
  hideBankFilter,
  hideCoBrandFilter,
  hideContactlessFilter,
  hideTierFilter,
  hideFeeFilter,
  hideSortFilter,
  typeFilterUseful,
  networkFilterUseful,
  bankFilterUseful,
  contactlessFilterUseful,
  tierFilterUseful,
  feeFilterUseful,
  sortFilterUseful,
  coBrandFilterUseful,
  availableNetworks,
  availableBrands,
  availableContactless,
  availableTiers,
  filterValues,
  onUpdate,
  onClearAll,
  isPending,
}: Props) {
  const t = useTranslations('CardsFilter');

  function update(key: string, value: string) {
    onUpdate(key, value);
    posthog.capture('catalog_filter_applied', {
      filter_key: key,
      filter_value: value === 'all' || value === 'default' ? null : value,
    });
  }

  function clearAll() {
    onClearAll();
    posthog.capture('catalog_filter_cleared');
  }

  const { type: activeType, network: activeNetwork, bankId: activeBankId, coBrand, sort: sortValue, contactless, fee, tier: activeTier } = filterValues;

  const hasFilter = !!(
    activeType ||
    activeNetwork ||
    activeBankId ||
    coBrand ||
    sortValue !== 'default' ||
    contactless ||
    fee ||
    activeTier
  );

  // Chip lookup data
  const networkChipData = activeNetwork ? availableNetworks.find((n) => n.id === activeNetwork) : null;
  const bankChipData = activeBankId ? banks.find((b) => b.id === activeBankId) : null;
  const brandChipData = coBrand ? availableBrands.find((b) => b.id === coBrand) : null;
  const contactlessChipData = contactless ? availableContactless.find((w) => w.id === contactless) : null;

  return (
    <div className={`space-y-3 transition-opacity${isPending ? ' opacity-60 pointer-events-none' : ''}`}>
      {/* Filter controls */}
      <div className="flex gap-2 flex-wrap items-center">
        {!hideTypeFilter && typeFilterUseful && (
          <TypeSelect value={activeType} onChange={(v) => update('type', v)} />
        )}

        {!hideNetworkFilter && networkFilterUseful && (
          <NetworkSelect
            value={activeNetwork}
            networks={availableNetworks}
            onChange={(v) => update('network', v)}
          />
        )}

        {!hideBankFilter && bankFilterUseful && (
          <BankCombobox
            value={activeBankId}
            banks={banks}
            onChange={(v) => update('bank', v)}
            placeholder={t('all_banks')}
            searchPlaceholder={t('search_bank')}
            allLabel={t('all_banks')}
          />
        )}

        {!hideCoBrandFilter && coBrandFilterUseful && (
          <CoBrandSelect
            value={coBrand}
            brands={availableBrands}
            onChange={(v) => update('co_brand', v)}
          />
        )}

        {!hideContactlessFilter && contactlessFilterUseful && (
          <ContactlessSelect
            value={contactless}
            contactless={availableContactless}
            onChange={(v) => update('contactless', v)}
          />
        )}

        {!hideTierFilter && tierFilterUseful && (
          <TierSelect
            value={activeTier}
            tiers={availableTiers}
            onChange={(v) => update('tier', v)}
          />
        )}

        {!hideFeeFilter && feeFilterUseful && (
          <FeeSelect value={fee} onChange={(v) => update('fee', v)} />
        )}

        {!hideSortFilter && sortFilterUseful && (
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
          {contactless && (
            <FilterChip
              label={contactlessChipData?.name ?? contactless}
              logoUrl={contactlessChipData?.logo_url ? getWalletImageUrl(contactlessChipData.logo_url) : undefined}
              onRemove={() => update('contactless', 'all')}
            />
          )}
          {activeTier && (
            <FilterChip
              label={activeTier.charAt(0).toUpperCase() + activeTier.slice(1)}
              onRemove={() => update('tier', 'all')}
            />
          )}
          {fee && (
            <FilterChip
              label={fee === 'free' ? t('fee_free') : fee === 'unknown' ? t('fee_unknown') : (FEE_BUCKETS.find((b) => b.value === fee)?.label ?? fee)}
              onRemove={() => update('fee', 'all')}
            />
          )}
          {sortValue !== 'default' && (
            <FilterChip
              label={sortValue === 'fee_asc' ? t('sort_fee_asc') : sortValue === 'fee_desc' ? t('sort_fee_desc') : t('sort_tier_asc')}
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
