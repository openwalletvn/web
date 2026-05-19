import type { Card, Bank, FeeEntry, FeeEntryWithWaiver, FeeWaiver } from '@/lib/api';
import { formatFee } from '@/lib/utils';

function NoteLines({ note }: { note: string }) {
 const lines = note.split('|').map((l) => l.trim()).filter(Boolean);
 return (
 <ul className="space-y-0.5 mt-1">
 {lines.map((line, i) => (
 <li key={i} className="text-xs text-slate-600 leading-snug">{line}</li>
 ))}
 </ul>
 );
}

function WaiverDisplay({ waiver }: { waiver: FeeWaiver }) {
 if (waiver.waiver && waiver.condition) {
 return (
 <div className="flex flex-col gap-0.5">
 <p className="text-2xl font-bold text-green-600">Miễn phí</p>
 <p className="text-xs text-slate-600">
 với điều kiện: {waiver.condition}
 </p>
 </div>
 );
 }
 if (waiver.waiver) {
 return (
 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
 ✓ Miễn phí
 </span>
 );
 }
 return (
 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
 ✗ Không miễn
 </span>
 );
}

interface Props {
 card: Card;
 bank: Bank | null;
}

export function CardDetailFees({ card }: Props) {
 if (!card.fees) return null;
 const { fees } = card;
 const annual = fees.annual as FeeEntryWithWaiver | undefined;

 return (
 <section className="ow-card-detail-fees flex flex-col gap-4">
 <h2 className="text-label text-text-muted">Biểu phí</h2>

 <div className="relative">
 {/* Column labels */}
 <div className="grid grid-cols-3 mb-2">
 <p className="text-xs text-slate-600">Phát hành</p>
 <p className="text-xs text-slate-600 text-center">Năm đầu</p>
 <p className="text-xs text-slate-600 text-right">Các năm tiếp theo</p>
 </div>

 {/* Track */}
 <div className="flex items-center mb-4">
 <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0 z-10" />
 <div className="flex-1 h-px bg-slate-200" />
 <div className="w-2.5 h-2.5 rounded-full bg-brand-blue shrink-0 z-10" />
 <div className="flex-1 h-px bg-slate-200" />
 <div className="w-2.5 h-2.5 rounded-full bg-brand-blue shrink-0 z-10" />
 <span className="text-slate-600 ml-1.5 text-xs leading-none">▶</span>
 </div>

 {/* Content */}
 <div className="grid grid-cols-3 gap-x-4">
 {/* Col 1: Phát hành */}
 <div className="flex flex-col items-start gap-1">
 <p className={`text-2xl font-bold leading-tight ${!fees.issuance || fees.issuance.amount === 0 ? 'text-green-600' : 'text-slate-900'}`}>
 {fees.issuance ? formatFee(fees.issuance) : 'Miễn phí'}
 </p>
 {fees.issuance?.note && <NoteLines note={fees.issuance.note} />}
 </div>

 {/* Col 2: Năm đầu */}
 <div className="flex flex-col items-center text-center gap-1">
 {annual ? (
 <>
 <p className={`text-2xl font-bold leading-tight ${annual.amount === 0 ? 'text-green-600' : 'text-slate-900'}`}>
 {formatFee(annual)}
 </p>
 {annual.first_year && (
 <WaiverDisplay waiver={annual.first_year} />
 )}
 {annual.note && <NoteLines note={annual.note} />}
 </>
 ) : (
 <p className="text-2xl font-bold text-slate-500">—</p>
 )}
 </div>

 {/* Col 3: Các năm tiếp theo */}
 <div className="flex flex-col items-end text-right gap-1">
 {annual ? (
 <>
 <p className={`text-2xl font-bold leading-tight ${annual.amount === 0 ? 'text-green-600' : 'text-slate-900'}`}>
 {formatFee(annual)}
 </p>
 {annual.subsequent_years && (
 <WaiverDisplay waiver={annual.subsequent_years} />
 )}
 </>
 ) : (
 <p className="text-2xl font-bold text-slate-500">—</p>
 )}
 </div>
 </div>
 </div>
 </section>
 );
}
