import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

const require = createRequire(import.meta.url)
const dependencies = [
  'ask-for-promise',
  '@peter.naydenov/log',
  '@peter.naydenov/shortcuts',
]

test('built modules keep dependencies external and expose the Cuts factory', async () => {
  const esmSource = await readFile(new URL('../dist/cuts.esm.mjs', import.meta.url), 'utf8')
  const cjsSource = await readFile(new URL('../dist/cuts.cjs', import.meta.url), 'utf8')
  for (const dependency of dependencies) {
    assert.ok(esmSource.includes(`from "${dependency}"`), `${dependency} must remain external in ESM`)
    assert.ok(cjsSource.includes(`require("${dependency}")`), `${dependency} must remain external in CommonJS`)
  }

  const { default: esm } = await import('../dist/cuts.esm.mjs')
  const cjs = require('@peter.naydenov/cuts')
  for (const cuts of [esm, cjs]) {
    assert.equal(typeof cuts, 'function')
    assert.deepEqual(cuts().getState(), { scene: null, parents: null, opened: false })
  }
})

test('UMD bundle runs without external globals and exposes window.cuts', async () => {
  const source = await readFile(new URL('../dist/cuts.umd.js', import.meta.url), 'utf8')
  const browser = {}
  runInNewContext(source, browser)
  assert.equal(typeof browser.cuts, 'function')
  const state = browser.cuts().getState()
  assert.equal(state.scene, null)
  assert.equal(state.parents, null)
  assert.equal(state.opened, false)
})
