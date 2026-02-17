import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-700">
        <span>© {new Date().getFullYear()} Open Wallet Vietnam</span>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-brand-red transition-colors">Home</Link>
          <Link href="/banks" className="hover:text-brand-red transition-colors">Banks</Link>
          <Link href="/cards" className="hover:text-brand-red transition-colors">Cards</Link>
          <Link href="/docs" className="hover:text-brand-red transition-colors">API Docs</Link>
          <a
            href="https://github.com/openwalletvn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-red transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
