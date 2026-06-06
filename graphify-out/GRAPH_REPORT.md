# Graph Report - .  (2026-06-06)

## Corpus Check
- Corpus is ~16,367 words - fits in a single context window. You may not need a graph.

## Summary
- 136 nodes · 138 edges · 44 communities detected
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Scene (SPA visual state)` - 13 edges
2. `@peter.naydenov/shortcuts` - 9 edges
3. `Cuts Library (@peter.naydenov/cuts)` - 8 edges
4. `Cuts v2.0.0 Release` - 6 edges
5. `enablePlugin() method` - 6 edges
6. `g()` - 5 edges
7. `getNthColumn()` - 5 edges
8. `enableUI()` - 5 edges
9. `loadPlugins() method` - 5 edges
10. `makeCurrent()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `@app-error Event` --conceptually_related_to--> `Cuts Library (@peter.naydenov/cuts)`  [INFERRED]
  Changelog.md → README.md
- `Cuts v2.0.0 Release` --references--> `Shortcuts v4.x Upgrade`  [INFERRED]
  Changelog.md → Migration.guide.md
- `Scene Hooks: afterShow and beforeHide` --references--> `Scene (SPA visual state)`  [INFERRED]
  Changelog.md → README.md
- `clickTarget Array Migration` --conceptually_related_to--> `Click plugin (mouse)`  [INFERRED]
  Migration.guide.md → README.md
- `hoverTarget Array Migration` --conceptually_related_to--> `Hover plugin`  [INFERRED]
  Migration.guide.md → README.md

## Hyperedges (group relationships)
- **v1.x to v2.x Migration Concerns** — migration_v1_to_v2, migration_shortcuts_v4, migration_click_target, migration_hover_target, migration_rationale [EXTRACTED 0.90]
- **Scene lifecycle methods** — readme_scene, readme_show, readme_hide, readme_aftershow, readme_beforehide [EXTRACTED 1.00]
- **Jump-based scene navigation flow** — readme_jump, readme_jumpback, readme_jumpsreset, readme_jumpstack, readme_scene [EXTRACTED 1.00]
- **Shortcut plugin system** — readme_loadplugins, readme_enableplugin, readme_disableplugin, readme_plugin_key, readme_plugin_click, readme_plugin_form, readme_plugin_hover, readme_plugin_scroll, readme_shortcuts [EXTRACTED 1.00]
- **Cuts Logo Visual Composition** — cuts_wordmark, cuts_film_strip_icon, cuts_background_pattern, cuts_dark_theme_design [INFERRED 0.85]

## Communities

### Community 0 - "Scene Methods (README + Changelog)"
Cohesion: 0.14
Nodes (17): Scene Hooks: afterShow and beforeHide, afterShow() method, beforeHide() method, hide() method, jump() method, jumpBack() method, jumpsReset() method, Jump Stack (+9 more)

### Community 1 - "Release Notes & Migration"
Cohesion: 0.16
Nodes (16): @app-error Event, Bug: SSR First Scene Loading, logLevel Configuration, Cuts v2.0.0 Release, clickTarget Array Migration, hoverTarget Array Migration, Rationale: Array Target Flexibility, Shortcuts v4.x Upgrade (+8 more)

### Community 2 - "Table Sorter Module"
Cohesion: 0.27
Nodes (11): addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns(), loadData() (+3 more)

### Community 3 - "Code Prettify Module"
Cohesion: 0.35
Nodes (8): a(), B(), D(), g(), i(), k(), Q(), y()

### Community 4 - "Plugin System (README)"
Cohesion: 0.33
Nodes (11): disablePlugin() method, emit() method, enablePlugin() method, loadPlugins() method, Click plugin (mouse), Form plugin (input), Hover plugin, Key plugin (keyboard) (+3 more)

### Community 5 - "Brand & Visual Identity"
Cohesion: 0.38
Nodes (7): Decorative N-Pattern Background, Git-Cuts Brand Identity, Cuts Brand Logo, Dark Theme Visual Design, Film Editing Metaphor, Film Strip Icon, Cuts Wordmark

### Community 6 - "Block Navigation Module"
Cohesion: 0.7
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

### Community 7 - "graphify Tooling (self)"
Cohesion: 0.4
Nodes (5): GRAPH_REPORT.md, graphify Knowledge Graph, graphify-out/ Directory, graphify.watch._rebuild_code, wiki/index.md

### Community 8 - "Coverage Report Assets"
Cohesion: 0.67
Nodes (4): Dark architectural silhouette (dome + towers), lcov-report favicon, lcov HTML coverage report (parent context), Yellow/olive solid background fill

### Community 9 - "Dependencies Object"
Cohesion: 0.67
Nodes (3): Dependencies Object, getDependencies() method, setDependencies() method

### Community 10 - "Entry Point"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Set Instruction Module"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "List Shortcuts Module"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "jumpsReset Module"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "jump Module"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "show Module"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "jumpBack Module"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "setScenes Module"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "hide Module"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Playwright Config"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Vitest Config"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Rollup Config"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "findInstructions.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "main.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "setInstruction.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "hide.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "jumpsReset.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "jump.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "listShortcuts.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "jumpBack.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "index.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "show.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "setScenes.d.ts"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "findPosition test"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "cuts test"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "general test"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "findInstructions Module"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Bug: Long Scene List"
Cohesion: 1.0
Nodes (1): Bug: Long Scene List State

### Community 39 - "Jump Methods (Changelog)"
Cohesion: 1.0
Nodes (1): Jump/JumpBack/JumpsReset Methods

### Community 40 - "listScenes() (doc)"
Cohesion: 1.0
Nodes (1): listScenes() method

### Community 41 - "listShortcuts() (doc)"
Cohesion: 1.0
Nodes (1): listShortcuts() method

### Community 42 - "getState() (doc)"
Cohesion: 1.0
Nodes (1): getState() method

### Community 43 - "Sort Arrow Sprite"
Cohesion: 1.0
Nodes (1): Sort Arrow Sprite (lcov report)

## Knowledge Gaps
- **33 isolated node(s):** `logLevel Configuration`, `Bug: SSR First Scene Loading`, `Bug: Long Scene List State`, `Jump/JumpBack/JumpsReset Methods`, `Scene Hooks: afterShow and beforeHide` (+28 more)
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
- **Thin community `Bug: Long Scene List`** (1 nodes): `Bug: Long Scene List State`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Jump Methods (Changelog)`** (1 nodes): `Jump/JumpBack/JumpsReset Methods`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `listScenes() (doc)`** (1 nodes): `listScenes() method`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `listShortcuts() (doc)`** (1 nodes): `listShortcuts() method`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `getState() (doc)`** (1 nodes): `getState() method`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sort Arrow Sprite`** (1 nodes): `Sort Arrow Sprite (lcov report)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@peter.naydenov/shortcuts` connect `Plugin System (README)` to `Scene Methods (README + Changelog)`, `Release Notes & Migration`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `Scene (SPA visual state)` connect `Scene Methods (README + Changelog)` to `Plugin System (README)`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `Cuts Library (@peter.naydenov/cuts)` connect `Release Notes & Migration` to `Plugin System (README)`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `@peter.naydenov/shortcuts` (e.g. with `Key plugin (keyboard)` and `Click plugin (mouse)`) actually correct?**
  _`@peter.naydenov/shortcuts` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Cuts v2.0.0 Release` (e.g. with `Migration v1.x to v2.x` and `Shortcuts v4.x Upgrade`) actually correct?**
  _`Cuts v2.0.0 Release` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `enablePlugin() method` (e.g. with `Key plugin (keyboard)` and `Click plugin (mouse)`) actually correct?**
  _`enablePlugin() method` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `logLevel Configuration`, `Bug: SSR First Scene Loading`, `Bug: Long Scene List State` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._