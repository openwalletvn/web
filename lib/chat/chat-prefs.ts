const PREFS_KEY = 'ow-chat-prefs';

type ChatPrefs = {
    lastActiveId?: string;
    modelId?: string;
};

function loadPrefs(): ChatPrefs {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(PREFS_KEY);
        return raw ? (JSON.parse(raw) as ChatPrefs) : {};
    } catch {
        return {};
    }
}

function savePrefs(prefs: ChatPrefs) {
    try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
        // quota exceeded or private browsing
    }
}

export function getChatPrefs(): ChatPrefs {
    return loadPrefs();
}

export function setChatPref<K extends keyof ChatPrefs>(key: K, value: ChatPrefs[K]) {
    const prefs = loadPrefs();
    prefs[key] = value;
    savePrefs(prefs);
}

export function clearChatPref(key: keyof ChatPrefs) {
    const prefs = loadPrefs();
    delete prefs[key];
    savePrefs(prefs);
}
