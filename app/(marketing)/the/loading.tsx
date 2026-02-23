import { CardsSectionSkeleton } from '../_components/cards-section';

export default function CardsLoading() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-slate-200 rounded animate-pulse mt-4" />
        </div>
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="h-10 w-36 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-36 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <CardsSectionSkeleton />
      </div>
    </div>
  );
}
