import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CompareBar } from '@/components/compare/compare-bar';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompareBar />
    </div>
  );
}
