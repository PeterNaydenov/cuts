# Graph Report - git-cuts  (2026-07-08)

## Corpus Check
- 52 files · ~14,604 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 257 nodes · 249 edges · 54 communities (48 shown, 6 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f6beac4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]

## God Nodes (most connected - your core abstractions)
1. `Release History` - 16 edges
2. `Cuts (@peter.naydenov/cuts)` - 15 edges
3. `Scene` - 14 edges
4. `compilerOptions` - 12 edges
5. `1.2.8 ( 2025-05-03)` - 12 edges
6. `main()` - 11 edges
7. `@peter.naydenov/shortcuts` - 9 edges
8. `scripts` - 8 edges
9. `Cuts Library (@peter.naydenov/cuts)` - 8 edges
10. `exports` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Scene Hooks: afterShow and beforeHide` --references--> `Scene`  [INFERRED]
  Changelog.md → README.md
- `@app-error Event` --conceptually_related_to--> `Cuts Library (@peter.naydenov/cuts)`  [INFERRED]
  Changelog.md → README.md
- `Cuts v2.0.0 Release` --references--> `Shortcuts v4.x Upgrade`  [INFERRED]
  Changelog.md → Migration.guide.md
- `clickTarget Array Migration` --conceptually_related_to--> `Click plugin (mouse)`  [INFERRED]
  Migration.guide.md → README.md
- `hoverTarget Array Migration` --conceptually_related_to--> `Hover plugin`  [INFERRED]
  Migration.guide.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **v1.x to v2.x Migration Concerns** — migration_v1_to_v2, migration_shortcuts_v4, migration_click_target, migration_hover_target, migration_rationale [EXTRACTED 0.90]
- **Scene lifecycle methods** — readme_scene, readme_show, readme_hide, readme_aftershow, readme_beforehide [EXTRACTED 1.00]
- **Jump-based scene navigation flow** — readme_jump, readme_jumpback, readme_jumpsreset, readme_jumpstack, readme_scene [EXTRACTED 1.00]
- **Shortcut plugin system** — readme_loadplugins, readme_enableplugin, readme_disableplugin, readme_plugin_key, readme_plugin_click, readme_plugin_form, readme_plugin_hover, readme_plugin_scroll, readme_shortcuts [EXTRACTED 1.00]
- **Cuts Logo Visual Composition** — cuts_wordmark, cuts_film_strip_icon, cuts_background_pattern, cuts_dark_theme_design [INFERRED 0.85]

## Communities (54 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (17): Scene Hooks: afterShow and beforeHide, afterShow() method, beforeHide() method, hide() method, jump() method, jumpBack() method, jumpsReset() method, Jump Stack (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (17): @app-error Event, Bug: SSR First Scene Loading, logLevel Configuration, Cuts v2.0.0 Release, clickTarget Array Migration, hoverTarget Array Migration, Rationale: Array Target Flexibility, Shortcuts v4.x Upgrade (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (24): allowScripts, fsevents@2.3.2, fsevents@2.3.3, author, dependencies, ask-for-promise, @peter.naydenov/log, @peter.naydenov/shortcuts (+16 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (16): AfterShow and BeforeHide, Configuration, Credits, Custom events via `emit`, Cuts (@peter.naydenov/cuts), Description, Emitting from inside a handler, Events (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.33
Nodes (11): disablePlugin() method, emit() method, enablePlugin() method, loadPlugins() method, Click plugin (mouse), Form plugin (input), Hover plugin, Key plugin (keyboard) (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.38
Nodes (7): Decorative N-Pattern Background, Git-Cuts Brand Identity, Cuts Brand Logo, Dark Theme Visual Design, Film Editing Metaphor, Film Strip Icon, Cuts Wordmark

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (15): 1.3.0 ( 2025-08-15), 1.3.1 ( 2025-08-15), 1.4.0 ( 2025-09-06), 1.4.1. ( 2025-09-24), 1.4.2 ( 2025-09-29), 1.4.3 ( 2025-09-30), 1.4.4 ( 2025-10-10), 1.5.0 ( 2025-10-23 ) (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (5): GRAPH_REPORT.md, graphify, graphify-out/ Directory, graphify.watch._rebuild_code, wiki/index.md

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (4): Dark architectural silhouette (dome + towers), lcov-report favicon, lcov HTML coverage report (parent context), Yellow/olive solid background fill

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (3): Dependencies Object, getDependencies() method, setDependencies() method

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (9): hide(), jump(), jumpBack(), jumpsReset(), listShortcuts(), setScenes(), show(), main() (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, checkJs, declaration, declarationMap, emitDeclarationOnly, module, moduleResolution (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (14): devDependencies, @peter.naydenov/visual-controller-for-vue3, @playwright/test, rollup, @rollup/plugin-commonjs, @rollup/plugin-node-resolve, @rollup/plugin-terser, @types/node (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (12): dependencies, @peter.naydenov/shortcuts, @peter.naydenov/visual-controller-for-vue3, vue, devDependencies, vite, @vitejs/plugin-vue, name (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (12): 1.0.0 (2024-05-08), 1.0.1 (2024-05-10), 1.0.2 (2024-12-12), 1.1.0 (2024-12-13), 1.2.0 (2024-12-21), 1.2.1 ( 2024-12-21 ), 1.2.2 ( 2024-12-22 ), 1.2.3 ( 2024-12-23) (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (7): Backward Compatibility, Example Migration, From version 1.x.x to version 2.x.x, Migration Guides, Package Dependencies Update, Per-Context Setup Examples Updated, Plugin Target Attributes Changes

### Community 16 - "Community 16"
Cohesion: 0.29
Nodes (7): default, exports, ./dist/*, ./package.json, ./src/*, import, require

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (3): AskObject, sceneDescription, SceneObject

### Community 18 - "Community 18"
Cohesion: 0.50
Nodes (3): AskObject, sceneDescription, SceneObject

## Knowledge Gaps
- **144 isolated node(s):** `name`, `description`, `version`, `license`, `author` (+139 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Scene` connect `Community 0` to `Community 3`, `Community 4`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `@peter.naydenov/shortcuts` connect `Community 4` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `Cuts (@peter.naydenov/cuts)` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `name`, `description`, `version` to the rest of the system?**
  _144 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._