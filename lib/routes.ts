export const ROUTES = {
    home: '/',

    // Main sections
    cards: '/the',
    banks: '/ngan-hang',
    blog: '/tin-tuc',
    cardTypes: '/loai-the',

    // Tools
    cardBattle: '/card-battle',
    cardMatch: '/card-match',
    chat: '/chat',         // full chat app (app/(chat)/chat/page.tsx)
    owieChat: '/owie-chat', // Owie landing/info page (marketing)
    openwalletMcp: '/mcp',
    openwalletApp: '/openwallet-app',

    // Info pages
    changelog: '/changelog',
    contact: '/lien-he',
    terms: '/dieu-khoan',
    privacy: '/chinh-sach-bao-mat',
    disclaimer: '/mien-tru-trach-nhiem',
    docs: '/docs',

    // Wallet app (feature-gated)
    app: '/app',
    appMyCards: '/app/my-cards',
    appAdd: '/app/add',
    appSettings: '/app/settings',

    // Dynamic routes
    card: (slug: string) => `/the/${slug}`,
    bank: (slug: string) => `/ngan-hang/${slug}`,
    blogPost: (slug: string) => `/tin-tuc/${slug}`,
    blogTag: (tag: string) => `/tin-tuc/tag/${tag}`,
    blogCategory: (category: string) => `/tin-tuc/category/${category}`,
    cardBattlePair: (pair: string) => `/card-battle/${pair}`,
    personaPage: (slug: string) => `/linh-vuc/${slug}`,
    cardTypePage: (slug: string) => `/loai-the/${slug}`,
    myCard: (walletCardId: string) => `/app/my-cards/detail?id=${walletCardId}`,
} as const

/** @deprecated use ROUTES.myCard */
export const getMyCardUrl = ROUTES.myCard
