# Graph Report - .  (2026-06-05)

## Corpus Check
- Corpus is ~14,189 words - fits in a single context window. You may not need a graph.

## Summary
- 122 nodes · 118 edges · 43 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Cuts Library` - 7 edges
2. `Cuts v2.0.0 Release` - 6 edges
3. `g()` - 5 edges
4. `getNthColumn()` - 5 edges
5. `enableUI()` - 5 edges
6. `script.loadPlugins()` - 5 edges
7. `makeCurrent()` - 4 edges
8. `Q()` - 4 edges
9. `D()` - 4 edges
10. `y()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `@app-error Event` --conceptually_related_to--> `Cuts Library`  [INFERRED]
  Changelog.md → README.md
- `Scene Hooks: afterShow and beforeHide` --references--> `Scene Data Model`  [INFERRED]
  Changelog.md → README.md
- `Jump/JumpBack/JumpsReset Methods` --conceptually_related_to--> `Jump Stack`  [INFERRED]
  Changelog.md → README.md
- `clickTarget Array Migration` --conceptually_related_to--> `Plugin: Click`  [INFERRED]
  Migration.guide.md → README.md
- `hoverTarget Array Migration` --conceptually_related_to--> `Plugin: Hover`  [INFERRED]
  Migration.guide.md → README.md

## Hyperedges (group relationships)
- **Scene Navigation Flow** — readme_show_method, readme_hide_method, readme_jump_method, readme_jumpback_method, readme_jumpsreset_method, readme_jump_stack [EXTRACTED 0.95]
- **Shortcut Plugin System** — readme_plugin_click, readme_plugin_key, readme_plugin_form, readme_plugin_hover, readme_plugin_scroll, readme_loadplugins [EXTRACTED 0.95]
- **v1.x to v2.x Migration Concerns** — migration_v1_to_v2, migration_shortcuts_v4, migration_click_target, migration_hover_target, migration_rationale [EXTRACTED 0.90]
- **Cuts Logo Visual Composition** — cuts_wordmark, cuts_film_strip_icon, cuts_background_pattern, cuts_dark_theme_design [INFERRED 0.85]

## Communities

### Community 0 - "Release Notes & Migration"
Cohesion: 0.12
Nodes (21): @app-error Event, Bug: SSR First Scene Loading, logLevel Configuration, Cuts v2.0.0 Release, clickTarget Array Migration, hoverTarget Array Migration, Rationale: Array Target Flexibility, Shortcuts v4.x Upgrade (+13 more)

### Community 1 - "Table Sorter Module"
Cohesion: 0.27
Nodes (11): addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns(), loadData() (+3 more)

### Community 2 - "Code Prettify Module"
Cohesion: 0.35
Nodes (8): a(), B(), D(), g(), i(), k(), Q(), y()

### Community 3 - "Brand & Visual Identity"
Cohesion: 0.38
Nodes (7): Decorative N-Pattern Background, Git-Cuts Brand Identity, Cuts Brand Logo, Dark Theme Visual Design, Film Editing Metaphor, Film Strip Icon, Cuts Wordmark

### Community 4 - "Scene Lifecycle Hooks"
Cohesion: 0.47
Nodes (6): Scene Hooks: afterShow and beforeHide, Scene.afterShow(), Rationale: Deferred Code in afterShow, Scene.beforeHide(), Rationale: Prevent Navigation in beforeHide, Scene Data Model

### Community 5 - "Block Navigation Module"
Cohesion: 0.7
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

### Community 6 - "Jump Navigation Methods"
Cohesion: 0.7
Nodes (5): Jump/JumpBack/JumpsReset Methods, script.jump(), Jump Stack, script.jumpBack(), script.jumpsReset()

### Community 7 - "graphify Tooling (self)"
Cohesion: 0.4
Nodes (5): GRAPH_REPORT.md, graphify Knowledge Graph, graphify-out/ Directory, graphify.watch._rebuild_code, wiki/index.md

### Community 8 - "Coverage Report Assets"
Cohesion: 0.67
Nodes (4): Dark architectural silhouette (dome + towers), lcov-report favicon, lcov HTML coverage report (parent context), Yellow/olive solid background fill

### Community 9 - "Entry Point"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Set Instruction Module"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "List Shortcuts Module"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "jumpsReset Module"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "jump Module"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "show Module"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "jumpBack Module"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "setScenes Module"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "hide Module"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Playwright Config"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Vitest Config"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Rollup Config"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "findInstructions.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "main.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "setInstruction.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "hide.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "jumpsReset.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "jump.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "listShortcuts.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "jumpBack.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "index.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "show.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "setScenes.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "findPosition test"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "cuts test"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "general test"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "findInstructions Module"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "script.hide() (doc)"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "script.setScenes() (doc)"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "script.setDependencies() (doc)"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "script.getState() (doc)"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Bug: Long Scene List"
Cohesion: 1.0
Nodes (1): Bug: Long Scene List State

### Community 42 - "Sort Arrow Sprite"
Cohesion: 1.0
Nodes (1): Sort Arrow Sprite (lcov report)

## Knowledge Gaps
- **17 isolated node(s):** `SPA Scene Model`, `Plugin: Key`, `Plugin: Form`, `Rationale: Deferred Code in afterShow`, `Rationale: Prevent Navigation in beforeHide` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Entry Point`** (2 nodes): `main.js`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Set Instruction Module`** (2 nodes): `setInstruction.js`, `setInstruction()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `List Shortcuts Module`** (2 nodes): `listShortcuts.js`, `listShortcuts()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `jumpsReset Module`** (2 nodes): `jumpsReset.js`, `jumpsReset()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `jump Module`** (2 nodes): `jump.js`, `jump()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `show Module`** (2 nodes): `show.js`, `show()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `jumpBack Module`** (2 nodes): `jumpBack.js`, `jumpBack()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `setScenes Module`** (2 nodes): `setScenes.js`, `setScenes()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `hide Module`** (2 nodes): `hide.js`, `hide()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Playwright Config`** (1 nodes): `playwright.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vitest Config`** (1 nodes): `vitest.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Rollup Config`** (1 nodes): `rollup.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `findInstructions.d.ts`** (1 nodes): `findInstructions.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `main.d.ts`** (1 nodes): `main.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `setInstruction.d.ts`** (1 nodes): `setInstruction.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `hide.d.ts`** (1 nodes): `hide.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `jumpsReset.d.ts`** (1 nodes): `jumpsReset.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `jump.d.ts`** (1 nodes): `jump.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `listShortcuts.d.ts`** (1 nodes): `listShortcuts.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `jumpBack.d.ts`** (1 nodes): `jumpBack.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index.d.ts`** (1 nodes): `index.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `show.d.ts`** (1 nodes): `show.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `setScenes.d.ts`** (1 nodes): `setScenes.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `findPosition test`** (1 nodes): `01-findPosition.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `cuts test`** (1 nodes): `02-cuts.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `general test`** (1 nodes): `01-general.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `findInstructions Module`** (1 nodes): `findInstructions.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `script.hide() (doc)`** (1 nodes): `script.hide()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `script.setScenes() (doc)`** (1 nodes): `script.setScenes()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `script.setDependencies() (doc)`** (1 nodes): `script.setDependencies()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `script.getState() (doc)`** (1 nodes): `script.getState()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bug: Long Scene List`** (1 nodes): `Bug: Long Scene List State`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sort Arrow Sprite`** (1 nodes): `Sort Arrow Sprite (lcov report)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@peter.naydenov/shortcuts Dependency` connect `Release Notes & Migration` to `Scene Lifecycle Hooks`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Cuts v2.0.0 Release` (e.g. with `Migration v1.x to v2.x` and `Shortcuts v4.x Upgrade`) actually correct?**
  _`Cuts v2.0.0 Release` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `SPA Scene Model`, `Plugin: Key`, `Plugin: Form` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Release Notes & Migration` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._