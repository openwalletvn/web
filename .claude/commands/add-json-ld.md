# Add JSON-LD structured data to a page

All JSON-LD is built in `lib/page-meta/` and rendered via `metadata.other['script:ld+json']` or a `<script type="application/ld+json">` tag in the page component.

## Existing page types

| Page type | Schema types | Builder file | Builder function |
|-----------|-------------|--------------|------------------|
| Blog post | BlogPosting + BreadcrumbList | `lib/page-meta/blog-post.ts` | `buildBlogPostPageMeta(post)` |
| Card detail | FinancialProduct + BreadcrumbList | `lib/page-meta/card.ts` | `buildCardPageMeta(card, bank)` |
| Bank detail | FinancialService + ItemList + BreadcrumbList | `lib/page-meta/bank.ts` | `buildBankPageMeta(bank, cards)` |
| Collection/listing | CollectionPage + ItemList + BreadcrumbList | `lib/page-meta/collection.ts` | `buildCollectionPageMeta({...})` |

## Pattern

Every builder returns:
```typescript
{
  metadata: Metadata;      // Next.js Metadata (title, description, OG, Twitter)
  jsonLd: object;          // JSON-LD graph
  breadcrumbItems: BreadcrumbItem[];
}
```

The JSON-LD always uses `@graph` array format:
```typescript
{
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'MainType', ... },
    buildBreadcrumbJsonLd(breadcrumbItems),
  ],
}
```

## How to add JSON-LD to a new page type

1. **Create a builder** in `lib/page-meta/<type>.ts`:
   - Import `buildBreadcrumbJsonLd` and `BreadcrumbItem` from `./breadcrumb`
   - Define an interface for the return type (metadata + jsonLd + breadcrumbItems)
   - Build the `@graph` array with the main schema type + breadcrumb
   - Use `BASE_URL = 'https://openwallet.vn'` for all URLs

2. **Use in the page component** (`page.tsx`):
   ```typescript
   import { buildXxxPageMeta } from '@/lib/page-meta/xxx';

   export async function generateMetadata(): Promise<Metadata> {
     const { metadata } = buildXxxPageMeta(...);
     return metadata;
   }

   export default function Page() {
     const { jsonLd, breadcrumbItems } = buildXxxPageMeta(...);
     return (
       <>
         <script
           type="application/ld+json"
           dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
         />
         {/* page content */}
       </>
     );
   }
   ```

3. **Breadcrumbs**: Always include. Structure:
   ```typescript
   const breadcrumbItems: BreadcrumbItem[] = [
     { label: 'Trang chu', href: '/' },
     { label: 'Section Name', href: '/section' },
     { label: 'Current Page' },  // no href for current page
   ];
   ```

## Breadcrumb helper

`lib/page-meta/breadcrumb.ts` exports:
```typescript
interface BreadcrumbItem { label: string; href?: string; }
function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): object
```

Automatically prepends `https://openwallet.vn` to all `href` values.

## Schema.org reference

Pick the right type for the content:
- Financial products -> `FinancialProduct`
- Banks/financial institutions -> `FinancialService` or `BankOrCreditUnion`
- Articles/blog posts -> `BlogPosting` or `Article`
- How-to content -> `HowTo`
- FAQ pages -> `FAQPage`
- Lists/catalogs -> `ItemList`, `CollectionPage`, `OfferCatalog`

Always validate output at https://search.google.com/test/rich-results after deployment.
