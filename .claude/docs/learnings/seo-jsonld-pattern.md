# SEO & JSON-LD Pattern

## Why JSON-LD Matters

JSON-LD is structured data that search engines (Google) read to understand page content. It enables rich results — e.g. a card page might show star ratings or price info directly in Google search results.

It's injected as a `<script type="application/ld+json">` tag in the page `<head>`.

## How It's Organized in This Project

Each page type has its own builder in `lib/page-meta/`:

| File | Schema type | Used on |
|---|---|---|
| `blog-post.ts` | `BlogPosting` | Blog post pages |
| `card.ts` | `FinancialProduct` | Card detail pages |
| `bank.ts` | `FinancialService` + `ItemList` | Bank detail pages |
| `collection.ts` | `CollectionPage` + `ItemList` | Listing/category/tag pages |
| `breadcrumb.ts` | `BreadcrumbList` | All pages |

## Pattern for a Page

```tsx
// In a page component:
import { generateCardJsonLd } from '@/lib/page-meta/card';

export default async function CardPage({ params }) {
  const card = await apiFetch(`/api/v1/cards/${params.id}`);
  const jsonLd = generateCardJsonLd(card);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CardDetail card={card} />
    </>
  );
}
```

## OG Metadata

Every page also exports `generateMetadata()` for Open Graph tags (used by social media previews):

```tsx
export async function generateMetadata({ params }) {
  const card = await apiFetch(`/api/v1/cards/${params.id}`);
  return {
    title: `${card.name} | OpenWallet`,
    description: card.description,
    openGraph: { images: [card.image?.url] },
  };
}
```

## Rule

Every public page must have both JSON-LD and OG metadata. Never ship a new public page without them.
