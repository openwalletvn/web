import type {Meta, StoryObj} from '@storybook/nextjs-vite';

const meta: Meta = {
  title: 'OW UI/Typography',
  parameters: {
    controls: { hideNoControlsWarning: true },
    docs: {
      description: {
        component:
          'Type scale from `app/typography.css`. Headings use `--font-display`. Body/label/numeral use `--font-body`. Never use Tailwind `text-*` on `h1`–`h6`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

const headings = [
  { tag: 'h1', cls: 'heading-1', label: 'Heading 1', note: '40px → 72px xl' },
  { tag: 'h2', cls: 'heading-2', label: 'Heading 2', note: '31px → 56px xl' },
  { tag: 'h3', cls: 'heading-3', label: 'Heading 3', note: '23px → 42px xl' },
  { tag: 'h4', cls: 'heading-4', label: 'Heading 4', note: '20px → 36px xl' },
  { tag: 'h5', cls: 'heading-5', label: 'Heading 5', note: '17px → 30px xl' },
  { tag: 'h6', cls: 'heading-6', label: 'Heading 6', note: '14px → 26px xl' },
];

const bodyScales = [
  { cls: 'text-body-lg', label: 'Body LG', note: '22px / 500 / 130%' },
  { cls: 'text-body-md', label: 'Body MD', note: '18px / 500 / 130%' },
  { cls: 'text-body', label: 'Body', note: '16px / 500 / 130%' },
  { cls: 'text-body-sm', label: 'Body SM', note: '14px / 500 / 130%' },
  { cls: 'text-label', label: 'Label', note: '12px / 600 / uppercase / ls 1px' },
  { cls: 'text-numeral', label: 'Numeral', note: '24px / 700 / 100%' },
  { cls: 'text-numeral-sm', label: 'Numeral SM', note: '20px / 700 / 100%' },
  { cls: 'text-link', label: 'Link', note: 'Red / underline / hover opacity' },
];

const sample = 'Việt Nam Ơi — OpenWallet';

function Row({ tag, cls, label, note }: { tag: string; cls: string; label: string; note: string }) {
  const Tag = tag as keyof JSX.IntrinsicElements;
  return (
    <div className="flex items-baseline gap-6 border-b border-border py-4">
      <div className="w-40 shrink-0">
        <span className="text-label text-muted-foreground">{label}</span>
        <div className="text-body-sm text-muted-foreground opacity-60 mt-1 normal-case tracking-normal font-sans">.{cls}</div>
        <div className="text-body-sm text-muted-foreground opacity-60 normal-case tracking-normal font-sans">{note}</div>
      </div>
      <Tag className={cls}>{sample}</Tag>
    </div>
  );
}

export const Headings: Story = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <p className="text-label text-muted-foreground mb-6">Display font · responsive scale</p>
      {headings.map((h) => (
        <Row key={h.cls} tag={h.tag} cls={h.cls} label={h.label} note={h.note} />
      ))}
    </div>
  ),
};

export const BodyScale: Story = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <p className="text-label text-muted-foreground mb-6">Body font · fixed scale</p>
      {bodyScales.map((s) => (
        <div key={s.cls} className="flex items-baseline gap-6 border-b border-border py-4">
          <div className="w-40 shrink-0">
            <span className="text-label text-muted-foreground">{s.label}</span>
            <div className="text-body-sm text-muted-foreground opacity-60 mt-1 normal-case tracking-normal font-sans">.{s.cls}</div>
            <div className="text-body-sm text-muted-foreground opacity-60 normal-case tracking-normal font-sans">{s.note}</div>
          </div>
          <span className={s.cls}>{sample}</span>
        </div>
      ))}
    </div>
  ),
};
