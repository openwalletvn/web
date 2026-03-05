import Link from 'next/link';
import { getBanks, getCards, getNetworks } from '@/lib/api';
import { Nav } from './nav';
import { MobileNav } from './mobile-nav';
import { WalletNavButton } from './wallet-nav-button';
import { SearchDialog } from '@/components/search/search-dialog';

const NETWORK_TIER_FILTER = 'visa:infinite,visa:signature,mastercard:world-elite,mastercard:world,amex:platinum,jcb:ultimate';

export async function Header() {
  const [banks, networks, allCards] = await Promise.all([
    getBanks().catch(() => []),
    getNetworks().catch(() => []),
    getCards().catch(() => []),
  ]);

  const cardCounts: Record<string, number> = {
    '/the-tin-dung': allCards.filter((c) => c.card_type.includes('credit')).length,
    '/the-ghi-no': allCards.filter((c) => c.card_type.includes('debit')).length,
    '/the-tin-dung-mien-phi-thuong-nien': allCards.filter(
      (c) => c.card_type.includes('credit') && c.annual_fee === 0
    ).length,
    '/the-tin-dung-noi-dia': allCards.filter(
      (c) => c.card_type.includes('credit') && c.card_network === 'napas'
    ).length,
    '/the-2-trong-1': allCards.filter(
      (c) => c.card_type.includes('credit') && c.card_type.includes('debit')
    ).length,
    '/the-ghi-no-mien-phi': allCards.filter(
      (c) => c.card_type.includes('debit') && c.annual_fee === 0
    ).length,
    '/the-ghi-no-noi-dia': allCards.filter(
      (c) => c.card_type.includes('debit') && c.card_network === 'napas'
    ).length,
    '/the-shopee': allCards.filter((c) => c.co_brand === 'shopee').length,
    '/the-kim-loai': allCards.filter((c) => c.is_metal === true).length,
    '/the-doanh-nghiep': allCards.filter((c) => c.for_business === true).length,
    '/the-tin-dung-cao-cap': (() => {
      const tiers = new Set(
        NETWORK_TIER_FILTER.split(',').map((t) => {
          const [net, tier] = t.split(':');
          return `${net}:${tier}`;
        })
      );
      return allCards.filter((c) => {
        const key = `${c.card_network}:${c.card_tier}`;
        return tiers.has(key);
      }).length;
    })(),
    '/the-tin-dung-visa': allCards.filter(
      (c) => c.card_type.includes('credit') && c.card_network === 'visa'
    ).length,
    '/the-tin-dung-mastercard': allCards.filter(
      (c) => c.card_type.includes('credit') && c.card_network === 'mastercard'
    ).length,
    '/the-tin-dung-jcb': allCards.filter(
      (c) => c.card_type.includes('credit') && c.card_network === 'jcb'
    ).length,
    '/the-tin-dung-amex': allCards.filter(
      (c) => c.card_type.includes('credit') && c.card_network === 'amex'
    ).length,
  };

  const totalCards = allCards.length;
  const totalBanks = banks.length;

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
            <img src="/logo.png" alt="Open Wallet" className="h-8 w-8" />
          </Link>
          <div className="hidden md:flex">
            <Nav
              banks={banks}
              networks={networks}
              cardCounts={cardCounts}
              totalCards={totalCards}
              totalBanks={totalBanks}
            />
          </div>
        </div>

        {/* Right: search + wallet + mobile trigger */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="hidden md:block w-56">
            <SearchDialog />
          </div>
          <WalletNavButton />
          <div className="md:hidden flex items-center">
            <SearchDialog mobileOnly />
            <MobileNav banks={banks} />
          </div>
        </div>

      </div>
    </header>
  );
}
