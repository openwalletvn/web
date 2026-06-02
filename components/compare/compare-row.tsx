import {IconBulbFilled, IconCircleCheckFilled} from '@tabler/icons-react';
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
            className={cn("ow-compare-cell flex flex-col items-start gap-1", `ow-compare-col-${index + 1}`, colSpan(total, index))}>
            <div
                className={cn("ow-compare-cell-value flex items-center gap-2 text-body-md", isWinner ? 'text-green-600 font-semibold' : 'text-slate-800')}>
                {isWinner && <IconCircleCheckFilled size={14} className="shrink-0"/>}
                <span>
                    {value}
                </span>
            </div>
            {desc && <div className="ow-compare-cell-desc text-body-sm text-neutral-300 mt-0.5">{desc}</div>}
        </div>
    );
}

export function CompareRow({label, rowDescription, values, descriptions, winnerIndex, id}: CompareRowProps) {
    return (
        <div id={id} className="ow-compare-row sm:py-6 py-3">
            <div className="ow-compare-row-label text-label">{label}</div>

            <div className="ow-compare-row-cells grid grid-cols-12 sm:mt-3 mt-1.5">
                {values.map((v, i) => (
                    <CompareCell key={i} value={v} desc={descriptions?.[i]} index={i} total={values.length}
                                 isWinner={winnerIndex === i}/>
                ))}
            </div>

            {rowDescription &&
                <div className="ow-compare-row-desc text-body-sm text-neutral-400 mt-2 flex items-center gap-1">
                    <IconBulbFilled className="w-4"/>
                    {rowDescription}
                </div>}
        </div>
    );
}
