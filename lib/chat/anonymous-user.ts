const ADJECTIVES = [
    'brave', 'calm', 'clever', 'cool', 'eager', 'fast', 'gentle', 'happy',
    'keen', 'kind', 'lucky', 'merry', 'nimble', 'proud', 'quiet', 'sharp',
    'smart', 'swift', 'warm', 'wise',
];

const ANIMALS = [
    'badger', 'bear', 'beaver', 'buffalo', 'cat', 'crane', 'deer', 'dolphin',
    'eagle', 'elephant', 'falcon', 'fox', 'gecko', 'hawk', 'hedgehog', 'jaguar',
    'koala', 'leopard', 'lion', 'lynx', 'meerkat', 'monkey', 'otter', 'owl',
    'panda', 'parrot', 'penguin', 'rabbit', 'raccoon', 'raven', 'shark', 'sloth',
    'tiger', 'turtle', 'whale', 'wolf',
];

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function hex4(): string {
    return Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
}

function generateUserId(): string {
    return `${pick(ADJECTIVES)}-${pick(ANIMALS)}-${hex4()}`;
}

const USER_ID_KEY = 'ow_chat_user_id';

// Returns stable userId for this browser. Replace with auth userId when auth lands.
export function getUserId(): string {
    if (typeof window === 'undefined') return 'ssr';
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
        id = generateUserId();
        localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
}

// New sessionId per tab (not persisted).
let _sessionId: string | null = null;

export function getSessionId(): string {
    if (!_sessionId) _sessionId = crypto.randomUUID();
    return _sessionId;
}
