import {IconLaurelWreath1Filled, IconLaurelWreath2Filled, IconLaurelWreath3Filled} from '@tabler/icons-react';

export function RankBadge({rank}: {rank: number}) {
    if (rank === 1) return <IconLaurelWreath1Filled size={22} className="text-amber-500"/>;
    if (rank === 2) return <IconLaurelWreath2Filled size={22} className="text-slate-400"/>;
    if (rank === 3) return <IconLaurelWreath3Filled size={22} className="text-orange-400"/>;
    return <span className="text-label text-text-muted">#{rank}</span>;
}
