import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-slate-900 to-brand-dark flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Open Wallet Logo"
                className="w-32 h-32 md:w-40 md:h-40"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Open Wallet
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-8">
              Open-source digital wallet card database for Vietnam
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="px-8 py-4 bg-brand-red hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-lg"
            >
              View API Documentation
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-500">
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://github.com/openwalletvn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-red transition-colors"
          >
            GitHub
          </a>
          <span>•</span>
          <Link href="/app" className="hover:text-brand-red transition-colors">
            App (Coming Soon)
          </Link>
        </div>
      </footer>
    </div>
  );
}
