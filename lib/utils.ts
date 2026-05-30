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
