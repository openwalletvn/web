import fs from 'fs';
import path from 'path';
import type { PageContext } from '@/lib/chat/page-context';
import { fetchSystemPrompt } from '@/lib/langfuse';
import { PERSONA_UI_META } from '@/lib/persona-model';
import { INTENT_ICON } from '@/lib/intent-model';
import { getBanks } from '@/lib/api';

export const SYSTEM_PROMPT = fs.readFileSync(
    path.join(process.cwd(), 'lib/chat/system-prompt.md'),
    'utf-8',
);

function buildStaticLists(): string {
    const personas = Object.entries(PERSONA_UI_META)
        .filter(([, m]) => !m.hidden)
        .map(([slug, m]) => `- ${slug}: ${m.name}: ${m.description} (page: /linh-vuc/${m.slug})`)
        .join('\n');

    const merchants = Object.keys(INTENT_ICON).join(', ');

    return `\n\n## Personas (use slug directly in rank-cards-for-spend)\n${personas}\n\n## Merchant/intent slugs (use directly in rank-cards-for-spend)\n${merchants}`;
}

const STATIC_LISTS = buildStaticLists();

function applyPageContext(base: string, pageContext?: PageContext): string {
    if (!pageContext) return base;
    if (pageContext.type === 'card') {
        return base + `\n\n## Ngữ cảnh trang hiện tại\nNgười dùng đang xem trang thẻ: **${pageContext.cardName}** (ngân hàng: ${pageContext.bankId}, mạng lưới: ${pageContext.cardNetwork}). Khi phù hợp, ưu tiên tư vấn về thẻ này. Dùng getCardDetail("${pageContext.cardId}") để lấy thông tin đầy đủ khi cần.`;
    }
    if (pageContext.type === 'bank') {
        return base + `\n\n## Ngữ cảnh trang hiện tại\nNgười dùng đang xem trang ngân hàng: **${pageContext.bankName}** (id: ${pageContext.bankId}). Khi phù hợp, ưu tiên tư vấn về thẻ của ngân hàng này. Dùng searchCards với bank_id="${pageContext.bankId}" để lấy danh sách thẻ.`;
    }
    return base;
}

/**
 * SSOT for the full system prompt sent to the LLM.
 * Fetches base text from Langfuse (falls back to SYSTEM_PROMPT), appends static lists, injects page context.
 * Returns prompt text + Langfuse version for tracing.
 */
async function buildBankList(): Promise<string> {
    try {
        const banks = await getBanks();
        const list = banks.map(b => `- ${b.id}: ${b.name}`).join('\n');
        return `\n\n## Banks (resolve abbreviations from this list. Do NOT call find-bank just to look up an ID)\n${list}`;
    } catch {
        return '';
    }
}

export async function getSystemPrompt(pageContext?: PageContext): Promise<{ text: string; version: number }> {
    const [{ text: langfuseText, version }, bankList] = await Promise.all([
        fetchSystemPrompt(),
        buildBankList(),
    ]);
    const base = (langfuseText || SYSTEM_PROMPT) + STATIC_LISTS + bankList;
    return { text: applyPageContext(base, pageContext), version };
}

export const REFUSAL_TEMPLATE =
    'Bạn ơi, Owie chỉ biết về thẻ ngân hàng thôi nha, câu này nằm ngoài chuyên môn của Owie rồi. Bạn có muốn Owie giúp tìm thẻ phù hợp nhu cầu chi tiêu của bạn không?';
