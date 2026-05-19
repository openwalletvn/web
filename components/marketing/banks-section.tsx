import Link from 'next/link';
import { getBanks } from '@/lib/api';
import { BankItem } from '@/components/shared/bank-item';

interface Props {
 limit?: number;
 showViewAll?: boolean;
}

export async function BanksSection({ limit, showViewAll }: Props) {
 const banks = await getBanks();
 const displayed = limit ? banks.slice(0, limit) : banks;

 return (
 <section className="ow-banks-section ow-container py-12">
 <div className="mb-8">
 <h2 className="">Ngân hàng</h2>
 <div className="border-t border-dashed border-slate-300 mt-3" />
 <p className="text-slate-500 mt-3">Dữ liệu đầy đủ cho tất cả các ngân hàng lớn tại Việt Nam, được cập nhật thường xuyên.</p>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
 {displayed.map((bank) => (
 <BankItem key={bank.id} bank={bank} />
 ))}
 </div>

 {showViewAll && (
 <div className="mt-8">
 <Link
 href="/ngan-hang"
 className="inline-block px-6 py-2.5 border border-dashed border-slate-300 rounded-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors"
 >
 {`Xem tất cả ${banks.length} ngân hàng →`}
 </Link>
 </div>
 )}
 </section>
 );
}

export function BanksSectionSkeleton() {
 return (
 <section className="ow-banks-section ow-container py-12">
 <div className="mb-8">
 <div className="h-9 w-24 bg-slate-200 rounded animate-pulse" />
 <div className="border-t border-dashed border-slate-200 mt-3" />
 <div className="h-4 w-64 bg-slate-200 rounded animate-pulse mt-3" />
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
 {Array.from({ length: 10 }).map((_, i) => (
 <div key={i} className="flex flex-col items-center gap-2 p-4 border border-dashed border-slate-200 rounded-sm">
 <div className="w-14 h-14 bg-slate-200 rounded animate-pulse" />
 <div className="w-16 h-3 bg-slate-200 rounded animate-pulse" />
 </div>
 ))}
 </div>
 </section>
 );
}
