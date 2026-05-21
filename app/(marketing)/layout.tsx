import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CompareBar } from '@/components/compare/compare-bar';
import { Toaster } from 'sonner';
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
                <Toaster position="bottom-center" offset={72} />
                <CompareBar />
            </div>
            <ChatPanel />
        </ChatProvider>
    );
}
