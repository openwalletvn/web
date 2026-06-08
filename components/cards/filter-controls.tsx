'use client';

import { useState } from 'react';
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
import { FEE_BUCKETS } from '@/lib/fee-buckets';
import { SelectSeparator } from '@/components/ui/select';

// ── FilterChip ────────────────────────────────────────────────────────────────

export interface FilterChipProps {
  label: string;
  logoUrl?: string;
  onRemove: () => void;
}

export function FilterChip({ label, logoUrl, onRemove }: FilterChipProps) {
  return (
    <span className="ow-filter-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
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
  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder='Tất cả loại' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả loại</SelectItem>
        <SelectItem value="credit">Tín dụng</SelectItem>
        <SelectItem value="debit">Ghi nợ</SelectItem>
        <SelectItem value="prepaid">Trả trước</SelectItem>
        <SelectItem value="hybrid">Hybrid</SelectItem>
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
            <span className="text-muted-foreground">Tất cả mạng</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả mạng</SelectItem>
        {networks.map((n) => (
          <SelectItem key={n.id} value={n.id}>
            <span className="flex items-center gap-2">
              {n.logo_url && <img src={getNetworkImageUrl(n.logo_url)} alt="" className="w-[50px] h-[20px] object-contain object-center shrink-0" />}
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
        <button className="flex h-9 w-52 items-center gap-2 rounded-2xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
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
                    {b.logo_url && <img src={getBankImageUrl(b.logo_url)} alt="" className="w-[50px] h-[20px] object-contain object-center shrink-0" />}
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
            <span className="text-muted-foreground">Thẻ đồng thương hiệu</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả co-brand</SelectItem>
        {brands.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            <span className="flex items-center gap-2">
              {b.logo_url && <img src={getBrandImageUrl(b.logo_url)} alt="" className="w-[50px] h-[20px] object-contain object-center shrink-0" />}
              <span>{b.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── ContactlessSelect ──────────────────────────────────────────────────────────────

export interface ContactlessSelectProps {
  value: string | null;
  contactless: Array<{ id: string; name: string; logo_url: string }>;
  onChange: (value: string) => void;
}

export function ContactlessSelect({ value, contactless, onChange }: ContactlessSelectProps) {
  const selected = value ? contactless.find((w) => w.id === value) : null;

  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-60">
        <SelectValue>
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.logo_url && <img src={getWalletImageUrl(selected.logo_url)} alt="" className="w-auto h-[20px] object-contain shrink-0" />}
              <span>{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Tất cả phương thức thanh toán</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả phương thức thanh toán</SelectItem>
        {contactless.map((w) => (
          <SelectItem key={w.id} value={w.id}>
            <span className="flex items-center gap-2">
              {w.logo_url && <img src={getWalletImageUrl(w.logo_url)} alt="" className="w-[50px] h-[20px] object-contain object-center shrink-0" />}
              <span>{w.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── TierSelect ────────────────────────────────────────────────────────────────

export interface TierSelectProps {
  value: string | null;
  tiers: Array<{ id: string; rank: number; logo_url: string }>;
  onChange: (value: string) => void;
}

export function TierSelect({ value, tiers, onChange }: TierSelectProps) {
  const selected = value ? tiers.find((t) => t.id === value) : null;

  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-36">
        <SelectValue>
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.logo_url && <img src={getNetworkImageUrl(selected.logo_url)} alt="" className="w-auto h-[20px] object-contain shrink-0" />}
              <span>{selected.id.charAt(0).toUpperCase() + selected.id.slice(1)}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Tất cả hạng</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả hạng</SelectItem>
        {tiers.map((tier) => (
          <SelectItem key={tier.id} value={tier.id}>
            <span className="flex items-center gap-2">
              {tier.logo_url && <img src={getNetworkImageUrl(tier.logo_url)} alt="" className="w-[50px] h-[20px] object-contain object-center shrink-0" />}
              <span>{tier.id.charAt(0).toUpperCase() + tier.id.slice(1)}</span>
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
  return (
    <Select value={value ?? 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder='Tất cả phí' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả phí</SelectItem>
        <SelectItem value="free">Miễn phí</SelectItem>
        <SelectItem value="unknown">Không rõ phí</SelectItem>
        <SelectSeparator />
        {FEE_BUCKETS.map((b) => (
          <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
        ))}
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
  return (
    <Select value={value ?? 'default'} onValueChange={onChange}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder='Thứ tự mặc định' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Thứ tự mặc định</SelectItem>
        <SelectItem value="fee_asc">Phí thường niên ↑</SelectItem>
        <SelectItem value="fee_desc">Phí thường niên ↓</SelectItem>
        <SelectItem value="tier_asc">Hạng thẻ (cao → thấp)</SelectItem>
      </SelectContent>
    </Select>
  );
}
