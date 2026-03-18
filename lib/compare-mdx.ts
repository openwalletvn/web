import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const COMPARE_DIR = path.join(process.cwd(), 'content/so-sanh');

export interface CompareFrontmatter {
    title: string;
    description: string;
    date: string;
    updated?: string;
    author?: string;
    status: 'published' | 'draft';
}

export interface CompareMdxResult {
    filename: string;
    frontmatter: CompareFrontmatter;
    content: string;
    canonical: string;
}

function getCompareFiles(): string[] {
    if (!fs.existsSync(COMPARE_DIR)) return [];
    return fs.readdirSync(COMPARE_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
}

export function getCompareMdxPairs(): string[] {
    return getCompareFiles()
        .map((f) => {
            const raw = fs.readFileSync(path.join(COMPARE_DIR, f), 'utf-8');
            const { data } = matter(raw);
            const frontmatter = data as CompareFrontmatter;
            if (frontmatter.status !== 'published') return null;
            return f.replace(/\.(mdx|md)$/, '');
        })
        .filter((p): p is string => p !== null);
}

export function lookupCompareMdx(pair: string): CompareMdxResult | null {
    const files = getCompareFiles();

    // Try direct match first
    const directFilename = files.find((f) => f.replace(/\.(mdx|md)$/, '') === pair);
    if (directFilename) {
        const raw = fs.readFileSync(path.join(COMPARE_DIR, directFilename), 'utf-8');
        const { data, content } = matter(raw);
        return {
            filename: directFilename,
            frontmatter: data as CompareFrontmatter,
            content,
            canonical: pair,
        };
    }

    // Try reversed direction (cardB-vs-cardA)
    const vsIndex = pair.indexOf('-vs-');
    if (vsIndex !== -1) {
        const reversed = `${pair.slice(vsIndex + 4)}-vs-${pair.slice(0, vsIndex)}`;
        const reversedFilename = files.find((f) => f.replace(/\.(mdx|md)$/, '') === reversed);
        if (reversedFilename) {
            const raw = fs.readFileSync(path.join(COMPARE_DIR, reversedFilename), 'utf-8');
            const { data, content } = matter(raw);
            return {
                filename: reversedFilename,
                frontmatter: data as CompareFrontmatter,
                content,
                canonical: reversed,
            };
        }
    }

    return null;
}
