export function colSpan(total: number, i: number): string {
    if (total === 1) return 'col-span-12';
    if (total === 2) return 'col-span-6';
    if (i === 2) return 'col-span-4 max-sm:col-span-6 max-sm:hidden';
    return 'col-span-4 max-sm:col-span-6';
}
