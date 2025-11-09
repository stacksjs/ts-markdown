/* eslint-disable no-console */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// Our implementation
import { parseMarkdown } from 'ts-md'

import MarkdownIt from 'markdown-it'

// Competitors
import { marked } from 'marked'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { Converter as ShowdownConverter } from 'showdown'
import { bench, group, run } from 'mitata'

// Initialize parsers
const md = new MarkdownIt()
const showdown = new ShowdownConverter()

// Load fixtures
const fixturesDir = join(import.meta.dir, '../fixtures')
const smallMarkdown = readFileSync(join(fixturesDir, 'small.md'), 'utf-8')
const mediumMarkdown = readFileSync(join(fixturesDir, 'medium.md'), 'utf-8')
const largeMarkdown = readFileSync(join(fixturesDir, 'large.md'), 'utf-8')

console.log('\n📊 Markdown Parsing Benchmarks\n')

group('Small Document (< 1KB)', () => {
  bench('ts-md', () => parseMarkdown(smallMarkdown))
  bench('marked', () => marked.parse(smallMarkdown))
  bench('markdown-it', () => md.render(smallMarkdown))
  bench('showdown', () => showdown.makeHtml(smallMarkdown))
})

group('Medium Document (~2-3KB)', () => {
  bench('ts-md', () => parseMarkdown(mediumMarkdown))
  bench('marked', () => marked.parse(mediumMarkdown))
  bench('markdown-it', () => md.render(mediumMarkdown))
  bench('showdown', () => showdown.makeHtml(mediumMarkdown))
})

group('Large Document (~50KB, 50 sections)', () => {
  bench('ts-md', () => parseMarkdown(largeMarkdown))
  bench('marked', () => marked.parse(largeMarkdown))
  bench('markdown-it', () => md.render(largeMarkdown))
  bench('showdown', () => showdown.makeHtml(largeMarkdown))
})

await run()
