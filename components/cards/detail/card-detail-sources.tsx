import type {Bank} from '@/lib/api';
import type {CardModel} from '@/lib/card-model';

interface Props {
    card: CardModel;
    bank: Bank | null;
}

export function CardDetailSources({ card }: Props) {
    const sources = card.getSources();
    const cardLink = card.getCardLink();
    const hasSources = sources && sources.length > 0;
    if (!hasSources && !cardLink) return null;

    return (
        <div className="ow-card-detail-sources flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Nguồn &amp; liên kết
            </p>
            <ul className="flex flex-col gap-1.5">
                {sources?.map((src, i) => (
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
                {cardLink && (
                    <li>
                        <a
                            href={cardLink}
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
