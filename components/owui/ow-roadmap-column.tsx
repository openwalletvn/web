import type {GithubProjectColumn} from '@/lib/github-project';
import {OwRoadmapCard} from './ow-roadmap-card';

export function OwRoadmapColumn({column, label}: {column: GithubProjectColumn; label: string}) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
                <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{backgroundColor: column.color}}
                />
                <span className="font-medium text-sm text-text-primary">{label}</span>
                <span className="ml-auto text-xs text-text-subtle font-mono bg-bg-muted px-1.5 py-0.5 rounded">
                    {column.items.length}
                </span>
            </div>

            <div className="flex flex-col gap-2">
                {column.items.length === 0 ? (
                    <div className="border border-dashed border-border rounded-lg p-4 text-center text-text-subtle text-sm">
                        Trống
                    </div>
                ) : (
                    column.items.map((item) => (
                        <OwRoadmapCard key={item.id} item={item}/>
                    ))
                )}
            </div>
        </div>
    );
}
