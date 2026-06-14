import type {GithubProjectBoard} from '@/lib/github-project';
import {OwRoadmapColumn} from './ow-roadmap-column';

export interface OwRoadmapColConfig {
    name: string;
    label: string;
}

export interface OwRoadmapKanbanProps {
    board: GithubProjectBoard;
    columns: OwRoadmapColConfig[];
}

export function OwRoadmapKanban({board, columns}: OwRoadmapKanbanProps) {
    const colMap = new Map(board.columns.map((c) => [c.name, c]));

    const kanbanCols = columns
        .map((cfg) => ({cfg, col: colMap.get(cfg.name)}))
        .filter((x): x is {cfg: OwRoadmapColConfig; col: NonNullable<typeof x.col>} => x.col !== undefined);

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                {kanbanCols.map(({cfg, col}) => (
                    <OwRoadmapColumn key={col.id} column={col} label={cfg.label}/>
                ))}
            </div>
        </div>
    );
}
