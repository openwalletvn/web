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
  ['American Express', '/cards/amex'],
  ['Mastercard', '/cards/mastercard'],
  ['UnionPay', '/cards/unionpay'],
  ['NAPAS', '/cards/napas'],
  ['Visa', '/cards/visa'],
  ['JCB', '/cards/jcb'],

  // Card types — longer phrases first
  ['thẻ 2 trong 1', '/cards/2in1'],
  ['thẻ tín dụng', '/cards/credit'],
  ['thẻ ghi nợ', '/cards/debit'],
  ['thẻ ATM nội địa', '/cards/debit'],
];
