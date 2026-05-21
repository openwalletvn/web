import { createGroq } from '@ai-sdk/groq';
import { streamText, tool, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { z } from 'zod';
import { buildSystemPrompt } from '@/lib/chat/system-prompt';
import type { PageContext } from '@/lib/chat/page-context';
import { apiFetch, type CardFilters } from '@/lib/api';

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

    const body = await req.json() as { messages?: UIMessage[]; pageContext?: PageContext };
    const uiMessages: UIMessage[] = body.messages ?? [];
    // Trim to last 12 messages, then convert UIMessage → ModelMessage
    const messages = await convertToModelMessages(uiMessages.slice(-12));

    const model = process.env.CHAT_MODEL ?? 'llama-3.3-70b-versatile';

    const result = streamText({
        model: groq(model),
        system: buildSystemPrompt(body.pageContext),
        messages,
        stopWhen: stepCountIs(5),
        tools: {
            searchCards: tool({
                description: 'Tìm kiếm thẻ theo bộ lọc. Dùng để tìm thẻ theo ngân hàng, loại hoặc mạng lưới. KHÔNG dùng để tư vấn thẻ tốt nhất cho chi tiêu — dùng rankCardsForSpend thay thế.',
                inputSchema: z.object({
                    bank_id: z.string().optional().describe('ID ngân hàng (ví dụ: vietcombank, techcombank, vpbank)'),
                    type: z.enum(['credit', 'debit', 'prepaid', 'transit', 'atm', '2in1', 'co-branded']).optional(),
                    network: z.enum(['visa', 'mastercard', 'jcb', 'napas', 'amex', 'unionpay']).optional(),
                    intent: z.string().optional().describe('Slug mục đích sử dụng. Các giá trị hợp lệ: shopee, lazada, tiktok-shop, tiki, ecommerce, grab, grab-food, be, transport, dining, vietnam-airlines, vietjet, bamboo-airways, agoda, booking, travel, groceries, bach-hoa-xanh, winmart, shopping, digital, netflix, spotify, insurance, education, health, utilities, fuel, entertainment'),
                    limit: z.number().int().min(1).max(20).default(5),
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
                description: 'CÔNG CỤ CHÍNH để tư vấn thẻ tốt nhất cho chi tiêu. Dùng khi người dùng hỏi "thẻ nào hoàn tiền tốt", "thẻ nào tốt nhất cho chi tiêu X". Xếp hạng tất cả thẻ theo hồ sơ chi tiêu thực tế. Quan trọng: spend phải có ít nhất một key với giá trị > 0.',
                inputSchema: z.object({
                    spend: z.object({
                        ecommerce:  z.number().optional().describe('Mua sắm online / TMĐT (VND/tháng)'),
                        groceries:  z.number().optional().describe('Siêu thị (VND/tháng)'),
                        dining:     z.number().optional().describe('Ăn uống / nhà hàng (VND/tháng)'),
                        transport:  z.number().optional().describe('Di chuyển / taxi / grab (VND/tháng)'),
                        travel:     z.number().optional().describe('Du lịch (VND/tháng)'),
                        fuel:       z.number().optional().describe('Xăng dầu (VND/tháng)'),
                        digital:    z.number().optional().describe('Dịch vụ số / streaming (VND/tháng)'),
                        shopping:   z.number().optional().describe('Mua sắm chung (VND/tháng)'),
                    }).describe('Hồ sơ chi tiêu — điền danh mục phù hợp, ít nhất 1 danh mục > 0'),
                    limit: z.number().int().min(1).max(5).default(3),
                    type: z.enum(['credit', 'debit']).optional(),
                }),
                execute: async ({ spend, limit, type }) => {
                    const res = await apiFetch('/api/v1/cards/rank', {
                        method: 'POST',
                        body: JSON.stringify({ spend, limit, type }),
                    });
                    const json = await res.json() as { success: boolean; data: unknown; error?: string };
                    if (!json.success) throw new Error(json.error ?? 'Không thể xếp hạng thẻ');
                    return json.data;
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
