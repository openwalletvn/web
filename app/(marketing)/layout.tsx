import { Header } from '@/components/layout/header';
import { Footer2 } from '@/components/layout/footer2';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer2 />
    </div>
  );
}
