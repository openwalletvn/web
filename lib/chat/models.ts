export type ChatModel = {
    id: string;
    label: string;
    provider: string;
    free: boolean;
    default?: true;
    localOnly?: true;
};

export const CHAT_MODELS: ChatModel[] = [
    // https://openrouter.ai/poolside/laguna-m.1:free
    {
        id: 'poolside/laguna-m.1:free',
        label: 'Laguna M.1 (free)',
        provider: 'Poolside',
        free: true,
    },
    // https://openrouter.ai/nvidia/nemotron-3-super-120b-a12b:free
    {
        id: 'nvidia/nemotron-3-super-120b-a12b:free',
        label: 'Nemotron 3 Super (free)',
        provider: 'NVIDIA',
        free: true,
        default: true,
    },
    // https://openrouter.ai/qwen/qwen3-coder:free
    {
        id: 'qwen/qwen3-coder:free',
        label: 'Qwen3 Coder 480B A35B (free)',
        provider: 'Qwen',
        free: true,
    },
    // https://openrouter.ai/openai/gpt-oss-120b:free
    {
        id: 'openai/gpt-oss-120b:free',
        label: 'gpt-oss-120b (free)',
        provider: 'OpenAI',
        free: true,
    },
    // Paid — dev only for testing
    {
        id: 'openai/gpt-4o-mini',
        label: 'GPT-4o mini',
        provider: 'OpenAI',
        free: false,
        localOnly: true,
    },
    {
        id: 'anthropic/claude-3-5-haiku',
        label: 'Claude 3.5 Haiku',
        provider: 'Anthropic',
        free: false,
        localOnly: true,
    },
];

export function getDefaultModel(): ChatModel {
    return CHAT_MODELS.find((m) => m.default) ?? CHAT_MODELS[0];
}

export function getVisibleModels(): ChatModel[] {
    const isDev = process.env.NODE_ENV === 'development';
    return CHAT_MODELS.filter((m) => isDev || !m.localOnly);
}

export function isAllowedModel(id: string | undefined): boolean {
    if (!id) return false;
    const isDev = process.env.NODE_ENV === 'development';
    return CHAT_MODELS.some((m) => m.id === id && (isDev || !m.localOnly));
}
