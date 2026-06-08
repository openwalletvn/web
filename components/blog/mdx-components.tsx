import {slugify} from '@/lib/mdx';
import {cn} from "@/lib/utils";

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

function BlogImage({ src, alt, title, ...props }: React.ComponentProps<'img'>) {
  const caption = title || alt;
  return (
    <figure className="my-8">
      <img src={src} alt={alt} title={title} {...props} className="w-full rounded" />
      {caption && (
        <figcaption className="mt-2 text-center text-body-sm text-text-subtle italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function BlogLink({className, ...props}: React.ComponentProps<'a'>) {
    return <a className={['text-link', className].filter(Boolean).join(' ')} {...props} />;
}

function BlogPre({className, ...props}: React.ComponentProps<'pre'>) {
    return <pre
        className={cn('ow-pre ow-custom-scrollbar bg-bg-light text-text-primary rounded-md p-4 overflow-x-auto', className)} {...props} />;
}

export const mdxComponents = {
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
  h4: makeHeading('h4'),
  img: BlogImage,
    a: BlogLink,
    pre: BlogPre,
};
