interface Props {
    interestFreeDays: number;
    statementDate: number;
}

export function CardBillingCycle({ interestFreeDays, statementDate }: Props) {
    const raw = statementDate + interestFreeDays;
    const dueDay = raw <= 28 ? raw : (raw % 28) + 1;
    const dueApprox = raw > 28;

    return (
        <div className="mt-2">
            {/* Timeline strip */}
            <div className="relative flex items-center">
                {/* Node 1: Chốt sao kê */}
                <div className="flex flex-col items-center shrink-0 z-10">
                    <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                </div>

                {/* Bar with floating label */}
                <div className="flex-1 relative mx-0">
                    <div className="h-1 w-full bg-gradient-to-r from-brand-blue to-green-500" />
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-slate-700">
                        {interestFreeDays} ngày miễn lãi
                    </span>
                </div>

                {/* Node 2: Hạn thanh toán */}
                <div className="flex flex-col items-center shrink-0 z-10">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                </div>
            </div>

            {/* Labels below nodes */}
            <div className="flex justify-between mt-1.5">
                <div className="text-center">
                    <p className="text-xs font-medium text-slate-700">Chốt sao kê</p>
                    <p className="text-xs text-slate-500">Ngày {statementDate}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs font-medium text-slate-700">Hạn thanh toán</p>
                    <p className="text-xs text-slate-500">
                        {dueApprox ? `~Ngày ${dueDay}` : `Ngày ${dueDay}`}
                    </p>
                </div>
            </div>

            <p className="text-xs text-slate-400 mt-2">
                Số ngày miễn lãi tối đa tính từ ngày chốt sao kê
            </p>
        </div>
    );
}
