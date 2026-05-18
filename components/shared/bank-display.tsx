import Image from 'next/image';
import Link from 'next/link';
import type { Bank } from '@/lib/api';
import { getBankImageUrl } from '@/lib/api';

interface Props {
    bank: Bank;
    size?: 'sm' | 'md';
    asLink?: boolean;
    showName?: boolean;
}

export function BankDisplay({ bank, size = 'sm', asLink = false, showName = true }: Props) {
    const dim = size === 'sm' ? 20 : 24;
    const textClass = size === 'sm' ? 'text-sm' : 'text-base';

    const content = (
        <>
            <div className="relative shrink-0" style={{ width: dim, height: dim }}>
                <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain" />
            </div>
            {showName && (
                <span className={`${textClass} text-slate-700 transition-colors`}>{bank.name}</span>
            )}
        </>
    );

    if (asLink) {
        return (
            <Link href={`/ngan-hang/${bank.id}`} className="ow-bank-display flex items-center gap-2 w-fit group">
                {content}
            </Link>
        );
    }

    return <div className="ow-bank-display flex items-center gap-2">{content}</div>;
}
