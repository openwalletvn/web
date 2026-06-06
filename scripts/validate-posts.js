#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// gray-matter not available at script time, use manual frontmatter parse
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const lines = match[1].split('\n');
  const result = {};
  let currentKey = null;
  let inArray = false;
  let arrayItems = [];

  for (const line of lines) {
    const arrayItem = line.match(/^  - (.+)$/);
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);

    if (inArray && arrayItem) {
      arrayItems.push(arrayItem[1].replace(/^["']|["']$/g, ''));
      continue;
    } else if (inArray && !arrayItem) {
      result[currentKey] = arrayItems;
      inArray = false;
      arrayItems = [];
    }

    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val === '') {
        inArray = true;
        arrayItems = [];
      } else {
        result[currentKey] = val.replace(/^["']|["']$/g, '');
      }
    }
  }
  if (inArray) result[currentKey] = arrayItems;
  return result;
}

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const REQUIRED_FIELDS = ['title', 'description', 'date', 'category', 'tags', 'status'];
const VALID_STATUSES = ['published', 'draft'];

let hasErrors = false;

function error(file, msg) {
  console.error(`❌  ${file}: ${msg}`);
  hasErrors = true;
}

if (!fs.existsSync(POSTS_DIR)) {
  console.log('⚠️  content/posts directory not found - nothing to validate.');
  process.exit(0);
}

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

if (files.length === 0) {
  console.log('⚠️  No posts found.');
  process.exit(0);
}

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  if (!content.startsWith('---')) {
    error(file, 'Missing frontmatter (file must start with ---)');
    continue;
  }

  const fm = parseFrontmatter(content);
  if (!fm) {
    error(file, 'Could not parse frontmatter');
    continue;
  }

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (!fm[field]) {
      error(file, `Missing required field: ${field}`);
    }
  }

  // Status validation
  if (fm.status && !VALID_STATUSES.includes(fm.status)) {
    error(file, `Invalid status "${fm.status}" - must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Date format: YYYY-MM-DD
  if (fm.date && !/^\d{4}-\d{2}-\d{2}$/.test(fm.date)) {
    error(file, `Invalid date format "${fm.date}" - must be YYYY-MM-DD`);
  }

  // Slug: filename should be kebab-case
  const slug = file.replace(/\.(mdx|md)$/, '');
  if (!/^[a-z0-9-]+$/.test(slug)) {
    error(file, `Filename slug "${slug}" must be lowercase kebab-case (a-z, 0-9, hyphens only)`);
  }

  // Tags must be an array
  if (fm.tags && !Array.isArray(fm.tags)) {
    error(file, 'Field "tags" must be an array');
  }

  // Title length
  if (fm.title && fm.title.length > 120) {
    error(file, `Title is too long (${fm.title.length} chars, max 120)`);
  }

  // Description length
  if (fm.description && fm.description.length > 300) {
    error(file, `Description is too long (${fm.description.length} chars, max 300)`);
  }
}

if (hasErrors) {
  console.error(`\n🚫  Validation failed. Fix the errors above before publishing.`);
  process.exit(1);
} else {
  console.log(`✅  All ${files.length} post(s) are valid.`);
}
