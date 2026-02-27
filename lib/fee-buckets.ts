export const FEE_BUCKETS = [
  { value: 'under_200k', min: 1,       max: 200000,  label: 'Dưới 200.000đ',   labelEn: 'Under 200,000đ' },
  { value: 'under_500k', min: 1,       max: 500000,  label: 'Dưới 500.000đ',   labelEn: 'Under 500,000đ' },
  { value: 'under_2tr',  min: 1,       max: 2000000, label: 'Dưới 2.000.000đ', labelEn: 'Under 2,000,000đ' },
  { value: 'above_2tr',  min: 2000001, max: null,    label: 'Trên 2.000.000đ', labelEn: 'Above 2,000,000đ' },
] as const;

export type FeeBucketValue = typeof FEE_BUCKETS[number]['value'];

export function getFeeBucket(fee: number) {
  // Try upper-bound buckets first (exclude above_2tr), snap to closest
  const upperBound = FEE_BUCKETS.filter((b) => b.max !== null).find((b) => fee >= b.min && fee <= b.max!);
  if (upperBound) return upperBound;
  // Fall back to open-ended bucket
  return FEE_BUCKETS.find((b) => b.max === null && fee >= b.min) ?? null;
}
