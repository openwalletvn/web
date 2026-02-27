import Image from 'next/image';
import type {Network} from '@/lib/api';
import {getNetworkImageUrl} from '@/lib/api';

interface Props {
    networkCounts: Record<string, number>;
    networksData: Network[];
    totalCards: number;
}

const SEGMENT_COLORS = ['bg-zinc-300', 'bg-zinc-400', 'bg-zinc-200', 'bg-zinc-500'];

export function NetworkDistributionBar({networkCounts, networksData, totalCards}: Props) {
    if (totalCards < 5 || Object.keys(networkCounts).length <= 1) return null;

    const segments = Object.entries(networkCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([networkId, count], i) => ({
            networkId,
            count,
            pct: (count / totalCards) * 100,
            networkData: networksData.find((n) => n.id === networkId),
            color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
        }));

    return (
        <div className="space-y-2">
            {/* Labels row */}
            <div className="flex w-full items-end min-h-10">
                {segments.map(({networkId, count, pct, networkData}) => (
                    <div
                        key={networkId}
                        style={{width: `${pct}%`}}
                        className="flex flex-col items-center gap-2"
                    >
                        {networkData && (
                            <Image
                                src={getNetworkImageUrl(networkData.logo_url)}
                                alt={networkData.name ?? networkId}
                                width={24}
                                height={24}
                                className="object-contain h-8 w-auto aspect-video"
                            />
                        )}
                        <span className="text-xs text-zinc-500 whitespace-nowrap">
                                {Math.round(pct)}% · {count} thẻ
                            </span>
                    </div>
                ))}
            </div>

            {/* Bar */}
            <div className="flex w-full h-2 rounded-full overflow-hidden">
                {segments.map(({networkId, count, pct, networkData, color}, i) => (
                    <div
                        key={networkId}
                        style={{width: `${pct}%`}}
                        className={`${color} relative`}
                        title={`${networkData?.name ?? networkId}: ${count} thẻ (${Math.round(pct)}%)`}
                    >
                        {i < segments.length - 1 && (
                            <div className="absolute right-0 top-0 bottom-0 w-px bg-white"/>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
