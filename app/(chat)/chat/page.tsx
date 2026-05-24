import type { Metadata } from 'next';
import { ChatPageClient } from '@/components/chat/chat-page-client';

export const metadata: Metadata = {
    title: 'Tư vấn thẻ ngân hàng | OpenWallet',
    description:
        'Hỏi chuyên gia AI về thẻ tín dụng và thẻ ghi nợ tại Việt Nam. So sánh thẻ, tư vấn lựa chọn phù hợp nhu cầu chi tiêu của bạn.',
    openGraph: {
        title: 'Tư vấn thẻ ngân hàng AI | OpenWallet',
        description: 'Hỏi chuyên gia AI về thẻ ngân hàng Việt Nam. Miễn phí, không cần đăng ký.',
        url: 'https://openwallet.vn/chat',
    },
};

export default function ChatPage() {
    return <ChatPageClient />;
}
