export interface CardCategory {
    slug: string;
    name: string;
    href: string;
    description: string;
    group: 'daily' | 'digital' | 'business';
    theme?: 'primary' | 'black';
}

export const CARD_CATEGORIES: CardCategory[] = [
    {slug: 'shopee', name: 'Thẻ Shopee', href: '/the-shopee', description: 'Thẻ ưu đãi Shopee', group: 'daily'},
    {slug: 'groceries', name: 'Thẻ Siêu thị', href: '/the-sieu-thi', description: 'Coopmart, Go, Lotte, AEON,...', group: 'daily'},
    {slug: 'education', name: 'Thẻ Giáo dục', href: '/the-danh-cho-giao-duc', description: 'Chi tiêu giáo dục, trường học', group: 'daily'},
    {slug: 'health', name: 'Thẻ Y tế', href: '/the-danh-cho-y-te', description: 'Chi tiêu y tế, bệnh viện', group: 'daily'},
    {slug: 'insurance', name: 'Thẻ Bảo hiểm', href: '/the-danh-cho-bao-hiem', description: 'Chi tiêu bảo hiểm nhân thọ', group: 'daily'},
    {slug: 'digital', name: 'Dịch vụ số', href: '/the-chi-tieu-dich-vu-so', description: 'AI, Netflix, Spotify,...', group: 'digital', theme: 'primary'},
    {slug: 'business', name: 'Thẻ doanh nghiệp', href: '/the-doanh-nghiep', description: 'Thẻ cho doanh nghiệp', group: 'business', theme: 'black'},
];
