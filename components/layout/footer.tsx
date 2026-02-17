import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <span className="text-slate-300">© {new Date().getFullYear()} Open Wallet Vietnam</span>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/banks" className="hover:text-white transition-colors">Banks</Link>
          <Link href="/cards" className="hover:text-white transition-colors">Cards</Link>
          <Link href="/docs" className="hover:text-white transition-colors">API Docs</Link>
          <a
            href="https://github.com/openwalletvn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
