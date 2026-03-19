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
