import { Skeleton } from '@/components/ui/skeleton';

export default function CardPageLoading() {
    return (
        <div className="py-12">
            <div className="ow-container">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-2" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-2" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="mt-8 grid grid-cols-12 xl:gap-8 gap-6">
                    {/* Left col: card image */}
                    <div className="xl:col-span-3 md:col-span-4 col-span-12">
                        <div className="max-w-[360px]">
                            <Skeleton className="w-full rounded-xl" style={{ aspectRatio: '16/10' }} />
                            <div className="mt-4 flex flex-col gap-2">
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Right col: detail sections */}
                    <div className="xl:col-span-9 md:col-span-8 col-span-12 flex flex-col gap-8 min-w-0">
                        {/* Header */}
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-8 w-64" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-14" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>

                        {/* Billing cycle section */}
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-20 w-full rounded-lg" />
                        </div>

                        {/* Fees section */}
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-28" />
                            <div className="flex flex-col gap-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Other fees */}
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-36" />
                            <div className="flex flex-col gap-2">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
