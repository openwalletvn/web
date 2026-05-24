import type { Metadata } from 'next';
import Link from 'next/link';
import { buildBreadcrumbJsonLd } from '@/lib/page-meta/breadcrumb';
import { ProsePageShell } from '@/components/layout/prose-page-shell';

export const metadata: Metadata = {
    title: 'OpenWallet MCP | Tích hợp dữ liệu thẻ ngân hàng vào Claude',
    description: 'OpenWallet MCP cho phép Claude và các AI assistant truy cập dữ liệu thẻ ngân hàng Việt Nam theo thời gian thực. So sánh thẻ, xếp hạng cashback, tra cứu điều kiện mà không cần rời khỏi cuộc trò chuyện.',
    openGraph: {
        title: 'OpenWallet MCP',
        description: 'Tích hợp dữ liệu thẻ ngân hàng Việt Nam vào Claude qua Model Context Protocol.',
        url: 'https://openwallet.vn/mcp',
    },
};

const TOOLS = [
    {
        name: 'listBanks',
        label: 'Danh sách ngân hàng',
        desc: 'Liệt kê tất cả ngân hàng phát hành thẻ tại Việt Nam kèm thông tin mạng lưới.',
    },
    {
        name: 'resolveBank',
        label: 'Tìm ngân hàng',
        desc: 'Tra cứu ID ngân hàng từ tên thông thường hoặc tên viết tắt.',
    },
    {
        name: 'listIntents',
        label: 'Danh mục chi tiêu',
        desc: 'Liệt kê các mục đích chi tiêu được hỗ trợ để lọc và xếp hạng thẻ.',
    },
    {
        name: 'searchCards',
        label: 'Tìm kiếm thẻ',
        desc: 'Tìm thẻ theo từ khoá, ngân hàng, loại thẻ, mạng lưới hoặc danh mục chi tiêu.',
    },
    {
        name: 'resolveCard',
        label: 'Tìm thẻ theo tên',
        desc: 'Tra cứu ID thẻ từ tên thông thường để dùng với các công cụ khác.',
    },
    {
        name: 'getCardDetail',
        label: 'Chi tiết thẻ',
        desc: 'Xem đầy đủ thông tin thẻ: phí thường niên, hạn mức, ưu đãi hoàn tiền và điều kiện.',
    },
    {
        name: 'rankCardsForSpend',
        label: 'Xếp hạng theo chi tiêu',
        desc: 'Xếp hạng thẻ tối ưu dựa trên thói quen chi tiêu thực tế của người dùng.',
    },
    {
        name: 'compareCards',
        label: 'So sánh thẻ',
        desc: 'So sánh song song hai hoặc nhiều thẻ về phí, ưu đãi và điều kiện.',
    },
];

const CONFIG_EXAMPLE = `{
  "mcpServers": {
    "openwallet": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.openwallet.vn/"],
      "headers": {
        "x-mcp-key": "YOUR_API_KEY"
      }
    }
  }
}`;

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

export default function McpPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'SoftwareApplication',
                name: 'OpenWallet MCP',
                url: 'https://openwallet.vn/mcp',
                description: 'Model Context Protocol server cung cấp dữ liệu thẻ ngân hàng Việt Nam cho các AI assistant.',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'All',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'VND',
                },
            },
            buildBreadcrumbJsonLd([
                { label: 'Trang chủ', href: '/' },
                { label: 'MCP', href: '/mcp' },
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
                title="OpenWallet MCP"
                subtitle="Cho phép Claude và các AI assistant truy cập dữ liệu thẻ ngân hàng Việt Nam theo thời gian thực. So sánh thẻ, xếp hạng cashback, tra cứu điều kiện mà không cần rời khỏi cuộc trò chuyện."
            >
                <div className="flex flex-col gap-10">
                    <section>
                        <Link
                            href="/lien-he"
                            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                        >
                            Yêu cầu API key
                        </Link>
                    </section>

                    <Section title="MCP là gì?">
                        <p>
                            Model Context Protocol (MCP) là tiêu chuẩn mở do Anthropic phát triển, cho phép AI assistant kết nối trực tiếp với dữ liệu và công cụ bên ngoài. Thay vì phụ thuộc vào dữ liệu huấn luyện có thể lỗi thời, Claude có thể gọi API OpenWallet để lấy thông tin thẻ chính xác và cập nhật nhất.
                        </p>
                        <p>
                            Người dùng có thể hỏi trực tiếp trong Claude: &ldquo;Thẻ nào hoàn tiền tốt nhất cho mua sắm online?&rdquo; và nhận câu trả lời dựa trên dữ liệu thực từ OpenWallet.
                        </p>
                    </Section>

                    <Section title="8 công cụ có sẵn">
                        <div className="grid gap-3">
                            {TOOLS.map(tool => (
                                <div key={tool.name} className="flex gap-4 p-4 border border-border rounded-lg">
                                    <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded h-fit shrink-0 mt-0.5">{tool.name}</code>
                                    <div>
                                        <p className="text-sm font-medium mb-0.5">{tool.label}</p>
                                        <p className="text-sm text-slate-500">{tool.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Cấu hình Claude Desktop">
                        <p>
                            Thêm vào file <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">claude_desktop_config.json</code>:
                        </p>
                        <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-slate-700">
                            {CONFIG_EXAMPLE}
                        </pre>
                        <p className="text-sm text-slate-500">
                            Thay <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">YOUR_API_KEY</code> bằng key được cấp sau khi đăng ký.
                        </p>
                    </Section>

                    <Section title="Cách lấy API key">
                        <p>
                            OpenWallet MCP hiện đang trong giai đoạn beta. Key có thời hạn và được quản lý thủ công trong giai đoạn này.
                        </p>
                        <Link
                            href="/lien-he"
                            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity w-fit"
                        >
                            Yêu cầu API key
                        </Link>
                    </Section>
                </div>
            </ProsePageShell>
        </>
    );
}
