/**
 * Keyword → internal URL map for auto-linking in blog posts.
 *
 * Rules:
 * - Only first occurrence of each keyword per post is linked.
 * - Longer phrases must come first so they match before shorter substrings
 *   (e.g. "thẻ tín dụng" before "thẻ").
 * - Keywords are matched case-sensitively as written here.
 */
export const AUTO_LINKS: [keyword: string, url: string][] = [
  // Card networks
  ['American Express', '/the-tin-dung-amex'],
  ['Mastercard', '/the-tin-dung-mastercard'],
  ['UnionPay', '/the-tin-dung'],
  ['NAPAS', '/the-tin-dung-noi-dia'],
  ['Visa', '/the-tin-dung-visa'],
  ['JCB', '/the-tin-dung-jcb'],

  // Card types — longer phrases first
  ['thẻ 2 trong 1', '/the-2-trong-1'],
  ['thẻ tín dụng', '/the-tin-dung'],
  ['thẻ ghi nợ', '/the-ghi-no'],
  ['thẻ ATM nội địa', '/the-ghi-no-noi-dia'],
];
