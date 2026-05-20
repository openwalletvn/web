'use client';

import {useRouter} from 'next/navigation';
import {IconScale} from '@tabler/icons-react';
import {useCompareList} from '@/lib/use-compare-list';

export function CompareBar() {
    const router = useRouter();
    const {compareList, clearCompare} = useCompareList();

    const canCompare = compareList.length >= 2;
    const visible = compareList.length >= 1;

    function handleCompare() {
        if (!canCompare) return;
        router.push(`/so-sanh/${compareList.join('-vs-')}`);
    }

    return (
        <div
            className={`ow-compare-bar fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
                visible ? 'translate-y-0' : 'translate-y-full'
            }`}
            aria-hidden={!visible}
        >
            <div className="bg-white border-t border-border shadow-lg">
                <div className="ow-container">
                    <div className="flex items-center gap-3 py-3">
                        <IconScale size={18} className="text-primary shrink-0"/>
                        <span className="text-body-sm flex-1">
                            <span className="font-semibold">{compareList.length}</span> thẻ được chọn
                        </span>
                        <button
                            onClick={handleCompare}
                            disabled={!canCompare}
                            className="px-4 py-2 rounded bg-primary text-white text-body-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                        >
                            So sánh ngay
                        </button>
                        <button
                            onClick={clearCompare}
                            className="text-body-sm text-text-muted hover:text-foreground transition-colors underline"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
