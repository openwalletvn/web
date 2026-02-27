import Image from 'next/image';
import Link from 'next/link';
import {type Bank, getBankImageUrl} from '@/lib/api';

interface Props {
    bank: Bank;
}

export function BankItem({ bank }: Props) {
    return (
        <Link
            href={`/ngan-hang/${bank.id}`}
            className="flex flex-col items-center gap-2 hover:bg-slate-50/60 transition-colors p-2"
        >
            <div className="relative h-20 aspect-video">
                <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain"/>
            </div>
            <div className="text-base text-slate-600 text-center leading-tight max-w-[280px]">{bank.full_name}</div>
            <div className="flex gap-3">
                {(bank.stats?.card_count ?? 0) > 0 && (
                    <span className="text-sm text-slate-400">{bank.stats!.card_count} thẻ</span>
                )}
                {(bank.networks?.length ?? 0) > 0 && (
                    <span className="text-sm text-slate-400">{bank.networks?.length} mạng thẻ</span>
                )}
            </div>
        </Link>
    );
}
