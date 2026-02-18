import Link from "next/link";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-slate-900 to-brand-dark flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-brand-red/10 rounded-2xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-brand-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-8">
            Card manager app launching soon
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/docs"
            className="inline-block px-6 py-3 bg-brand-red hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            View API Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
