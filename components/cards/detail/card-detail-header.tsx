import Image from 'next/image';
import Link from 'next/link';
import type { Card, Bank } from '@/lib/api';
import { getBankImageUrl, getWalletImageUrl } from '@/lib/api';
import { MetalBadge } from '@/components/cards/metal-badge';
import { CoBrandDisplay } from '@/components/cards/co-brand-display';

interface Props {
    card: Card;
    bank: Bank | null;
}

export function CardDetailHeader({ card, bank }: Props) {
    return (
        <div className="flex flex-col gap-3">
            {bank && (
                <Link
                    href={`/ngan-hang/${bank.id}`}
                    className="flex items-center gap-2 w-fit group"
                >
                    <div className="relative w-5 h-5 shrink-0">
                        <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain" />
                    </div>
                    <span className="text-sm text-slate-700 group-hover:text-slate-700 transition-colors">
                        {bank.name}
                    </span>
                </Link>
            )}

            <h1 className="text-3xl font-bold text-slate-900 leading-tight">{card.name}</h1>

            <div className="flex flex-wrap gap-1.5">
                {card.status === 'discontinued' && (
                    <span className="px-1.5 py-0.5 border border-dashed border-amber-400 text-amber-600 bg-amber-50 text-[11px]">
                        Dừng phát hành
                    </span>
                )}
                <span className="px-1.5 py-0.5 border border-dashed border-brand-blue text-brand-blue font-medium capitalize">
                    {card.card_network}{card.card_tier ? ` ${card.card_tier}` : ''}
                </span>
                {card.card_type.map((type) => (
                    <span
                        key={type}
                        className="px-1.5 py-0.5 border border-dashed border-slate-300 text-slate-700 capitalize"
                    >
                        {type}
                    </span>
                ))}
                {card.is_metal && <MetalBadge />}
            </div>

            {card.co_brand && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600">Co-brand:</span>
                    {card.co_brand_data
                        ? <CoBrandDisplay brand={card.co_brand_data} fallback={card.co_brand} />
                        : <span className="font-medium text-slate-800">{card.co_brand}</span>
                    }
                </div>
            )}

            {card.contactless_methods_data && card.contactless_methods_data.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {card.contactless_methods_data.map((wallet) => (
                        <div
                            key={wallet.id}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-dashed border-slate-200 rounded-sm"
                        >
                            <div className="relative w-5 h-5">
                                <Image src={getWalletImageUrl(wallet.logo_url)} alt="" fill className="object-contain" />
                            </div>
                            <span className="text-xs text-slate-600">{wallet.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
