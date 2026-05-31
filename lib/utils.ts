import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FeeEntry } from "@/lib/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFee(entry: FeeEntry): string {
  if (entry.amount === 0) return 'Miễn phí';
  if (entry.type === 'currency') return `${entry.amount.toLocaleString('vi-VN')}đ`;
  return `${entry.amount.toFixed(2)}%`;
}

export function formatFeeParts(entry: FeeEntry): { value: string; unit: string | null } {
  if (entry.amount === 0) return { value: 'Miễn phí', unit: null };
  if (entry.type === 'currency') return { value: entry.amount.toLocaleString('vi-VN'), unit: 'đ' };
  return { value: entry.amount.toFixed(2), unit: '%' };
}

export function formatFeePartsCompact(entry: FeeEntry): { value: string; unit: string | null } {
  if (entry.amount === 0) return { value: 'Miễn phí', unit: null };
  if (entry.type === 'rate') return { value: entry.amount.toFixed(2), unit: '%' };
  const n = entry.amount;
  if (n >= 1_000_000 && n % 1_000_000 === 0) return { value: `${n / 1_000_000}tr`, unit: null };
  if (n >= 1_000_000) return { value: `${(n / 1_000_000).toFixed(1).replace('.0', '')}tr`, unit: null };
  if (n >= 1_000 && n % 1_000 === 0) return { value: `${n / 1_000}k`, unit: null };
  return { value: n.toLocaleString('vi-VN'), unit: 'đ' };
}
