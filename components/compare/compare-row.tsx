import {IconCircleCheckFilled} from '@tabler/icons-react';
import {colSpan} from './compare-col-span';
import {cn} from "@/lib/utils";

export interface CompareRowProps {
    label: string;
    rowDescription?: string;
    values: React.ReactNode[];
    descriptions?: React.ReactNode[];
    winnerIndex?: number | null;
    id?: string;
}

interface CompareCellProps {
    value: React.ReactNode;
    desc?: React.ReactNode;
    index: number;
    total: number;
    isWinner: boolean;
}

function CompareCell({value, desc, index, total, isWinner}: CompareCellProps) {
    return (
        <div
            className={`ow-compare-col ow-compare-col-${index + 1} ${colSpan(total, index)} flex flex-col items-start gap-1`}>
            <div
                className={cn("flex items-center gap-2 text-body-md", isWinner ? 'text-green-600 font-semibold' : 'text-slate-800')}>
                {isWinner && <IconCircleCheckFilled size={14} className="shrink-0"/>}
                <span>
                    {value}
                </span>
            </div>
            {desc && <div className="text-body-sm text-neutral-300">{desc}</div>}
        </div>
    );
}

export function CompareRow({label, rowDescription, values, descriptions, winnerIndex, id}: CompareRowProps) {
    return (
        <div id={id} className="ow-compare-row sm:py-6 py-3">
            <p className="text-label sm:mb-3 mb-1.5">{label}</p>
            {rowDescription && <p className="text-body-sm text-neutral-400 sm:mb-3 mb-1.5">{rowDescription}</p>}
            <div className="ow-compare-row-inner grid grid-cols-12">
                {values.map((v, i) => (
                    <CompareCell key={i} value={v} desc={descriptions?.[i]} index={i} total={values.length}
                                 isWinner={winnerIndex === i}/>
                ))}
            </div>
        </div>
    );
}
