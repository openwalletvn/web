'use client'

import { createStore, useStore } from 'zustand'
import { createContext, useContext, useRef } from 'react'
import type { UserDbRow, TierRow } from '@/lib/neon-db'

export interface AuthUser {
    id: string
    email: string
    name: string | null
}

interface UserState {
    user: AuthUser | null
    tier: string
    canUsePaidModel: boolean
    bonusCredits: number
    traceId: string | null
    isOutOfCredits: boolean
    isLoaded: boolean
}

interface UserActions {
    setUser: (user: AuthUser | null, dbData: UserDbRow | null, tierData: TierRow | null) => void
}

export type UserStore = UserState & UserActions

const defaultState: UserState = {
    user: null,
    tier: 'free',
    canUsePaidModel: false,
    bonusCredits: 0,
    traceId: null,
    isOutOfCredits: true,
    isLoaded: false,
}

export function createUserStore() {
    return createStore<UserStore>((set) => ({
        ...defaultState,
        setUser: (user, dbData, tierData) => set({
            user,
            tier: dbData?.tier ?? 'free',
            canUsePaidModel: tierData?.can_use_paid_model ?? false,
            bonusCredits: dbData ? Number(dbData.bonus_credits) : 0,
            traceId: dbData?.trace_id ?? null,
            isOutOfCredits: dbData ? Number(dbData.bonus_credits) === 0 : true,
            isLoaded: true,
        }),
    }))
}

export type UserStoreApi = ReturnType<typeof createUserStore>

export const UserStoreContext = createContext<UserStoreApi | null>(null)

export function useUserStore<T>(selector: (state: UserStore) => T): T {
    const store = useContext(UserStoreContext)
    if (!store) throw new Error('useUserStore must be used inside UserStoreProvider')
    return useStore(store, selector)
}

export const traceId = { current: null as string | null }
