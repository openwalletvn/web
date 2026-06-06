export type ChatModel = {
    id: string;
    label: string;
    provider: string;
    free: boolean;
    contextWindow: number;
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
        contextWindow: 262_000,
    },
    // https://openrouter.ai/nvidia/nemotron-3-super-120b-a12b:free
    // policy issue
    // {
    //     id: 'nvidia/nemotron-3-super-120b-a12b:free',
    //     label: 'NVIDIA Nemotron 3 Super (free)',
    //     provider: 'NVIDIA',
    //     free: true,
    //     default: true,
    //     contextWindow: 1_000_000,
    // },
    // https://openrouter.ai/nvidia/nemotron-3.5-content-safety:free
    {
        id: 'nvidia/nemotron-3.5-content-safety:free',
        label: 'NVIDIA: Nemotron 3.5 Content Safety',
        provider: 'NVIDIA',
        free: true,
        contextWindow: 128_000,
    },
    // https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free
    {
        id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        label: 'NVIDIA: Nemotron 3 Ultra',
        provider: 'NVIDIA',
        free: true,
        contextWindow: 1_000_000,
    },
    // https://openrouter.ai/qwen/qwen3-coder:free
    // policy issue
    // {
    //     id: 'qwen/qwen3-coder:free',
    //     label: 'Qwen3 Coder 480B A35B (free)',
    //     provider: 'Qwen',
    //     free: true,
    //     contextWindow: 1_000_000,
    // },
    // https://openrouter.ai/openai/gpt-oss-120b:free
    {
        id: 'openai/gpt-oss-120b:free',
        label: 'OpenAI gpt-oss-120b (free)',
        provider: 'OpenAI',
        free: true,
        contextWindow: 131_000,
        default: true
    },
    // https://openrouter.ai/google/gemma-4-31b-it:free
    // policy issue
    // {
    //     id: 'google/gemma-4-31b-it:free',
    //     label: 'Google: Gemma 4 31B',
    //     provider: 'Google',
    //     free: true,
    //     contextWindow: 262_000,
    // },
    // Paid - dev only for testing
    // {
    //     id: 'openai/gpt-4o-mini',
    //     label: 'GPT-4o mini',
    //     provider: 'OpenAI',
    //     free: false,
    //     localOnly: true,
    //     contextWindow: 128_000,
    // }
];

export function getDefaultModel(): ChatModel {
    return CHAT_MODELS.find((m) => m.default) ?? CHAT_MODELS[0];
}

export function getModelById(id: string): ChatModel | undefined {
    return CHAT_MODELS.find((m) => m.id === id);
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
