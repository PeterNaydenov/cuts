---
name: cuts
description: Builds single-page-app scene flows with the @peter.naydenov/cuts scene manager — defining scenes (show, hide, afterShow, beforeHide), parent chains, overlays with parents ['*'], show/hide/jump/jumpBack navigation, per-scene keyboard and mouse shortcuts, dependencies, '@app-error' handling and SSR hydration. Use this skill whenever code imports '@peter.naydenov/cuts', when the user asks to add or restructure screens, pages, modals, drawers or wizard steps in an app that uses cuts, when navigation shows or hides the wrong scenes, when a scene shortcut does not fire, or when a navigation promise never resolves.
---

# Cuts (@peter.naydenov/cuts)

Cuts is a scene manager for SPAs. The app is a set of named **scenes** (visual states). Cuts tracks the current scene, walks the **parent chain** when navigating, and makes only the current scene's input handlers active. It does not render, route URLs or store app data — scenes call your own rendering code.

User input comes from `@peter.naydenov/shortcuts`, which cuts wraps. **Each scene is a shortcuts context with the same name.** Shortcut syntax (names, modifiers, key sequences, click targets, plugin options, the form plugin) is documented by the `shortcuts` skill. If that skill is not installed, read `node_modules/@peter.naydenov/shortcuts/skills/shortcuts/SKILL.md` (or the copy nested under `node_modules/@peter.naydenov/cuts/node_modules/`). Read [Cuts vs. plain shortcuts](#cuts-vs-plain-shortcuts) below before you apply it.

## Workflow

```js
import cuts from '@peter.naydenov/cuts'

const script = cuts ()                                      // 1. One instance per app. cuts({ logLevel: 0 }) silences cuts' own errors

const [ pluginKey, pluginClick ] = await script.loadPlugins ([ 'Key', 'Click' ])   // 2. Load + enable input plugins
script.enablePlugin ( pluginKey )
script.enablePlugin ( pluginClick, { clickTarget: [ 'data-click' ] })

script.setDependencies ({ ui, api })                        // 3. Services for every scene function and handler

script.setScenes ([                                         // 4. Register scenes: { name, scene }
    {
        name  : 'app',
        scene : {
              show : ({ task, dependencies }) => { dependencies.ui.mount ( 'app' ); task.done () }
            , hide : ({ task, dependencies }) => { dependencies.ui.unmount ( 'app' ); task.done () }
        }
    },
    {
        name  : 'users',
        scene : {
              parents : [ 'app' ]                           // 'app' must be open underneath
            , show    : ({ task, dependencies }) => { dependencies.ui.mount ( 'users' ); task.done () }
            , hide    : ({ task, dependencies }) => { dependencies.ui.unmount ( 'users' ); task.done () }
            , 'key: ctrl+f'   : ({ dependencies }) => dependencies.ui.focusSearch ()
            , 'click: left-1' : ({ target }) => {
                                    if ( target.dataset.click === 'back' )   script.hide ()   // back to 'app'
                                }
        }
    }
])

await script.show ({ scene: 'users' })                      // 5. Navigate. Opens 'app', then 'users'
```

Plugins, dependencies and scenes can be set in any order. Shortcuts fire only once a scene is shown.

## Scene object

| Field | Required | Contract |
|---|---|---|
| `show ({ task, dependencies }, ...args)` | yes | Load the scene's resources (render it, fetch what it needs), then call `task.done ()`. Not for navigation. |
| `hide ({ task, dependencies }, ...args)` | yes | Release what `show` loaded, then call `task.done ()`. Not for navigation. |
| `afterShow ({ dependencies, done })` | no | Runs after the scene and its context are active. Fire-and-forget; gets no extra args. Put slow work here (data loads, analytics, animations). |
| `beforeHide ({ dependencies, done })` | no | Guard for leaving the current scene. Call `done ( true )` to allow and `done ( false )` to cancel, or return a Promise that resolves to a boolean. Throwing cancels. |
| `parents` | no | Ordered path of ancestor names, **root first, direct parent last**: `[ 'app', 'users' ]` for a scene under `users`. `[ '*' ]` makes an overlay. |
| anything else | no | Shortcut handlers and custom events for this scene, keyed by name: `'key: esc'`, `'click: left-2'`, `'@save'`. |

**`task.done ()` is mandatory.** If `show` or `hide` never calls it, the navigation promise never resolves and every later navigation waits behind it. For async work: `async ({ task }) => { await render (); task.done () }`.

Extra arguments, as in `script.show ({ scene }, payload)`, are passed after the context object to every `show` and `hide` in that transition.

## Navigation

| Call | Effect |
|---|---|
| `await script.show ({ scene })` | Go to `scene`. Hides what is no longer on its path and shows the missing ancestors, then the scene. If `scene` is already open underneath (an ancestor, or the scene under an overlay), only the scenes above it are hidden. Showing the current scene again runs its `hide`, then its `show`. |
| `await script.hide ()` | Hide the current scene and return to its direct parent without re-rendering it. `hide ( 2 )` also hides that parent. `hide ( '*' )` closes everything. |
| `await script.jump ({ scene })` | Like `show`, but saves the current scene on a stack. The scene is saved only if the navigation lands. |
| `await script.jumpBack ()` | Show the last saved scene. `jumpBack ({ hops: 2 })` skips back two levels. Returns `undefined` when the stack has fewer than `hops` entries. A Back blocked by `beforeHide` keeps the stack, so it can be retried. |
| `script.jumpsReset ()` | Clear the jump stack. |
| `script.getState ()` | `{ scene, parents, opened }` — a safe copy. |

Before any navigation, only the **current** scene's `beforeHide` runs (not the guards of ancestors being closed), and it can cancel the whole navigation. A cancelled or failed navigation resolves normally without changing state, so check `getState ().scene` when you need to know where you landed.

**One navigation at a time.** While a transition runs (until every `show`/`hide` calls `task.done ()`, including the wait for `beforeHide`), new `show`/`hide`/`jump`/`jumpBack` calls are ignored and resolve at once. `show`/`hide` load and release a scene's resources and should not navigate. Redirect from `afterShow`, which runs once the scene is ready.

Detailed transition rules, overlays and the jump stack: [references/navigation.md](references/navigation.md).

## Cuts vs. plain shortcuts

The shortcuts skill describes the standalone library. In a cuts app:

- **Contexts are scenes.** Don't call `load` or `changeContext` — use `setScenes` and navigation. Only the current scene's handlers are active; **a parent's handlers are not active while a child scene is shown.** To share shortcuts, spread a common object into each scene: `{ ...common, show, hide }`.
- **Plugins come from cuts.** `await script.loadPlugins ([ 'Key', 'Click', 'Form', 'Hover', 'Scroll' ])` returns handles in the same order; pass them to `script.enablePlugin ( handle, options? )`. App code doesn't need to import `@peter.naydenov/shortcuts`.
- **`disablePlugin` takes the plugin name**, not the handle: `script.disablePlugin ( 'Click' )` (or `'click'`).
- **Per-scene plugin options:** add `'<plugin>: setup'` to the scene. It returns overrides while that scene is current (the same as the `setup` action in the shortcuts skill).
- **The error event is `'@app-error'`**, not `'@shortcuts-error'`. Handlers get a log entry object (`entry.message`) for cuts errors and a message string for errors from shortcuts.
- **`emit` passes arguments through unchanged.** `script.emit ( name, ...args )` and `dependencies.emit ( name, ...args )` call the handler with exactly `args` — no `{ dependencies }` object. They also don't normalize plugin names, so `emit ( 'key: ctrl+s' )` fires nothing. Emit custom `@names` only, and send any data the handler needs as arguments.
- `script.setNote`, `setDependencies` and `getDependencies` work as described in the shortcuts skill. `dependencies.emit` is always present.

```js
const common = {
      'key: ctrl+s' : ({ dependencies }) => dependencies.emit ( '@save', dependencies )
    , '@app-error'  : entry => console.warn ( '[cuts]', entry?.message ?? entry )
}
editor : {
      ...common
    , show : ...
    , hide : ...
    , 'click: left-1' : ({ target, dependencies }) => {
                            if ( target.dataset.click === 'save' )   dependencies.emit ( '@save', dependencies )
                        }
    , '@save' : ( deps ) => deps.api.save ()
}
```

## Common mistakes

- **Navigation hangs** — a `show` or `hide` in the transition never calls `task.done ()`, often because it is skipped by an early `return` or an exception.
- **`Scene "X" is not available.`** — `show` was called before `setScenes` registered `X`, or the name has a typo.
- **`Some of 'X' parent scenes are not set.`** — an ancestor in `parents` is not registered. Register every ancestor.
- **Wrong scenes are hidden or shown** — `parents` lists only the direct parent. It must be the full path: `[ 'app', 'users' ]`, not `[ 'users' ]`.
- **A shortcut doesn't fire** — the plugin isn't enabled, the handler sits on a parent instead of the current scene, or the name lacks its prefix. Check with `script.listShortcuts ( 'scene' )`, then debug the name with the shortcuts skill.
- **A handler gets no `dependencies`** — it was called through `emit`. Pass what it needs as an argument.
- **SSR flag ignored** — `options: { ssr: true }` applies only to the first `show` of a new instance.

## TypeScript

Types ship with the package (`CutsAPI`, `SceneObject`, `SceneDescription`, `ShowContext`, `HideContext`, `AfterShowContext`, `BeforeHideContext`, `CutsState`, `PluginName`). Shortcut keys on a scene are typed as an open index signature.

```ts
import type { SceneDescription } from '@peter.naydenov/cuts'
const home: SceneDescription = { name: 'home', scene: { show: ({ task }) => task.done (), hide: ({ task }) => task.done () } }
```

## References

- [references/navigation.md](references/navigation.md) — read when designing a scene hierarchy or debugging which `show`/`hide` calls run: transition algorithm with examples, overlays, `hide ( n )`, the jump stack, guards.
- [references/api.md](references/api.md) — read for exact method signatures, return values, per-call-site arguments, error messages and SSR.
- [references/recipes.md](references/recipes.md) — read when building a real app: app shell with pages, modal and confirm dialogs, unsaved-changes guards, wizard steps, URL router sync, framework mounting, testing scenes.
