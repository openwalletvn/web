'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import {
    createUserStore,
    UserStoreContext,
    traceId,
    type UserStoreApi,
    type AuthUser,
} from '@/lib/stores/user-store'
import type { UserDbRow, TierRow } from '@/lib/neon-db'

interface Props {
    initialUser: AuthUser | null
    initialDbUser: UserDbRow | null
    initialTier: TierRow | null
    children: ReactNode
}

export function UserStoreProvider({ initialUser, initialDbUser, initialTier, children }: Props) {
    const storeRef = useRef<UserStoreApi | null>(null)
    if (!storeRef.current) {
        storeRef.current = createUserStore()
    }

    useEffect(() => {
        storeRef.current!.getState().setUser(initialUser, initialDbUser, initialTier)
        traceId.current = initialDbUser?.trace_id ?? null
    }, [initialUser, initialDbUser, initialTier])

    return (
        <UserStoreContext.Provider value={storeRef.current}>
            {children}
        </UserStoreContext.Provider>
    )
}
