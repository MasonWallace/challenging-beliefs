#!/usr/bin/env node
// Walks the case directories and builds /search-index.json for the site-wide
// search page (search.html). Run: node src/build-search-index.js
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CATEGORIES = [
  { dir: 'mormonism', glyph: '📖' },
  { dir: 'islam', glyph: '☪️' },
  { dir: 'jw', glyph: '🚪' },
  { dir: 'hebrew-israelites', glyph: '🦁' },
  { dir: 'messiah', glyph: '🕎' },
  { dir: 'god', glyph: '🌌' },
];

function attr(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&hellip;/g, '…');
}

const entries = [];

for (const cat of CATEGORIES) {
  const catPath = path.join(ROOT, cat.dir);
  const subdirs = fs.readdirSync(catPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  for (const slug of subdirs) {
    const file = path.join(catPath, slug, 'index.html');
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');

    const rawTitle = attr(html, /<title>(.*?)<\/title>/);
    // "Case title — Category | Which Gospel?"
    const titlePart = rawTitle.split(' | ')[0];
    const dashIdx = titlePart.lastIndexOf(' — ');
    const title = decodeEntities(dashIdx > -1 ? titlePart.slice(0, dashIdx) : titlePart);
    const category = dashIdx > -1 ? titlePart.slice(dashIdx + 3) : cat.dir;

    const description = decodeEntities(
      attr(html, /<meta name="description" content="([^"]*)"/)
    );
    const badgeClass = attr(html, /class="badge (b-[a-z]+)"/);
    const badge = decodeEntities(
      attr(html, /class="badge b-[a-z]+">([^<]*)/)
    );

    if (!title) {
      console.warn(`skip (no title): ${cat.dir}/${slug}`);
      continue;
    }

    entries.push({
      url: `/${cat.dir}/${slug}/`,
      title,
      category,
      cat: cat.dir,
      glyph: cat.glyph,
      description,
      badge,
      badgeClass,
    });
  }
}

entries.sort((a, b) => a.cat.localeCompare(b.cat) || a.title.localeCompare(b.title));

const outPath = path.join(ROOT, 'search-index.json');
fs.writeFileSync(outPath, JSON.stringify(entries));
console.log(`Wrote ${entries.length} cases to search-index.json`);
