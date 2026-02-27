export const FEE_BUCKETS = [
  { value: 'under_500k', max: 500000,   label: 'Dưới 500.000đ',   labelEn: 'Under 500,000đ' },
  { value: 'under_1tr',  max: 1000000,  label: 'Dưới 1.000.000đ', labelEn: 'Under 1,000,000đ' },
  { value: 'under_2tr',  max: 2000000,  label: 'Dưới 2.000.000đ', labelEn: 'Under 2,000,000đ' },
  { value: 'under_5tr',  max: 5000000,  label: 'Dưới 5.000.000đ', labelEn: 'Under 5,000,000đ' },
] as const;

export type FeeBucketValue = typeof FEE_BUCKETS[number]['value'];

export function getFeeBucket(fee: number) {
  return FEE_BUCKETS.find((b) => fee <= b.max) ?? null;
}
