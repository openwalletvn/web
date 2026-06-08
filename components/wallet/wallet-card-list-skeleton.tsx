export function WalletCardListSkeleton() {
    return (
        <div className="ow-wallet-card-list-skeleton animate-pulse border border-dashed border-slate-200 rounded overflow-hidden">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-4 border-b border-dashed border-slate-100 last:border-0">
                    <div className="shrink-0 w-20 aspect-[16/10] bg-slate-100 rounded" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-slate-100 rounded" />
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
