/* eslint-disable no-console */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// Our implementation (using Bun's native YAML)
import { parseYaml, stringifyYaml } from 'ts-md'

// Competitor
import jsYaml from 'js-yaml'

import { bench, group, run } from 'mitata'

// Load fixture
const fixturesDir = join(import.meta.dir, '../fixtures')
const yamlContent = readFileSync(join(fixturesDir, 'data.yaml'), 'utf-8')

// Create larger YAML for stress testing
const largeYamlObj: any = {}
for (let i = 0; i < 500; i++) {
  largeYamlObj[`key${i}`] = {
    name: `Name ${i}`,
    value: i,
    active: i % 2 === 0,
    tags: ['tag1', 'tag2', 'tag3'],
    metadata: {
      created: '2024-01-01',
      updated: '2024-01-15',
    },
  }
}
const largeYaml = jsYaml.dump(largeYamlObj)

console.log('\n📊 YAML Parsing Benchmarks\n')

group('Parse Standard YAML (~1KB)', () => {
  bench('ts-md (Bun)', () => parseYaml(yamlContent))
  bench('js-yaml', () => jsYaml.load(yamlContent))
})

group('Parse Large YAML (500 objects, ~20KB)', () => {
  bench('ts-md (Bun)', () => parseYaml(largeYaml))
  bench('js-yaml', () => jsYaml.load(largeYaml))
})

group('YAML Stringify (500 objects)', () => {
  bench('ts-md (Bun)', () => stringifyYaml(largeYamlObj))
  bench('js-yaml', () => jsYaml.dump(largeYamlObj))
})

await run()
