import Link from 'next/link';
import type {GithubProjectBoard} from '@/lib/github-project';
import {ROUTES} from '@/lib/routes';
import {OwButton} from './ow-button';
import {OwRoadmapCard} from './ow-roadmap-card';
import {OwRoadmapColumn} from './ow-roadmap-column';

export interface OwRoadmapColConfig {
    name: string;
    label: string;
}

export interface OwRoadmapKanbanProps {
    board: GithubProjectBoard;
    columns: OwRoadmapColConfig[];
    completedCol: OwRoadmapColConfig;
}

export function OwRoadmapKanban({board, columns, completedCol}: OwRoadmapKanbanProps) {
    const colMap = new Map(board.columns.map((c) => [c.name, c]));

    const kanbanCols = columns
        .map((cfg) => ({cfg, col: colMap.get(cfg.name)}))
        .filter((x): x is {cfg: OwRoadmapColConfig; col: NonNullable<typeof x.col>} => x.col !== undefined);

    const completedData = colMap.get(completedCol.name);
    const completedItems = [...(completedData?.items ?? [])].sort((a, b) => {
        if (!a.shippedDate && !b.shippedDate) return 0;
        if (!a.shippedDate) return 1;
        if (!b.shippedDate) return -1;
        return b.shippedDate.localeCompare(a.shippedDate);
    });

    return (
        <div className="mt-8 space-y-12">
            {/* Kanban columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                {kanbanCols.map(({cfg, col}) => (
                    <OwRoadmapColumn key={col.id} column={col} label={cfg.label}/>
                ))}
            </div>

            {/* Recently Completed */}
            {completedItems.length > 0 && (
                <div>
                    <h2 className="mb-4">{completedCol.label}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {completedItems.map((item) => (
                            <OwRoadmapCard key={item.id} item={item}/>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA */}
            <div className="border border-border rounded-xl p-8 text-center space-y-3">
                <p className="text-text-muted text-sm">Want to see everything we shipped?</p>
                <p className="font-display text-xl text-text-primary">View the full changelog</p>
                <OwButton color="outline" size="sm" asChild>
                    <Link href={ROUTES.changelog}>Xem Changelog</Link>
                </OwButton>
            </div>
        </div>
    );
}
