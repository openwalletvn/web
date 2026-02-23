export default function BanksLoading() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse mt-4" />
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mt-1" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-12 h-12 bg-slate-200 rounded animate-pulse" />
              <div className="w-16 h-3 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
