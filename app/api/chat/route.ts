import { createGroq } from '@ai-sdk/groq';
import { streamText, tool, stepCountIs, type ModelMessage } from 'ai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt';
import { apiFetch, type CardFilters } from '@/lib/api';
import { rankCards } from '@/lib/card-ranker';

// In-memory rate limit store: ip -> { count, windowStart }
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, windowStart: now });
        return true;
    }
    if (entry.count >= RATE_LIMIT_MAX) return false;
    entry.count++;
    return true;
}

function stripCard(card: Record<string, unknown>) {
    const {
        image: _i,
        sources: _s,
        card_network_data: _nd,
        contactless_methods_data: _cmd,
        co_brand_data: _cbd,
        bank_data: _bd,
        ...rest
    } = card;
    return rest;
}

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    if (!checkRateLimit(ip)) {
        return new Response(
            JSON.stringify({ error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const body = await req.json() as { messages?: ModelMessage[] };
    const allMessages: ModelMessage[] = body.messages ?? [];
    // Trim to last 12 messages
    const messages: ModelMessage[] = allMessages.slice(-12);

    const model = process.env.CHAT_MODEL ?? 'llama-3.3-70b-versatile';

    const result = streamText({
        model: groq(model),
        system: SYSTEM_PROMPT,
        messages,
        stopWhen: stepCountIs(5),
        tools: {
            searchCards: tool({
                description: 'Tìm kiếm thẻ theo bộ lọc: ngân hàng, loại thẻ, mạng lưới, mục đích sử dụng.',
                inputSchema: z.object({
                    bank_id: z.string().optional().describe('ID ngân hàng'),
                    type: z.enum(['credit', 'debit', 'prepaid', 'transit', 'atm', '2in1', 'co-branded']).optional(),
                    network: z.enum(['visa', 'mastercard', 'jcb', 'napas', 'amex', 'unionpay']).optional(),
                    intent: z.string().optional().describe('Mục đích sử dụng thẻ (ví dụ: cashback, travel, shopping)'),
                    limit: z.number().int().min(1).max(10).default(5),
                }),
                execute: async ({ bank_id, type, network, intent, limit }) => {
                    const params = new URLSearchParams();
                    if (bank_id) params.set('bank_id', bank_id);
                    if (type) params.set('type', type);
                    if (network) params.set('network', network);
                    if (intent) params.set('intent', intent);
                    const res = await apiFetch(`/api/v1/cards?${params}`);
                    const json = await res.json() as { success: boolean; data: Record<string, unknown>[] };
                    if (!json.success) throw new Error('Không thể tìm thẻ');
                    return json.data.slice(0, limit).map(stripCard);
                },
            }),

            getCardDetail: tool({
                description: 'Lấy thông tin chi tiết của một thẻ theo ID.',
                inputSchema: z.object({
                    card_id: z.string().describe('ID thẻ ngân hàng'),
                }),
                execute: async ({ card_id }) => {
                    const res = await apiFetch(`/api/v1/cards/${card_id}`);
                    const json = await res.json() as { success: boolean; data: Record<string, unknown> };
                    if (!json.success) throw new Error(`Không tìm thấy thẻ: ${card_id}`);
                    return stripCard(json.data);
                },
            }),

            rankCardsForSpend: tool({
                description: 'Xếp hạng thẻ theo hồ sơ chi tiêu hàng tháng. Trả về top thẻ tốt nhất cho nhu cầu này.',
                inputSchema: z.object({
                    spend: z.record(z.string(), z.number()).describe(
                        'Hồ sơ chi tiêu: key là tên danh mục (online, supermarket, travel, dining, fuel, v.v.), value là số tiền VND/tháng'
                    ),
                    limit: z.number().int().min(1).max(5).default(3),
                    type: z.enum(['credit', 'debit']).optional(),
                }),
                execute: async ({ spend, limit, type }) => {
                    const params = new URLSearchParams();
                    if (type) params.set('type', type);
                    const res = await apiFetch(`/api/v1/cards?${params}`);
                    const json = await res.json() as { success: boolean; data: Parameters<typeof rankCards>[0] };
                    if (!json.success) throw new Error('Không thể lấy danh sách thẻ');
                    const ranked = rankCards(json.data, spend);
                    return ranked.slice(0, limit).map(({ card, rank, result }) => ({
                        rank,
                        card: stripCard(card as unknown as Record<string, unknown>),
                        estimated_monthly_cashback: result.cashback,
                    }));
                },
            }),

            compareCards: tool({
                description: 'So sánh nhiều thẻ cùng lúc theo danh sách ID.',
                inputSchema: z.object({
                    card_ids: z.array(z.string()).min(2).max(4).describe('Danh sách ID thẻ cần so sánh (2-4 thẻ)'),
                }),
                execute: async ({ card_ids }) => {
                    const cards = await Promise.all(
                        card_ids.map(async (id) => {
                            const res = await apiFetch(`/api/v1/cards/${id}`);
                            const json = await res.json() as { success: boolean; data: Record<string, unknown> };
                            if (!json.success) throw new Error(`Không tìm thấy thẻ: ${id}`);
                            return stripCard(json.data);
                        })
                    );
                    return cards;
                },
            }),

            listBanks: tool({
                description: 'Liệt kê danh sách ngân hàng phát hành thẻ tại Việt Nam.',
                inputSchema: z.object({}),
                execute: async () => {
                    const res = await apiFetch('/api/v1/banks');
                    const json = await res.json() as { success: boolean; data: Record<string, unknown>[] };
                    if (!json.success) throw new Error('Không thể lấy danh sách ngân hàng');
                    return json.data.map(({ id, name, full_name, link, networks }) => ({ id, name, full_name, link, networks }));
                },
            }),
        },
    });

    return result.toUIMessageStreamResponse();
}
