'use client';

import {createContext, useContext} from 'react';
import type {Intent} from '@/lib/api';

export type IntentMap = Map<string, Intent>;

const IntentMapContext = createContext<IntentMap>(new Map());

export function IntentMapProvider({intentMap, children}: {intentMap: IntentMap; children: React.ReactNode}) {
    return <IntentMapContext.Provider value={intentMap}>{children}</IntentMapContext.Provider>;
}

export function useIntentMap(): IntentMap {
    return useContext(IntentMapContext);
}
