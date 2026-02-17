import Link from 'next/link';
import { Github } from 'lucide-react';
import { getBanks } from '@/lib/api';
import { Nav } from './nav';
import { MobileNav } from './mobile-nav';

export async function Header() {
  const banks = await getBanks();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
            <img src="/logo.png" alt="Open Wallet" className="h-8 w-8" />
          </Link>
          <div className="hidden md:flex">
            <Nav banks={banks} />
          </div>
        </div>

        {/* Right: github + mobile trigger */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/openwalletvn"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <div className="md:hidden">
            <MobileNav banks={banks} />
          </div>
        </div>

      </div>
    </header>
  );
}
