# Persona Page

Create or update a `/the-theo-nhu-cau/<slug>` page with data-driven, SEO-optimized Vietnamese content.

## Usage

```
/persona-page [slug]
```

Example: `/persona-page sieu-thi`

If no slug given, ask which persona page to create or update.

## Step 0 — Detect mode

Check if `app/(marketing)/(persona)/the-theo-nhu-cau/<slug>/page.tsx` exists.

- **Exists** → UPDATE mode: skip to Step 1
- **Missing** → CREATE mode: run Step 0A first, then continue from Step 1

## Step 0A — Scaffold new page (CREATE mode only)

1. Read `lib/persona-model.ts` to find the matching persona entry for the slug. Extract `personaSlug` (API slug, e.g. `groceries`) and display name.
2. Create `app/(marketing)/(persona)/the-theo-nhu-cau/<slug>/page.tsx` using this template:

```tsx
import type {Metadata} from 'next';
import {getCards} from '@/lib/api';
import {generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {PersonaPage} from '../persona-page';

const L = ({href, children}: {href: string; children: string}) => (
    <a href={href} className="text-link">{children}</a>
);

const CONFIG: IntentCategoryConfig = {
    title: '<Title>',
    description: '<meta description — 1-2 sentences, SEO-optimized>',
    url: '/the-theo-nhu-cau/<slug>',
    personaSlug: '<personaSlug>',
    rankingTitle: 'Xếp hạng thẻ theo cashback <category>',
    intro: '<placeholder>',
    faqs: [],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ theo nhu cầu', href: '/the-theo-nhu-cau'},
        {label: '<Title>'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default function <PascalSlug>CardsPage() {
    return <PersonaPage config={CONFIG}/>;
}
```

Fill in `title`, `description`, `url`, `personaSlug`, `rankingTitle`, `breadcrumbItems` from known data. Leave `intro` and `faqs` as placeholders — they will be filled in Steps 5 and 6.

## Step 1 — Read the page

Read `app/(marketing)/(persona)/the-theo-nhu-cau/<slug>/page.tsx`. Extract:
- `personaSlug` (e.g. `groceries`)
- `title` (e.g. `Thẻ Siêu Thị`)
- Current `intro` and `faqs`

## Step 2 — Upgrade component for HTML links

**Always do this first.** Read `components/marketing/category-seo-section.tsx`.

Both `PersonaIntro` and `PersonaFAQ` must render via `dangerouslySetInnerHTML={{__html: ...}}` instead of plain `{intro}` / `{a}`. If already upgraded, skip. If not, apply the change now before writing content.

Card links in content use: `<a href="/the/<card-id>" className="text-link">Card Name</a>` — use the `text-link` utility from `app/typography.css`, never inline styles or multi-class chains. where `card-id` is the `id` field from the API.

## Step 3 — Fetch live data from local API

**Always use local API at port 8000:**

```bash
source .env.local
KEY=$(grep OPENWALLET_API_KEY .env.local | cut -d'=' -f2)
curl -s "http://localhost:8000/api/v1/cards?persona=<personaSlug>" \
  -H "X-OpenWallet-Key: $KEY"
```

For each card that has a cashback rule matching the persona's intent, extract:
- `id`, `name`, `card_network`
- `fees.annual.amount`, `fees.annual.subsequent_years.waiver`
- From the matching rule: `rate`, `rate_max`, `cap.amount`, `cap_max.amount`, `tiers[]`

## Step 4 — Compute spend-tier rankings

Compute cashback earned (VND) at these spend levels: **5M, 8M, 10M, 20M, 30M, 50M** (skip higher tiers if no card has relevant breakpoints there).

**Computation:**
- If card has `tiers`: find highest `min_spend` ≤ actual spend, use that tier's `rate` and `cap`
- `cashback = min(spend × rate, cap)` — if rule `cap` is null, treat as uncapped **for this rule only** (cards may still have a global monthly cap not in the rule data)
- Rank cards by cashback descending per spend level

Identify **crossover points** — spend levels where ranking changes. These are the most valuable insight for users.

Example output:
```
5M:  Card A 300K > Card B 250K > Card C 200K
8M:  Card B 400K > Card A 300K > Card C 300K   ← crossover at ~8M
20M: Card B 700K > Card C 600K > Card A 300K
30M: Card C 1500K (no per-category cap) > Card B 900K > Card A 300K  ← crossover at 30M
```

## Step 5 — Write new intro

Target: **at least 4 sentences.** The intro must answer: **"What does this page have, and should I keep reading?"**

Must include:
- Primary SEO keyword: `thẻ hoàn tiền [category]` or `thẻ [category]` in first sentence — do NOT use "tốt nhất" or "best"
- Qualify with "dựa theo dữ liệu mới nhất mà chúng tôi có" or "theo dữ liệu hiện tại của OpenWallet"
- Rate range from pool (e.g. "từ 1% đến 20%")
- General structural insight from the data: cap range, min-spend patterns, tiered structure prevalence — things that stay true even as rankings shift
- A concrete reason the reader should use the table (what decision it helps them make)
- A disclaimer sentence: e.g. "Hãy kiểm tra chính sách của ngân hàng để có thông tin chính xác nhất trước khi quyết định."

Do NOT:
- Use superlatives: "tốt nhất", "số 1", "hàng đầu", "best", "top" as absolute claims
- Name specific cards in the intro — rankings change and the intro will become stale
- Explain ranking mechanics ("thứ hạng thay đổi theo ngân sách") — that's inside baseball, not a user benefit
- Use static pool counts ("X thẻ") — pool size changes
- Use em dashes

Tone: professional, honest, humble. Use "chúng tôi" if referring to the site. Frame all claims as current data, not permanent truth.

**Pattern:**
> [What this page is + SEO keyword + data qualifier] + [rate range] + [structural insight about this category's cashback conditions] + [what the reader should do next / what the table helps them decide] + [disclaimer to check bank policy].

## Step 6 — Write new FAQs

**5 required FAQs (fixed order), plus 1-2 optional flex FAQs. Total: 5-8.**

### Q1 — How to use the top card optimally (REQUIRED, position: 1st or 3rd)

Question: "Dùng [Top1Card] như thế nào cho tối ưu?"

- Top1Card = the card ranked #1 at the default spend tier (Q2 below)
- Answer: the key conditions to maximize cashback — min spend threshold, cap, any registration required, tiered structure if applicable
- Include a concrete tip: e.g. "Chi đủ X triệu để lên bậc Y, hoàn tăng từ A lên B VND"
- Link the card name

### Q2 — Normal spend bracket (REQUIRED)

Question: "Chi khoảng [default_spend] tại [category] mỗi tháng, dùng thẻ nào?"

- `default_spend` = the lowest spend tier where a card's cashback rule first activates (usually 3 triệu, unless the top-ranked card requires higher min spend — use that instead)
- Answer: name the top 1-2 cards at this spend level with links and actual cashback VND amounts
- Example: "Chi 3 triệu/tháng, [Card A] hoàn khoảng 150.000 VND (5%), [Card B] hoàn 60.000 VND (2%). [Card A] phù hợp nhất ở mức chi tiêu này."

### Q2 — High spend bracket (REQUIRED)

Question: "Chi [high_spend] tại [category] mỗi tháng, thẻ nào hoàn nhiều nhất?"

- `high_spend` = pick the most interesting crossover point from Step 3 analysis: 20M, 50M, or 100M — whichever is where rankings meaningfully flip or where per-category uncapped cards start dominating
- For personas with high-volume use cases (ads spend, resellers on Shopee, business purchases): use 50M or 100M as high_spend
- Answer: name top 1-2 cards at this spend with links and actual cashback amounts. Note if a card has no per-category cap so users understand why it dominates at high spend — but never claim the card has no cap at all (global monthly caps always exist).
- Example: "Chi 50 triệu/tháng, [Card C] không ghi nhận trần theo danh mục nên đạt khoảng 1.500.000 VND theo dữ liệu hiện tại, vượt xa [Card B] bị giới hạn ở 900.000 VND. Xác nhận trần hoàn tổng thẻ với ngân hàng trước khi sử dụng."

### Q3 — Max cashback rate (REQUIRED)

Question: "Thẻ [category] nào hoàn tiền cao nhất hiện tại?"

- Name highest-rate card with link, state the rate, note its cap (the catch)
- Clarify that high rate ≠ most cash back at all spend levels — direct to table

### Q4 — Max cashback ceiling (REQUIRED)

Question: "Mức hoàn tiền tối đa hàng tháng là bao nhiêu?"

- State the range from data (e.g. 200.000-1.000.000 VND)
- Name the card with the highest per-category cap with a link; if a card has no per-category cap in the data, say "không ghi nhận trần theo danh mục" — never say "không có trần hoàn"
- Mention tiered cards if relevant

### Q5 — Free annual fee (REQUIRED)

Question: "Thẻ [category] nào miễn phí thường niên?"

- Name cards with 0 annual fee or full waiver with links
- If none exist, say so and mention the lowest-fee option

### Flex FAQs (1-2, choose what's most useful from data)

Pick from these based on what the data actually supports:
- **Scope Q**: does cashback apply at related merchant types (convenience stores, online, ride-hailing, etc.)
- **Activation/conditions Q**: register or min-spend requirements
- **Tiered spend Q**: explain how bậc chi tiêu works if multiple tiered cards exist
- **Debit vs credit Q**: if pool has both types
- **Interesting data insight**: something surprising from the data — e.g. a card with a very high cap but low rate that beats high-rate cards at a specific spend, or a card that covers an unexpected category

Rules:
- No em dashes
- **Never claim a card has no cap** — the API only stores per-category caps; every card has a global monthly cap. If `cap` is null in the rule data, say "không ghi nhận trần theo danh mục" or "không có trần danh mục trong dữ liệu hiện tại", never "không có trần hoàn" or "không giới hạn".
- No superlatives ("tốt nhất", "số 1", "hàng đầu") as absolute claims — replace with "dựa theo dữ liệu của OpenWallet", "theo dữ liệu hiện tại", "trong pool thẻ chúng tôi tổng hợp"
- Answers 1-3 sentences, self-contained
- **Always name specific cards with links in Q1-Q5** — `<a href="/the/<id>" className="text-link">Name</a>`. Define a local `const L` component at the top of the page file.
- Frame amounts as current estimates: "hiện tại", "khoảng", "theo dữ liệu chúng tôi có" — not as permanent facts
- End Q1-Q5 answers with a soft disclaimer where appropriate: "Hãy kiểm tra điều kiện của ngân hàng để biết thêm thông tin chính xác." or "Chính sách có thể thay đổi, nên xác nhận với ngân hàng trước khi đăng ký."
- SEO: naturally include "thẻ tín dụng [category]", "hoàn tiền [category]", "chi [X] triệu [category] hoàn bao nhiêu", "thẻ cashback [category]"

**Card mention balance (REQUIRED):**
- Top 1-2 cards combined should appear in no more than 40% of FAQs — not every answer
- Each FAQ beyond Q1 should try to feature a different card or at least a different angle
- Lower-ranked cards must appear in at least 1-2 FAQs where their data genuinely supports it (e.g. no-cap card for high spend, free annual fee card, high rate card)
- If reviewing the full FAQ set and one card appears in 4+ answers: redistribute — find another card that fits each context
- Goal: a reader should learn about 3-5 different cards across the full FAQ set, not feel like they're reading an ad for one card

## Step 7 — Show diff for approval

Show before/after of `intro` and `faqs` as readable diff. Wait for user approval before writing.

## Step 8 — Apply changes

Edit only `intro` and `faqs` in the `CONFIG` object. Do not touch `title`, `description`, `url`, `personaSlug`, `rankingTitle`, or `breadcrumbItems`.

In CREATE mode, also fill in the scaffold's `title`, `description`, `url`, `personaSlug`, `rankingTitle`, `breadcrumbItems` — these were placeholders from Step 0A.
