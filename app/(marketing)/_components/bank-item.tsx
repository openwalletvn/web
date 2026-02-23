import Image from 'next/image';
import Link from 'next/link';
import { getBankImageUrl, type Bank } from '@/lib/api';

interface Props {
  bank: Bank;
}

export function BankItem({ bank }: Props) {
  return (
    <Link
      href={`/ngan-hang/${bank.id}`}
      className="flex flex-col items-center gap-2 p-4 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors"
    >
      <div className="relative w-14 h-14">
        <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain" />
      </div>
      <span className="text-base text-slate-600 text-center leading-tight">{bank.name}</span>
    </Link>
  );
}
