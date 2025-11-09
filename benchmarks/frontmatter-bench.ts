/* eslint-disable no-console */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// Our implementation
import { parseFrontmatter } from 'ts-md'

// Competitor
import grayMatter from 'gray-matter'

import { bench, group, run } from 'mitata'

// Load fixture
const fixturesDir = join(import.meta.dir, '../fixtures')
const frontmatterContent = readFileSync(join(fixturesDir, 'frontmatter.md'), 'utf-8')

// Create a larger frontmatter document for stress testing
const largeFrontmatter = `---
${Array.from({ length: 100 }, (_, i) => `field${i}: value${i}\ntags${i}:\n  - tag1\n  - tag2\n  - tag3`).join('\n')}
---

# Content

This is the content after frontmatter.
`

console.log('\n📊 Frontmatter Parsing Benchmarks\n')

group('Standard Frontmatter (15 fields)', () => {
  bench('ts-md', () => parseFrontmatter(frontmatterContent))
  bench('gray-matter', () => grayMatter(frontmatterContent))
})

group('Large Frontmatter (100+ fields)', () => {
  bench('ts-md', () => parseFrontmatter(largeFrontmatter))
  bench('gray-matter', () => grayMatter(largeFrontmatter))
})

await run()
