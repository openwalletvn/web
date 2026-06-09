import {slugify} from '@/lib/mdx';
import {cn} from "@/lib/utils";
import {OwButton} from '@/components/ow-ui/ow-button';

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in (children as object)) {
    return extractText((children as { props: { children?: React.ReactNode } }).props.children);
  }
  return '';
}

const headingClass: Record<'h2' | 'h3' | 'h4', string> = {
    h2: 'heading-2 mt-10 mb-2',
    h3: 'heading-3 mt-8 mb-2',
    h4: 'heading-4 mt-8 mb-2',
};

function makeHeading(Tag: 'h2' | 'h3' | 'h4') {
    return function Heading({children, className, ...props}: React.ComponentProps<'h2'>) {
    const id = slugify(extractText(children));
        return (
            <Tag id={id} className={cn("mt-8 mb-2", headingClass[Tag], className)} {...props}>
                {children}
            </Tag>
        );
  };
}

function BlogImage({ src, alt, title, slug = '', ...props }: React.ComponentProps<'img'> & { slug?: string }) {
  const caption = title || alt;
  const resolvedSrc = resolveImageSrc(src, slug);
  return (
      <span className="ow-mdx-image my-8 block lg:-mx-20">
      <img src={resolvedSrc} alt={alt} title={title} {...props} className="w-full ow-rounded-small border !my-0"/>
      {caption && (
          <span className="mt-2 block text-center text-body-sm text-text-subtle italic">
          {caption}
        </span>
      )}
    </span>
  );
}

function BlogContactButton() {
  return (
    <OwButton asChild color="primary">
      <a href="/lien-he">Liên hệ với OpenWallet</a>
    </OwButton>
  );
}

function resolveImageSrc(src: string | Blob | undefined, slug: string): string | undefined {
  if (src instanceof Blob) return undefined;
  if (!src) return src;
  if (src.startsWith('/') || src.startsWith('http')) return src;
  return `/images/posts/${slug}/${src}`;
}

export function BlogInlineImage({ src, alt, title, slug = '', ...props }: React.ComponentProps<'img'> & { slug?: string }) {
  const caption = title || alt;
  const resolvedSrc = resolveImageSrc(src, slug);
  return (
      <span className="ow-mdx-inline-image block">
      <img src={resolvedSrc} alt={alt} title={title} {...props} className="ow-rounded-small border !my-0"/>
      {caption && (
          <span className="mt-2 block text-center text-body-sm text-text-subtle italic">
          {caption}
        </span>
      )}
    </span>
  );
}

function BlogLink({className, ...props}: React.ComponentProps<'a'>) {
    return <a className={['text-link', className].filter(Boolean).join(' ')} {...props} />;
}

function BlogPre({className, ...props}: React.ComponentProps<'pre'>) {
    return <pre
        className={cn('ow-mdx-pre ow-custom-scrollbar bg-bg-light text-text-primary rounded-md p-4 overflow-x-auto', className)} {...props} />;
}

function BlogTable({className, ...props}: React.ComponentProps<'table'>) {
    return (
        <div className="ow-mdx-table-wrapper my-6 overflow-x-auto ow-custom-scrollbar">
            <table className={cn('w-full border-collapse text-body-sm !my-0 min-w-[420px]', className)} {...props} />
        </div>
    );
}

function BlogThead({className, ...props}: React.ComponentProps<'thead'>) {
    return <thead className={cn('bg-bg-light', className)} {...props} />;
}

function BlogTh({className, ...props}: React.ComponentProps<'th'>) {
    return <th className={cn('border-y border-border px-4 py-2 text-left font-semibold text-text-primary', className)} {...props} />;
}

function BlogTd({className, ...props}: React.ComponentProps<'td'>) {
    return <td className={cn('border-y border-border px-4 py-2 text-text-secondary', className)} {...props} />;
}

function BlogTr({className, ...props}: React.ComponentProps<'tr'>) {
    return <tr className={cn('even:bg-bg-light/50', className)} {...props} />;
}

export function makeMdxComponents(slug: string) {
  return {
    BlogInlineImage: (props: React.ComponentProps<'img'>) => <BlogInlineImage {...props} slug={slug} />,
    BlogContactButton,
    h2: makeHeading('h2'),
    h3: makeHeading('h3'),
    h4: makeHeading('h4'),
    img: (props: React.ComponentProps<'img'>) => <BlogImage {...props} slug={slug} />,
    a: BlogLink,
    pre: BlogPre,
    table: BlogTable,
    thead: BlogThead,
    th: BlogTh,
    td: BlogTd,
    tr: BlogTr,
  };
}

export const mdxComponents = makeMdxComponents('');
