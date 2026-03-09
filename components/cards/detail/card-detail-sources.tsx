import type { Card, Bank } from '@/lib/api';

interface Props {
    card: Card;
    bank: Bank | null;
}

export function CardDetailSources({ card }: Props) {
    const hasSources = card.sources && card.sources.length > 0;
    if (!hasSources && !card.card_link) return null;

    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Nguồn &amp; liên kết
            </p>
            <ul className="flex flex-col gap-1.5">
                {card.sources?.map((src, i) => (
                    <li key={i}>
                        <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-slate-800 hover:text-brand-blue transition-colors"
                        >
                            ↗ {src.label}{src.page != null ? ` (tr. ${src.page})` : ''}
                        </a>
                    </li>
                ))}
                {card.card_link && (
                    <li>
                        <a
                            href={card.card_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-slate-800 hover:text-brand-blue transition-colors"
                        >
                            ↗ Xem chi tiết thẻ chính thức
                        </a>
                    </li>
                )}
            </ul>
        </div>
    );
}
