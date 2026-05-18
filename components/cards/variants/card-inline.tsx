import Link from 'next/link';
import type { Card } from '@/lib/api';
import { NetworkBadge } from '@/components/shared/network-badge';

interface Props {
    card: Card;
    badges?: { network?: boolean };
    showLogo?: boolean;
    asLink?: boolean;
}

export function CardInline({ card, badges = {}, showLogo = true, asLink = false }: Props) {
    const { network = true } = badges;

    const content = (
        <span className="inline-flex items-center gap-2">
            <span className="font-medium text-slate-800">{card.name}</span>
            {network && <NetworkBadge card={card} variant={showLogo ? 'slim' : 'full'} />}
        </span>
    );

    if (asLink) {
        return (
            <Link href={`/the/${card.id}`} className="ow-card-inline hover:text-brand-blue transition-colors">
                {content}
            </Link>
        );
    }

    return <span className="ow-card-inline">{content}</span>;
}
