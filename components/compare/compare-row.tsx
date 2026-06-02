import {IconCircleCheckFilled} from '@tabler/icons-react';
import {colSpan} from './compare-col-span';

export interface CompareRowProps {
    label: string;
    values: React.ReactNode[];
    winnerIndex?: number | null;
    id?: string;
}

export function CompareRow({label, values, winnerIndex, id}: CompareRowProps) {
    return (
        <div id={id} className="ow-compare-row sm:py-6 py-3">
            <p className="text-label sm:mb-3 mb-1.5">{label}</p>
            <div className="ow-compare-row-inner grid grid-cols-12">
                {values.map((v, i) => (
                    <div key={i}
                         className={`ow-compare-col ow-compare-col-${i + 1} ${colSpan(values.length, i)} text-body-md flex items-start gap-1 ${winnerIndex === i ? 'text-green-600 font-semibold' : 'text-slate-800'}`}>
                        {winnerIndex === i && <IconCircleCheckFilled size={14} className="shrink-0"/>}
                        {v}
                    </div>
                ))}
            </div>
        </div>
    );
}
