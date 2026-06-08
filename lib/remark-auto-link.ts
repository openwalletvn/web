import { findAndReplace } from 'mdast-util-find-and-replace';
import type { Plugin } from 'unified';
import type { Root, Link, Text } from 'mdast';
import { AUTO_LINKS } from './auto-links';

/**
 * Remark plugin that auto-links first occurrences of known keywords.
 *
 * - Only the first match of each keyword per post is linked.
 * - Skips text inside existing links, headings, code blocks, and inline code
 *   (mdast-util-find-and-replace handles this via `ignore` option).
 * - Skips keywords that are already manually linked in the source.
 */
export const remarkAutoLink: Plugin<[], Root> = () => (tree) => {
  // Track which keywords have already been linked in this document.
  const linked = new Set<string>();

  const replacements: [RegExp, (match: string) => Link | Text | false][] =
    AUTO_LINKS.map(([keyword, url]) => {
      // Escape special regex characters in the keyword.
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Word boundaries that cover ASCII and Vietnamese Unicode chars
      const pattern = new RegExp(`(?<![\\w\\u00C0-\\u1EF9])${escaped}(?![\\w\\u00C0-\\u1EF9])`);

      return [
        pattern,
        (match: string) => {
          if (linked.has(keyword)) return false; // already linked - leave as-is
          linked.add(keyword);
          const linkNode: Link = {
            type: 'link',
            url,
            children: [{ type: 'text', value: match }],
          };
          return linkNode;
        },
      ];
    });

  findAndReplace(tree, replacements, {
    // Don't touch text inside these node types.
    ignore: ['link', 'linkReference', 'heading', 'code', 'inlineCode'],
  });
};
