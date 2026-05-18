import type { CardFees, FeeEntry, FeeWaiver, CardSource } from '@/lib/api';
import { formatFee } from '@/lib/utils';

function FeeNote({ note }: { note: string }) {
    const lines = note.split('|').map((l) => l.trim()).filter(Boolean);
    return (
        <ul className="mt-0.5 space-y-0.5">
            {lines.map((line, i) => (
                <li key={i} className="text-xs text-slate-400">{line}</li>
            ))}
        </ul>
    );
}


function WaiverBadge({ waiver }: { waiver: FeeWaiver }) {
    if (waiver.waiver && !waiver.condition) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                ✓ Miễn phí
            </span>
        );
    }
    if (waiver.waiver && waiver.condition) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                ✓ Có điều kiện
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
    fees: CardFees;
    sources?: CardSource[];
}

export function CardFeesBlock({ fees, sources }: Props) {
    const annual = fees.annual;

    const allSecondaryFees: { key: keyof CardFees; label: string }[] = [
        { key: 'annual_supplementary', label: 'Thẻ phụ' },
        { key: 'issuance', label: 'Phát hành' },
        { key: 'cancellation', label: 'Hủy thẻ' },
        { key: 'foreign', label: 'Ngoại tệ' },
        { key: 'foreign_dcc', label: 'Ngoại tệ (DCC)' },
    ];
    const secondaryFees = allSecondaryFees.filter(({ key }) => fees[key] != null);

    return (
        <div className="ow-card-fees-block flex flex-col gap-3">
            {/* Annual fee box */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-700">Phí thường niên</span>
                    {annual ? (
                        <span className={`text-lg font-bold ${annual.amount === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                            {formatFee(annual)}
                        </span>
                    ) : (
                        <span className="text-sm text-slate-400">Chưa có thông tin</span>
                    )}
                </div>

                {annual && (annual.first_year || annual.subsequent_years) && (
                    <div className="mt-3 flex flex-col gap-2">
                        {annual.first_year && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 w-24 shrink-0">Năm đầu</span>
                                    <WaiverBadge waiver={annual.first_year} />
                                </div>
                                {annual.first_year.condition && (
                                    <p className="text-xs text-slate-400 mt-1 ml-26">{annual.first_year.condition}</p>
                                )}
                            </div>
                        )}
                        {annual.subsequent_years && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 w-24 shrink-0">Năm tiếp theo</span>
                                    <WaiverBadge waiver={annual.subsequent_years} />
                                </div>
                                {annual.subsequent_years.condition && (
                                    <p className="text-xs text-slate-400 mt-1 ml-26">{annual.subsequent_years.condition}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {annual?.note && (
                    <div className="mt-2">
                        <FeeNote note={annual.note} />
                    </div>
                )}
            </div>

            {/* Secondary fees */}
            {secondaryFees.length > 0 && (
                <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {secondaryFees.map(({ key, label }) => {
                        const entry = fees[key] as FeeEntry;
                        return (
                            <div key={key} className="px-4 py-2.5 bg-white">
                                <div className="flex items-baseline justify-between gap-3">
                                    <span className="text-xs text-slate-500">{label}</span>
                                    <span className={`text-sm font-medium shrink-0 ${entry.amount === 0 && entry.type === 'currency' ? 'text-green-600' : 'text-slate-900'}`}>
                                        {formatFee(entry)}
                                    </span>
                                </div>
                                {entry.note && <FeeNote note={entry.note} />}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Sources */}
            {sources && sources.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs text-slate-400">Nguồn:</span>
                    {sources.map((src, i) => (
                        <a
                            key={i}
                            href={src.page != null ? `${src.url}#page=${src.page}` : src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
                        >
                            {src.label}{src.page != null ? ` (tr. ${src.page})` : ''}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
