import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtIsoDate(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

export function fmtIsoDateLong(iso: string): string {
    return new Date(iso).toLocaleDateString('vi-VN', {day: 'numeric', month: 'long', year: 'numeric'});
}

export function fmtIsoDateLifespan(from: string, until: string): string {
    const [fy, fm, fd] = from.split('-').map(Number);
    const [uy, um, ud] = until.split('-').map(Number);
    let months = (uy - fy) * 12 + (um - fm) + (ud >= fd ? 0 : -1);
    const years = Math.floor(months / 12);
    months = months % 12;
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} năm`);
    if (months > 0) parts.push(`${months} tháng`);
    return parts.length ? ` · ${parts.join(' ')}` : '';
}

export function hexToRgba(hex: string, alpha: number): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}