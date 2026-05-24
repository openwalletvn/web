import type { Metadata } from 'next';
import Link from 'next/link';
import { buildBreadcrumbJsonLd } from '@/lib/page-meta/breadcrumb';
import { getTool } from '@/lib/tools';
import { ProsePageShell } from '@/components/layout/prose-page-shell';

const BASE_URL = 'https://openwallet.vn';
const tool = getTool('Wallet Chat');

export const metadata: Metadata = {
    title: 'Wallet Chat | Trợ lý AI thẻ ngân hàng (Beta)',
    description: 'Wallet Chat là trợ lý AI giúp bạn tìm và so sánh thẻ ngân hàng Việt Nam. Hiện đang trong giai đoạn beta, chưa mở rộng công khai.',
    openGraph: {
        title: 'Wallet Chat',
        description: 'Trợ lý AI hỏi đáp thẻ ngân hàng Việt Nam. Đang trong giai đoạn beta.',
        url: `${BASE_URL}${tool.href}`,
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-display-md">{title}</h2>
            <div className="flex flex-col gap-3 text-body text-slate-700">
                {children}
            </div>
        </section>
    );
}

export default function WalletChatPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'SoftwareApplication',
                name: 'Wallet Chat',
                url: `${BASE_URL}${tool.href}`,
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
                { label: 'Wallet Chat', href: tool.href },
            ]),
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProsePageShell
                title="Wallet Chat"
                subtitle="Trợ lý AI giúp bạn tìm và so sánh thẻ ngân hàng Việt Nam qua hội thoại tự nhiên. Hiện đang trong giai đoạn beta, chưa mở rộng công khai."
            >
                <div className="flex flex-col gap-10">
                    <section>
                        <Link
                            href="/lien-he"
                            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                        >
                            Yêu cầu truy cập beta
                        </Link>
                    </section>

                    <Section title="Tại sao dùng Wallet Chat?">
                        <div className="flex flex-col gap-6">
                            {FEATURES.map(f => (
                                <div key={f.title} className="flex flex-col gap-2">
                                    <p className="text-body font-semibold">{f.title}</p>
                                    <p className="text-body text-slate-600">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Bạn có thể hỏi những gì?">
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
                    </Section>

                    <Section title="Truy cập beta">
                        <p>
                            Wallet Chat hiện đang trong giai đoạn beta với số lượng người dùng giới hạn.
                        </p>
                        <Link
                            href="/lien-he"
                            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity w-fit"
                        >
                            Yêu cầu truy cập beta
                        </Link>
                    </Section>
                </div>
            </ProsePageShell>
        </>
    );
}
