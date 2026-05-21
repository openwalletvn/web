import type { UIMessage } from 'ai';

const CONVOS_KEY = 'ow-chat-convos';
const LEGACY_KEY = 'ow-chat-history';

export type Conversation = {
    id: string;
    title: string;
    messages: UIMessage[];
    createdAt: number;
    updatedAt: number;
};

function extractTitle(messages: UIMessage[]): string {
    const first = messages.find((m) => m.role === 'user');
    if (!first) return 'Cuộc trò chuyện mới';
    const part = (first.parts as Array<{ type: string; text?: string }>)?.find(
        (p) => p.type === 'text',
    );
    const text = part?.text ?? '';
    return text.trim().slice(0, 45) || 'Cuộc trò chuyện mới';
}

function persist(convos: Conversation[]) {
    try {
        localStorage.setItem(CONVOS_KEY, JSON.stringify(convos));
    } catch {
        // quota exceeded or private browsing
    }
}

function load(): Conversation[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(CONVOS_KEY);
        if (raw) return JSON.parse(raw) as Conversation[];

        // migrate legacy single-conversation
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
            const msgs = JSON.parse(legacy) as UIMessage[];
            if (msgs.length > 0) {
                const migrated: Conversation = {
                    id: crypto.randomUUID(),
                    title: extractTitle(msgs),
                    messages: msgs,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                persist([migrated]);
                localStorage.removeItem(LEGACY_KEY);
                return [migrated];
            }
            localStorage.removeItem(LEGACY_KEY);
        }
        return [];
    } catch {
        return [];
    }
}

export function listConversations(): Conversation[] {
    return load().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getConversation(id: string): Conversation | undefined {
    return load().find((c) => c.id === id);
}

export function createConversation(): Conversation {
    const convo: Conversation = {
        id: crypto.randomUUID(),
        title: 'Cuộc trò chuyện mới',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    persist([convo, ...load()]);
    return convo;
}

export function saveConversation(id: string, messages: UIMessage[]) {
    const convos = load();
    const idx = convos.findIndex((c) => c.id === id);
    const updated: Conversation = {
        id,
        title: extractTitle(messages),
        messages,
        createdAt: convos[idx]?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
    };
    if (idx >= 0) {
        convos[idx] = updated;
    } else {
        convos.unshift(updated);
    }
    persist(convos);
}

export function deleteConversation(id: string): string | null {
    const remaining = load().filter((c) => c.id !== id);
    persist(remaining);
    return remaining[0]?.id ?? null;
}
