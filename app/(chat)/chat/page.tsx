import type { Metadata } from 'next';
import { ChatPageClient } from '@/components/chat/chat-page-client';

export const metadata: Metadata = {
    title: 'Owie - Trợ lý tư vấn thẻ AI | OpenWallet',
    description:
        'Hỏi Owie về thẻ ngân hàng Việt Nam: so sánh thẻ, tính hoàn tiền, tìm thẻ phù hợp nhu cầu chi tiêu. Miễn phí, không cần đăng ký.',
    openGraph: {
        title: 'Owie - Trợ lý tư vấn thẻ AI | OpenWallet',
        description: 'Hỏi Owie về thẻ ngân hàng Việt Nam. Miễn phí, không cần đăng ký.',
        url: 'https://openwallet.vn/chat',
    },
};

export default function ChatPage() {
    return <ChatPageClient />;
}
