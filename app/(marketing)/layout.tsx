import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChatProvider } from '@/components/chat/chat-provider';
import { ChatPanel } from '@/components/chat/chat-panel';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ChatProvider>
            <div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
            <ChatPanel />
        </ChatProvider>
    );
}
