import type { Metadata } from 'next';
import Link from 'next/link';
import { buildBreadcrumbJsonLd } from '@/lib/page-meta/breadcrumb';

export const metadata: Metadata = {
    title: 'Wallet Chat | Hỏi đáp thẻ ngân hàng bằng AI',
    description: 'Wallet Chat là trợ lý AI giúp bạn tìm và so sánh thẻ ngân hàng Việt Nam. Không cần tài khoản, dữ liệu lưu trên thiết bị của bạn, hoàn toàn riêng tư.',
    openGraph: {
        title: 'Wallet Chat',
        description: 'Trợ lý AI hỏi đáp thẻ ngân hàng Việt Nam. Không tài khoản, không lưu trữ server.',
        url: 'https://openwallet.vn/wallet-chat',
    },
};

const FEATURES = [
    {
        title: 'Local-first, không cần tài khoản',
        desc: 'Toàn bộ lịch sử trò chuyện và dữ liệu cá nhân được lưu trên thiết bị của bạn qua IndexedDB. Không có tài khoản, không có server lưu trữ thông tin của bạn.',
    },
    {
        title: 'Dữ liệu thẻ chính xác, cập nhật',
        desc: 'Wallet Chat kết nối trực tiếp với cơ sở dữ liệu OpenWallet để trả lời câu hỏi dựa trên thông tin thực tế về phí, ưu đãi và điều kiện của từng thẻ.',
    },
    {
        title: 'Hỏi tự nhiên, nhận gợi ý cụ thể',
        desc: 'Bạn không cần biết tên thẻ cụ thể. Chỉ cần mô tả thói quen chi tiêu: "Tôi hay mua sắm online và đi cafe, thẻ nào phù hợp?" và nhận câu trả lời có dẫn chứng.',
    },
];

export default function WalletChatPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'SoftwareApplication',
                name: 'Wallet Chat',
                url: 'https://openwallet.vn/wallet-chat',
                description: 'Trợ lý AI hỏi đáp và gợi ý thẻ ngân hàng Việt Nam. Dữ liệu lưu cục bộ, không cần tài khoản.',
                applicationCategory: 'FinanceApplication',
                operatingSystem: 'All',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'VND',
                },
            },
            buildBreadcrumbJsonLd([
                { label: 'Trang chủ', href: '/' },
                { label: 'Wallet Chat', href: '/wallet-chat' },
            ]),
        ],
    };

    return (
        <div className="ow-wallet-chat-page">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <section className="border-b border-dashed border-border py-16">
                <div className="ow-container max-w-3xl">
                    <p className="text-sm font-mono text-muted-foreground mb-3">AI Assistant</p>
                    <h1 className="text-display-lg font-bold mb-4">Wallet Chat</h1>
                    <p className="text-body text-slate-600 mb-8">
                        Trợ lý AI giúp bạn tìm và so sánh thẻ ngân hàng Việt Nam qua hội thoại tự nhiên. Không cần tài khoản, không lưu dữ liệu lên server, hoàn toàn riêng tư trên thiết bị của bạn.
                    </p>
                    <Link
                        href="/chat"
                        className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        Mở Wallet Chat
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="border-b border-dashed border-border py-12">
                <div className="ow-container max-w-3xl">
                    <h2 className="text-display-sm font-semibold mb-6">Tại sao dùng Wallet Chat?</h2>
                    <div className="flex flex-col gap-6">
                        {FEATURES.map(f => (
                            <div key={f.title} className="flex flex-col gap-2">
                                <h3 className="text-sm font-semibold">{f.title}</h3>
                                <p className="text-body text-slate-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example prompts */}
            <section className="border-b border-dashed border-border py-12">
                <div className="ow-container max-w-3xl">
                    <h2 className="text-display-sm font-semibold mb-6">Bạn có thể hỏi những gì?</h2>
                    <div className="grid gap-3">
                        {[
                            'Thẻ nào hoàn tiền tốt nhất cho mua sắm tại siêu thị?',
                            'So sánh Vietcombank Cashback với MB JCB Sakura.',
                            'Tôi chi 5 triệu/tháng cho ăn uống và cafe, thẻ nào phù hợp?',
                            'Techcombank có thẻ nào miễn phí thường niên không?',
                            'Thẻ nào tốt nhất để dùng ở nước ngoài?',
                        ].map(q => (
                            <div key={q} className="px-4 py-3 bg-muted rounded-lg text-sm text-slate-600 font-mono">
                                &ldquo;{q}&rdquo;
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12">
                <div className="ow-container max-w-3xl">
                    <h2 className="text-display-sm font-semibold mb-4">Thử ngay, không cần đăng ký</h2>
                    <p className="text-body text-slate-600 mb-6">
                        Wallet Chat hoạt động ngay trong trình duyệt. Không cần tạo tài khoản, không cần cài ứng dụng. Lịch sử trò chuyện được lưu trên thiết bị của bạn.
                    </p>
                    <Link
                        href="/chat"
                        className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        Mở Wallet Chat
                    </Link>
                </div>
            </section>
        </div>
    );
}
