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

  // Card types - longer phrases first
  ['thẻ 2 trong 1', '/the-2-trong-1'],
  ['thẻ tín dụng', '/the-tin-dung'],
  ['thẻ ghi nợ', '/the-ghi-no'],
  ['thẻ ATM nội địa', '/the-ghi-no-noi-dia'],

  // Banks - longer/more specific names first
  ['Vietcombank', '/ngan-hang/vietcombank'],
  ['VietinBank', '/ngan-hang/vietinbank'],
  ['Techcombank', '/ngan-hang/techcombank'],
  ['Sacombank', '/ngan-hang/sacombank'],
  ['MB Bank', '/ngan-hang/mb'],
  ['VPBank', '/ngan-hang/vpbank'],
  ['Agribank', '/ngan-hang/agribank'],
  ['Eximbank', '/ngan-hang/eximbank'],
  ['LPBank', '/ngan-hang/lpbank'],
  ['SeABank', '/ngan-hang/seabank'],
  ['OCB', '/ngan-hang/ocb'],
  ['MSB', '/ngan-hang/msb'],
  ['SHB', '/ngan-hang/shb'],
  ['VIB', '/ngan-hang/vib'],
  ['ACB', '/ngan-hang/acb'],
  ['BIDV', '/ngan-hang/bidv'],
  ['HSBC', '/ngan-hang/hsbc'],
  ['UOB', '/ngan-hang/uob'],
];
