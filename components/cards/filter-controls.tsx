'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { IconChevronDown } from '@tabler/icons-react';
import { getBankImageUrl, getBrandImageUrl, getNetworkImageUrl, getWalletImageUrl } from '@/lib/api';

// ── FilterChip ────────────────────────────────────────────────────────────────

export interface FilterChipProps {
  label: string;
  logoUrl?: string;
  onRemove: () => void;
}

export function FilterChip({ label, logoUrl, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
      {logoUrl && <img src={logoUrl} alt="" className="w-auto h-[14px] object-contain shrink-0" />}
      {label}
      <button onClick={onRemove} className="hover:text-slate-900 leading-none ml-0.5">×</button>
    </span>
  );
}

// ── TypeSelect ────────────────────────────────────────────────────────────────

export interface TypeSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function TypeSelect({ value, onChange }: TypeSelectProps) {
  const t = useTranslations('CardsFilter');
  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder={t('all_types')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all_types')}</SelectItem>
        <SelectItem value="credit">{t('type_credit')}</SelectItem>
        <SelectItem value="debit">{t('type_debit')}</SelectItem>
        <SelectItem value="prepaid">{t('type_prepaid')}</SelectItem>
        <SelectItem value="2in1">2-in-1</SelectItem>
      </SelectContent>
    </Select>
  );
}

// ── NetworkSelect ─────────────────────────────────────────────────────────────

export interface NetworkSelectProps {
  value: string | null;
  networks: Array<{ id: string; name: string; logo_url: string }>;
  onChange: (value: string) => void;
}

export function NetworkSelect({ value, networks, onChange }: NetworkSelectProps) {
  const t = useTranslations('CardsFilter');
  const selected = value ? networks.find((n) => n.id === value) : null;

  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue>
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.logo_url && <img src={getNetworkImageUrl(selected.logo_url)} alt="" className="w-auto h-[20px] object-contain shrink-0" />}
              <span>{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{t('all_networks')}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all_networks')}</SelectItem>
        {networks.map((n) => (
          <SelectItem key={n.id} value={n.id}>
            <span className="flex items-center gap-2">
              {n.logo_url && <img src={getNetworkImageUrl(n.logo_url)} alt="" className="w-[50px] h-[20px] object-contain object-left shrink-0" />}
              <span>{n.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── BankCombobox ──────────────────────────────────────────────────────────────

export interface BankComboboxProps {
  value: string | null;
  banks: Array<{ id: string; name: string; logo_url: string }>;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  allLabel: string;
}

export function BankCombobox({ value, banks, onChange, placeholder, searchPlaceholder, allLabel }: BankComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? banks.find((b) => b.id === value) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex h-9 w-52 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
          <span className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            {selected ? (
              <span className="flex items-center gap-2">
                {selected.logo_url && <img src={getBankImageUrl(selected.logo_url)} alt="" className="w-auto h-[20px] object-contain shrink-0" />}
                <span className="truncate">{selected.name}</span>
              </span>
            ) : (
              <span className="text-muted-foreground truncate">{placeholder}</span>
            )}
          </span>
          <IconChevronDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>Not found</CommandEmpty>
            <CommandGroup className="max-h-72 overflow-auto">
              <CommandItem value="__all__" onSelect={() => { onChange('all'); setOpen(false); }}>
                {allLabel}
              </CommandItem>
              {banks.map((b) => (
                <CommandItem
                  key={b.id}
                  value={b.name}
                  onSelect={() => { onChange(b.id); setOpen(false); }}
                >
                  <span className="flex items-center gap-2">
                    {b.logo_url && <img src={getBankImageUrl(b.logo_url)} alt="" className="w-[50px] h-[20px] object-contain object-left shrink-0" />}
                    <span>{b.name}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ── CoBrandSelect ─────────────────────────────────────────────────────────────

export interface CoBrandSelectProps {
  value: string | null;
  brands: Array<{ id: string; name: string; logo_url: string }>;
  onChange: (value: string) => void;
}

export function CoBrandSelect({ value, brands, onChange }: CoBrandSelectProps) {
  const t = useTranslations('CardsFilter');
  const selected = value ? brands.find((b) => b.id === value) : null;

  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-44">
        <SelectValue>
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.logo_url && <img src={getBrandImageUrl(selected.logo_url)} alt="" className="w-auto h-[20px] object-contain shrink-0" />}
              <span>{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{t('co_branded')}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all_brands')}</SelectItem>
        {brands.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            <span className="flex items-center gap-2">
              {b.logo_url && <img src={getBrandImageUrl(b.logo_url)} alt="" className="w-[50px] h-[20px] object-contain object-left shrink-0" />}
              <span>{b.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── WalletSelect ──────────────────────────────────────────────────────────────

export interface WalletSelectProps {
  value: string | null;
  wallets: Array<{ id: string; name: string; logo_url: string }>;
  onChange: (value: string) => void;
}

export function WalletSelect({ value, wallets, onChange }: WalletSelectProps) {
  const t = useTranslations('CardsFilter');
  const selected = value ? wallets.find((w) => w.id === value) : null;

  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue>
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.logo_url && <img src={getWalletImageUrl(selected.logo_url)} alt="" className="w-auto h-[20px] object-contain shrink-0" />}
              <span>{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{t('all_wallets')}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all_wallets')}</SelectItem>
        {wallets.map((w) => (
          <SelectItem key={w.id} value={w.id}>
            <span className="flex items-center gap-2">
              {w.logo_url && <img src={getWalletImageUrl(w.logo_url)} alt="" className="w-[50px] h-[20px] object-contain object-left shrink-0" />}
              <span>{w.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── FeeSelect ─────────────────────────────────────────────────────────────────

export interface FeeSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function FeeSelect({ value, onChange }: FeeSelectProps) {
  const t = useTranslations('CardsFilter');
  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder={t('all_fees')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all_fees')}</SelectItem>
        <SelectItem value="free">{t('fee_free')}</SelectItem>
        <SelectItem value="paid">{t('fee_paid')}</SelectItem>
      </SelectContent>
    </Select>
  );
}

// ── SortSelect ────────────────────────────────────────────────────────────────

export interface SortSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const t = useTranslations('CardsFilter');
  return (
    <Select value={value ?? 'default'} onValueChange={onChange}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder={t('default_order')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">{t('default_order')}</SelectItem>
        <SelectItem value="fee_asc">{t('sort_fee_asc')}</SelectItem>
        <SelectItem value="fee_desc">{t('sort_fee_desc')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
