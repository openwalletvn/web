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

function buildSlots(): Record<string, string> {
    const personas = Object.entries(PERSONA_UI_META)
        .filter(([, m]) => !m.hidden)
        .map(([slug, m]) => `- ${slug}: ${m.name}: ${m.description} (page: /linh-vuc/${m.slug})`)
        .join('\n');

    const merchants = Object.keys(INTENT_ICON).join(', ');

    return { personas, merchants };
}

function fillSlots(text: string, slots: Record<string, string>): string {
    return Object.entries(slots).reduce(
        (t, [key, val]) => t.replaceAll(`{{${key}}}`, val),
        text,
    );
}

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

/** SSOT for the full system prompt sent to the LLM. */
export async function getSystemPrompt(pageContext?: PageContext): Promise<{ text: string; version: number }> {
    const [{ text: langfuseText, version }, banks] = await Promise.all([
        fetchSystemPrompt(),
        getBanks().catch(() => []),
    ]);

    const bankList = banks.map((b: { id: string; name: string }) => `- ${b.id}: ${b.name}`).join('\n');
    const slots = { ...buildSlots(), banks: bankList };

    const baseText = langfuseText || SYSTEM_PROMPT;
    const filled = fillSlots(baseText, slots);

    return { text: applyPageContext(filled, pageContext), version };
}
