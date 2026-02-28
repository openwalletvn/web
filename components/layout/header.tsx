import Link from 'next/link';
import { getBanks } from '@/lib/api';
import { Nav } from './nav';
import { MobileNav } from './mobile-nav';
import { WalletNavButton } from './wallet-nav-button';
import { SearchDialog } from '@/components/search/search-dialog';

export async function Header() {
  const banks = await getBanks().catch(() => []);

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
            <img src="/logo.png" alt="Open Wallet" className="h-8 w-8" />
          </Link>
          <div className="hidden md:flex">
            <Nav banks={banks} />
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
