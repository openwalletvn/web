import type { Card } from '@/lib/api';
import Link from 'next/link';
import { CardImage } from '@/components/cards/card-image';
import { CompareTable } from './compare-table';

interface Props {
    cardA: Card;
    cardB: Card;
    children?: React.ReactNode;
}

export function CompareTemplate({ cardA, cardB, children }: Props) {
    return (
        <div>
            {/* Card headers side by side */}
            <div className="flex items-start gap-6 mb-10">
                <div className="flex-1 flex flex-col items-center gap-3">
                    <Link href={`/the/${cardA.id}`} className="w-48 block">
                        <CardImage card={cardA} />
                    </Link>
                    <Link
                        href={`/the/${cardA.id}`}
                        className="text-base font-semibold text-slate-900 hover:text-brand-red transition-colors text-center"
                    >
                        {cardA.name}
                    </Link>
                </div>

                <div className="text-2xl font-bold text-slate-300 shrink-0 pt-12">vs</div>

                <div className="flex-1 flex flex-col items-center gap-3">
                    <Link href={`/the/${cardB.id}`} className="w-48 block">
                        <CardImage card={cardB} />
                    </Link>
                    <Link
                        href={`/the/${cardB.id}`}
                        className="text-base font-semibold text-slate-900 hover:text-brand-red transition-colors text-center"
                    >
                        {cardB.name}
                    </Link>
                </div>
            </div>

            {/* Comparison table */}
            <CompareTable cardA={cardA} cardB={cardB} />

            {/* Editorial MDX content */}
            {children && (
                <div className="mt-12 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline">
                    {children}
                </div>
            )}
        </div>
    );
}
