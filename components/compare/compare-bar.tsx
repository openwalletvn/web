'use client';

import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {IconScale, IconX} from '@tabler/icons-react';
import {useCompareList} from '@/lib/use-compare-list';
import {getTool} from '@/lib/tools';

const SLOTS = 3;
const cardBattleHref = getTool('Card Battle').href;

export function CompareBar() {
    const router = useRouter();
    const {compareList, compareListMeta, removeFromCompare, clearCompare} = useCompareList();

    const canCompare = compareList.length >= 2;
    const visible = compareList.length >= 1;

    function handleCompare() {
        if (!canCompare) return;
        router.push(`${cardBattleHref}/${compareList.join('-vs-')}`);
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

                        {/* Mobile: count only */}
                        <span className="md:hidden text-body-sm flex-1">
                            <span className="font-semibold">{compareList.length}</span> thẻ được chọn
                        </span>

                        {/* Desktop: card slots */}
                        <div className="hidden md:flex items-center gap-2 flex-1">
                            {Array.from({length: SLOTS}).map((_, i) => {
                                const id = compareList[i];
                                const meta = id ? compareListMeta[id] : undefined;
                                if (id) {
                                    return (
                                        <div key={id} className="relative flex items-center gap-2 px-2 py-1.5 rounded border border-border bg-surface min-w-0">
                                            {meta?.image_url ? (
                                                <div className="shrink-0 w-10 h-7 relative rounded overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={meta.image_url}
                                                        alt={meta.name}
                                                        fill
                                                        className="object-contain"
                                                        sizes="40px"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="shrink-0 w-10 h-7 rounded bg-gray-100"/>
                                            )}
                                            <span className="text-body-sm text-text-primary truncate max-w-28">
                                                {meta?.name ?? id}
                                            </span>
                                            <button
                                                onClick={() => removeFromCompare(id)}
                                                className="shrink-0 ml-1 text-text-muted hover:text-foreground transition-colors"
                                                aria-label={`Xóa ${meta?.name ?? id}`}
                                            >
                                                <IconX size={14}/>
                                            </button>
                                        </div>
                                    );
                                }
                                return (
                                    <div key={`empty-${i}`} className="flex items-center justify-center w-32 h-10 rounded border border-dashed border-border text-text-muted text-body-sm">
                                        Thêm thẻ
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleCompare}
                            disabled={!canCompare}
                            className="px-4 py-2 rounded bg-primary text-white text-body-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0"
                        >
                            So sánh ngay
                        </button>
                        <button
                            onClick={clearCompare}
                            className="text-body-sm text-text-muted hover:text-foreground transition-colors underline shrink-0"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
