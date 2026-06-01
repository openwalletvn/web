'use client';

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {toast} from 'sonner';

const MAX_IDS = 3;

export interface CardCompareMeta {
    name: string;
    image_url: string | null;
}

interface CompareListState {
    compareList: string[];
    compareListMeta: Record<string, CardCompareMeta>;
    isFull: boolean;
    addToCompare: (id: string, meta?: CardCompareMeta) => void;
    removeFromCompare: (id: string) => void;
    toggleCompare: (id: string, meta?: CardCompareMeta) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
}

export const useCompareList = create<CompareListState>()(
    persist(
        (set, get) => ({
            compareList: [],
            compareListMeta: {},
            isFull: false,

            addToCompare: (id, meta) => {
                const {compareList, compareListMeta} = get();
                if (compareList.includes(id) || compareList.length >= MAX_IDS) return;
                const updated = [...compareList, id];
                set({
                    compareList: updated,
                    isFull: updated.length >= MAX_IDS,
                    compareListMeta: meta ? {...compareListMeta, [id]: meta} : compareListMeta,
                });
                if (meta) toast.success(`Đã thêm ${meta.name} vào so sánh`);
            },

            removeFromCompare: (id) => {
                const {compareList, compareListMeta} = get();
                const updated = compareList.filter(i => i !== id);
                const {[id]: _, ...restMeta} = compareListMeta;
                set({compareList: updated, isFull: false, compareListMeta: restMeta});
            },

            toggleCompare: (id, meta) => {
                const {compareList, compareListMeta} = get();
                if (compareList.includes(id)) {
                    const updated = compareList.filter(i => i !== id);
                    const {[id]: _, ...restMeta} = compareListMeta;
                    set({compareList: updated, isFull: false, compareListMeta: restMeta});
                } else if (compareList.length < MAX_IDS) {
                    const updated = [...compareList, id];
                    set({
                        compareList: updated,
                        isFull: updated.length >= MAX_IDS,
                        compareListMeta: meta ? {...compareListMeta, [id]: meta} : compareListMeta,
                    });
                    if (meta) toast.success(`Đã thêm ${meta.name} vào so sánh`);
                }
            },

            clearCompare: () => set({compareList: [], compareListMeta: {}, isFull: false}),

            isInCompare: (id) => get().compareList.includes(id),
        }),
        {
            name: 'compare_list',
            partialize: (s) => ({compareList: s.compareList, compareListMeta: s.compareListMeta}),
        }
    )
);
