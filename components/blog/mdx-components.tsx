import { slugify } from '@/lib/mdx';

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in (children as object)) {
    return extractText((children as { props: { children?: React.ReactNode } }).props.children);
  }
  return '';
}

function makeHeading(Tag: 'h2' | 'h3' | 'h4') {
  return function Heading({ children, ...props }: React.ComponentProps<'h2'>) {
    const id = slugify(extractText(children));
    return <Tag id={id} {...props}>{children}</Tag>;
  };
}

function BlogImage({ src, alt, title, ...props }: React.ComponentProps<'img'>) {
  const caption = title || alt;
  return (
    <figure className="my-8">
      <img src={src} alt={alt} title={title} {...props} className="w-full rounded-sm" />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const mdxComponents = {
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
  h4: makeHeading('h4'),
  img: BlogImage,
};
