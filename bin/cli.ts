#!/usr/bin/env bun
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseMarkdown, parseMarkdownWithFrontmatter, parseFrontmatter, parseYaml } from '../src/index'

const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
ts-md - Fast, native Bun-powered markdown parser

USAGE:
  md <file> [options]

OPTIONS:
  --frontmatter, -f    Parse frontmatter only
  --yaml, -y          Parse as YAML
  --full             Parse markdown with frontmatter
  --gfm              Enable GitHub Flavored Markdown
  --breaks           Enable line breaks
  --json             Output as JSON
  --help, -h         Show this help
  --version, -v      Show version

EXAMPLES:
  md README.md                    # Parse markdown to HTML
  md document.md --frontmatter    # Extract frontmatter
  md document.md --full           # Parse with frontmatter
  md data.yaml --yaml             # Parse YAML
  md README.md --gfm --breaks     # Parse with GFM and breaks
  `)
  process.exit(0)
}

if (args.includes('--version') || args.includes('-v')) {
  const pkg = JSON.parse(readFileSync(resolve(import.meta.dir, '../package.json'), 'utf-8'))
  console.log(pkg.version)
  process.exit(0)
}

const filePath = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-'))
if (!filePath) {
  console.error('Error: No file specified')
  process.exit(1)
}

const fullPath = resolve(process.cwd(), filePath)
const content = readFileSync(fullPath, 'utf-8')

const isFrontmatter = args.includes('--frontmatter') || args.includes('-f')
const isYaml = args.includes('--yaml') || args.includes('-y')
const isFull = args.includes('--full')
const asJson = args.includes('--json')
const gfm = args.includes('--gfm')
const breaks = args.includes('--breaks')

try {
  let result: any

  if (isYaml) {
    result = parseYaml(content)
  }
  else if (isFrontmatter) {
    result = parseFrontmatter(content)
  }
  else if (isFull) {
    result = parseMarkdownWithFrontmatter(content, { gfm, breaks })
  }
  else {
    result = parseMarkdown(content, { gfm, breaks })
  }

  if (asJson) {
    console.log(JSON.stringify(result, null, 2))
  }
  else if (typeof result === 'string') {
    console.log(result)
  }
  else {
    console.log(result)
  }
}
catch (error) {
  console.error('Error parsing file:', error)
  process.exit(1)
}
