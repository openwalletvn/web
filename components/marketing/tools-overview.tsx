import Link from 'next/link';
import {ROUTES} from '@/lib/routes';

const TOOLS = [
    {
        name: 'Card Match',
        href: ROUTES.cardMatch,
        description: 'Nhập thói quen chi tiêu, nhận đề xuất thẻ phù hợp nhất theo nhu cầu cụ thể.',
    },
    {
        name: 'Card Battle',
        href: ROUTES.cardBattle,
        description: 'So sánh hai thẻ bất kỳ cạnh nhau, dựa trên dữ liệu thực về phí, hoàn tiền và ưu đãi.',
    },
    {
        name: 'Owie Chat',
        href: ROUTES.owieChat,
        description: 'Trợ lý AI tư vấn thẻ, trả lời dựa trên dữ liệu thực. Miễn phí, không cần đăng ký.',
    },
    {
        name: 'OpenWallet MCP',
        href: ROUTES.openwalletMcp,
        description: 'Kết nối dữ liệu thẻ OpenWallet với AI chatbot của bạn qua Model Context Protocol.',
    },
];

export function ToolsOverview() {
    return (
        <div className="ow-tools-overview flex flex-col gap-6">
            <h2 className="heading-3">Công cụ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TOOLS.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group flex flex-col gap-2 border border-dashed border-border rounded-xl p-5 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                        <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {tool.name} →
                        </span>
                        <span className="text-body text-slate-600 text-sm">{tool.description}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
