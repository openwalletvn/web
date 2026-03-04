import fs from 'fs';
import path from 'path';

const CHANGELOG_PATH = path.join(process.cwd(), 'content/changelog.mdx');

export interface ChangelogEntry {
  date: string;
  title: string;
  content: string;
}

/**
 * Parse a single changelog.mdx file.
 * Each entry is an `## YYYY-MM-DD | Title` heading followed by a bullet list.
 */
export function getAllChangelogs(): ChangelogEntry[] {
  if (!fs.existsSync(CHANGELOG_PATH)) return [];

  const raw = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const entries: ChangelogEntry[] = [];

  // Split on ## headings, keeping the heading text
  const sections = raw.split(/^## /m).slice(1); // skip content before first ##

  for (const section of sections) {
    const newlineIdx = section.indexOf('\n');
    if (newlineIdx === -1) continue;

    const heading = section.slice(0, newlineIdx).trim();
    const content = section.slice(newlineIdx + 1).trim();

    // Parse "YYYY-MM-DD | Title"
    const match = heading.match(/^(\d{4}-\d{2}-\d{2})\s*\|\s*(.+)$/);
    if (!match) continue;

    entries.push({
      date: match[1],
      title: match[2].trim(),
      content,
    });
  }

  return entries;
}
