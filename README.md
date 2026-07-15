<img src="https://github.com/PeterNaydenov/cuts/blob/main/cuts.png" width="100%" alt="Cuts" align="center" />



# Cuts (@peter.naydenov/cuts)

![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/peterNaydenov/cuts/main)
![GitHub License](https://img.shields.io/github/license/peterNaydenov/cuts)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40peter.naydenov%2Fcuts)

**`An abstract idea of a cut`**: In filmmaking, a change of scene is called a "**cut**". Cuts connect scenes into a cohesive narrative. The same idea, applied to a single-page app, is what this library does — except the "scenes" are your visual states and the "cuts" are the transitions between them.

---

## What is cuts?

Cuts is a **scene manager for single-page apps**. You describe your app as a set of named *scenes* (visual states), each with its own setup/teardown logic and its own user-interaction rules. Cuts decides which scene is current, walks the scene graph when you navigate, and routes keyboard / mouse / hover / form / scroll input to the right handlers based on the current scene.

It is **not a router**. It does not bind to URLs, it does not own browser history, it does not care about deep-linking. If you need URL routing, you wire it up on top of cuts (or use a router alongside it — they don't fight).

It is **not a framework**. It does not render anything, does not own your DOM, does not force a templating engine. You bring React / Vue / Svelte / Morph / Handlebars / vanilla — cuts only manages *when* a scene is active and *what input* its handlers receive.

It is **not state management** in the Redux/Zustand sense. There is no global store; scenes own their own state through whatever mechanism you prefer. Cuts only knows "which scene is on, and what scenes are stacked behind it".

---

## When to use cuts

| If you want… | Use cuts? |
|---|---|
| A scene-based runtime where each visual state is its own unit with its own input rules | ✅ |
| URL-based routing with browser back/forward | ❌ use a router (or layer one on top) |
| A templating / rendering engine | ❌ cuts doesn't render |
| A global store for app data | ❌ use a state library |
| Testable scene flows that don't depend on a framework | ✅ |
| A small, fast runtime that scales to dozens of scenes and nested hierarchies | ✅ |

---

## Quick start (5 minutes)

```bash
npm install @peter.naydenov/cuts
```

```js
import cuts from '@peter.naydenov/cuts'

// 1. Create a scene manager
const script = cuts()

// 2. Define your scenes. Each scene describes:
//    - how to render itself ('show')
//    - how to tear itself down ('hide')
//    - what other scenes must be open underneath it ('parents')
//    - which user inputs to handle (the rest of the keys)
const scenes = [
  {
    name: 'home',
    scene: {
      show : ({ task }) => { /* render home */ task.done() },
      hide : ({ task }) => { /* unrender home */ task.done() },

      'click: left-1' : ({ target }) => {
        if (target?.id === 'open-about') {
          script.show({ scene: 'about' })
        }
      }
    }
  },
  {
    name: 'about',
    scene: {
      show : ({ task }) => { /* render about */ task.done() },
      hide : ({ task }) => { /* unrender about */ task.done() }
    }
  }
]

// 3. Register them
script.setScenes(scenes)

// 4. Navigate
await script.show({ scene: 'home' })
```

That's it. You've got a working scene runtime. Everything else in this README is detail.

---

## Mental model

The whole library rotates around four concepts. If you get these, the rest of the API falls out naturally.

### Scene

A *scene* is a named visual state. It is a plain object with a `show` function, a `hide` function, and anything else you want to attach. When cuts activates a scene, it calls `show`; when it deactivates a scene, it calls `hide`. Both must call `task.done()` to signal completion.

### Parent chain

Some scenes need other scenes underneath them. A `users` page may need an `app` shell. A `modal` may need whatever is behind it. The `parents` array describes the path that must be open *before* a scene can be shown:

```js
{
  name: 'users-page',
  scene: {
    parents: ['app-shell'],   // app-shell must be open first
    show: ({ task }) => { /* render users */ task.done() },
    hide: ({ task }) => { /* unrender users */ task.done() }
  }
}
```

When you `show({ scene: 'users-page' })`, cuts walks the parent chain: opens `app-shell` if it isn't already, then opens `users-page` on top. When you `show` something else, cuts walks *back* the chain, closing in reverse order.

### Overlay (`parents: ['*']`)

A scene that doesn't need any specific scene underneath it — but should appear *on top of whatever is current* — uses `parents: ['*']`. This is how you model modals, tooltips, toasts, drawers, etc.

```js
{
  name: 'confirm-modal',
  scene: {
    parents: ['*'],           // overlay on any current scene
    show: ({ task }) => { /* show modal */ task.done() },
    hide: ({ task }) => { /* hide modal */ task.done() }
  }
}
```

When you `show` an overlay, cuts records the currently-active scene and puts the overlay on top. The next `hide()` lifts the overlay and returns to that scene; the scene underneath never moved.

### Jump stack

`show` is *forgetful* — once you navigate, you don't remember where you came from. `jump` is *remembering* — you can come back with `jumpBack`. Internally, cuts keeps a stack of "where you jumped from". You can jump as deep as you like, and `jumpBack` returns one level at a time (`{ hops: 2 }` to skip multiple). `jumpsReset` clears the stack.

---

## Scene reference

A scene is a `SceneObject` (see [TypeScript](#typescript) for the exact shape):

```ts
{
  show       (context)  // required. Must call context.task.done() to signal completion.
  hide       (context)  // required. Must call context.task.done() to signal completion.
  afterShow  (context)  // optional. Fire-and-forget. Runs after the scene is fully shown.
  beforeHide (context)  // optional. Can block hiding by calling context.done(false).
  parents    string[]   // optional. Path of scene names that must be open first.
                        //   Use ['*'] for an overlay that goes on top of the current scene.
  ...shortcutHandlers    // anything else. See "Shortcut plugins" below.
}
```

The `context` object passed to each lifecycle function has a different shape per call site — see [Per-call-site arguments](#per-call-site-arguments).

---

## Method reference

All methods live on the object returned by `cuts()`. Below, every method, what it returns, whether it's cancelable, and what errors it can surface.

### Async reference

| Method | Returns | Awaitable | Cancelable | Notes |
|---|---|---|---|---|
| `show` | `Promise<any>` | yes | via `beforeHide` of current scene | Awaits all `show` and `hide` calls in the transition. |
| `hide` | `Promise<any>` | yes | via `beforeHide` of current scene | Same as `show`, in reverse. |
| `jump` | `Promise<any>` | yes | via `beforeHide` of current scene | Only pushes onto the jump stack if navigation actually lands. |
| `jumpBack` | `Promise<any> \| undefined` | yes | via `beforeHide` of current scene | Returns `undefined` if the stack is empty (no-op). |
| `jumpsReset` | `void` | n/a | n/a | Sync. Clears the jump stack immediately. |
| `setScenes` | `void` | n/a | n/a | Sync. Errors are logged but do not throw. |
| `setDependencies` | `void` | n/a | n/a | Sync. Merges into the dependencies bag. |
| `getDependencies` | `*` | n/a | n/a | Sync. Returns the live bag. |
| `setNote` | `void` | n/a | n/a | Sync. Sets a string passed to action functions. |
| `listScenes` | `string[]` | n/a | n/a | Sync. Snapshot of registered scene names. |
| `listShortcuts` | `string[] \| null` | n/a | n/a | Sync. `null` if the scene name is unknown. |
| `loadPlugins` | `Promise<Function[]>` | yes | n/a | Dynamic import. `await` required. |
| `enablePlugin` | `void` | n/a | n/a | Sync. Activates a loaded plugin. |
| `disablePlugin` | `void` | n/a | n/a | Sync. Deactivates a loaded plugin by **name** (not by handle). |
| `getState` | `{ scene, parents, opened }` | n/a | n/a | Sync. Returns a snapshot — safe to mutate the result. |
| `emit` | `void` | n/a | n/a | Sync. Forwards to the underlying event emitter. |

### `cuts(cfg?)`

Creates a scene manager.

```js
const script = cuts({
  logLevel: 1   // 0 = silent, 1 = log errors (default)
})
```

| Option | Type | Default | Description |
|---|---|---|---|
| `logLevel` | `0 \| 1` | `1` | When `0`, no errors are logged and no `@app-error` events fire. Use in production if you don't want cuts to surface problems at the event level. |

### `show({ scene, options? }, ...args)`

Activates `scene`. Walks the parent chain: opens any missing parents, then opens the target. On its way out, hides any scenes that are no longer on the path.

```js
await script.show({ scene: 'users-page' })
await script.show({ scene: 'prefilled', options: { ssr: true } }, payload)
```

- `scene` — name of the scene to show
- `options.ssr` — set to `true` to mark this scene as already rendered externally (e.g. by SSR). The scene's `show` function is **not** called; the state is recorded as if it had been. SSR applies only to the first show on a fresh manager.
- `...args` — additional arguments forwarded to the scene's `show`, `hide`, and `afterShow` functions

If the current scene's `beforeHide` returns `false`, navigation is cancelled and the call resolves without changing state.

### `hide(endSteps?)`

Deactivates the current scene. Default hides 1 step (the current scene). `hide('*')` closes everything back to the root.

```js
await script.hide()       // hide current scene only
await script.hide(2)      // hide current and 1 parent
await script.hide('*')    // close everything
```

If the current scene's `beforeHide` returns `false`, hide is cancelled.

### `jump({ scene }, ...args)` / `jumpBack({ hops? }, ...args)` / `jumpsReset()`

`jump` navigates to a scene and remembers where you came from. `jumpBack` returns. `jumpsReset` clears the memory.

```js
await script.jump({ scene: 'settings' })   // remember current, go to settings
await script.jump({ scene: 'profile' })    // remember settings, go to profile
await script.jumpBack()                    // back to settings
await script.jumpBack({ hops: 2 })         // skip two levels at once
script.jumpsReset()                        // forget every jump
```

`jump` only pushes onto the stack if the navigation actually landed (didn't get blocked by `beforeHide` or fail). `jumpBack` returns `undefined` if the stack is empty (a no-op — your code should handle this).

### `setScenes(list)`

Registers scenes. Each item is `{ name, scene }`. Errors are logged but don't throw.

```js
script.setScenes([
  { name: 'home', scene: { show: ..., hide: ... } },
  { name: 'about', scene: { show: ..., hide: ..., parents: ['home'] } }
])
```

You can call `setScenes` multiple times to add more scenes later.

### `setDependencies(deps)` / `getDependencies()`

`setDependencies` merges a bag of values into the `dependencies` object passed to every scene function and shortcut handler. `getDependencies` reads the current bag back.

The bag also contains a built-in `emit` function (added in v2.1.0+) that you can call from any handler to fire a shortcut or event name. See [Events](#events).

```js
script.setDependencies({ analytics, user, locale })

// inside a handler:
'click: left-1': ({ target, dependencies }) => {
  if (target?.id === 'save') {
    dependencies.analytics.track('save')
    dependencies.emit('key: ctrl+s', { target: document.getElementById('save-btn') })
  }
}
```

### `setNote(note)`

Sets a string passed to action functions alongside the dependencies. Useful for sharing contextual data without restructuring the dependencies bag.

### `listScenes()` / `listShortcuts(sceneName)`

Inspectors. `listScenes` returns the names of all registered scenes. `listShortcuts` returns the shortcut keys defined on a specific scene, or `null` if the scene is unknown. Scene lifecycle methods (`show`, `hide`, `afterShow`, `beforeHide`) and `parents` are excluded from the shortcuts list.

### `loadPlugins(plugins)` / `enablePlugin(plugin, options?)` / `disablePlugin(pluginName)`

Plugins supply the user-input handlers (`Key`, `Click`, etc.). See [Shortcut plugins](#shortcut-plugins) for the full reference.

```js
const [pluginClick] = await script.loadPlugins(['Click'])
script.enablePlugin(pluginClick, { clickTarget: ['data-click'] })

// later, to remove it:
script.disablePlugin('Click')   // by NAME, not by handle
```

⚠️ **Signature asymmetry**: `enablePlugin` takes the plugin **function** (the loaded handle). `disablePlugin` takes the plugin **name** (the string you passed to `loadPlugins`). Get this wrong and you'll get a confusing error from the underlying shortcuts library.

### `getState()`

Returns a snapshot of the current state:

```ts
{
  scene: string | null,   // current scene, or null if nothing is active
  parents: string[],      // snapshot of the parent chain (safe to mutate)
  opened: boolean         // false until the first show() call lands
}
```

The returned `parents` is a fresh copy — mutating it won't corrupt cuts' internal state. (This was a real bug, fixed in v2.1.3.)

### `emit(event, ...args)`

Fires an event by name. Handlers in the current scene that match the name will be called with `...args`. See [Events](#events).

---

## Per-call-site arguments

A single `dependencies` bag is passed around, but the *wrapper* differs per call site. Memorize these:

| Call site | What you receive | Notes |
|---|---|---|
| `show({ task, dependencies })` | `task.done()` to signal completion | Required. |
| `hide({ task, dependencies })` | same as `show` | Required. |
| `afterShow({ dependencies, done })` | `done` is a no-op | Fire-and-forget. Return value ignored. The scene is already shown by the time you run. |
| `beforeHide({ dependencies, done })` | `done(true)` to allow, `done(false)` to cancel | Called *before* the scene is hidden. Use for unsaved-changes warnings. |
| Shortcut handler (click/key/...) | `{ target, dependencies, event }` | Exact shape depends on the plugin. |
| `@app-error` handler | `logEntry` directly | The full log entry, not a dependencies bag. |
| Custom event handler (via `emit`) | Whatever args you passed to `emit` | Don't rely on `dependencies` being present unless you've registered the handler on every scene. |

---

## Shortcut plugins

Cuts doesn't handle user input by itself. It delegates to a set of plugins loaded from `@peter.naydenov/shortcuts`. The plugin names and what they do:

| Plugin | Catches | Handler arg shape |
|---|---|---|
| `Key` | keyboard events | `{ event, target, dependencies }` |
| `Click` | mouse clicks | `{ target, dependencies }` |
| `Form` | form input events | `{ target, dependencies }` |
| `Hover` | mouse enter/leave (new in v4.0.0) | `{ target, dependencies }` |
| `Scroll` | scroll events (new in v4.0.0) | `{ event, target, dependencies }` |

### Loading and enabling

```js
const [pluginKey, pluginClick] = await script.loadPlugins(['Key', 'Click'])

script.enablePlugin(pluginKey)                                  // default options
script.enablePlugin(pluginClick, { clickTarget: ['data-click'] })  // custom
```

`loadPlugins` is async (dynamic `import()`); `enablePlugin` is sync. The plugin handle returned by `loadPlugins` is what you pass to `enablePlugin` — keep it.

### Per-plugin options

Each plugin takes an options object when enabled. The most commonly customised:

```js
// Click plugin: which DOM attributes count as a click target
script.enablePlugin(pluginClick, {
  clickTarget: ['data-click', 'href']   // array of attribute names
})

// Hover plugin: which DOM attributes count as a hover target
script.enablePlugin(pluginHover, {
  hoverTarget: ['data-hover']
})
```

For the full plugin API (including custom plugins), see the [shortcuts library documentation](https://github.com/PeterNaydenov/shortcuts). Cuts re-exports everything you need; you shouldn't have to install `shortcuts` separately.

### Writing a shortcut handler

A shortcut handler is a function on a scene, keyed by the shortcut name:

```js
{
  name: 'editor',
  scene: {
    show: ({ task }) => { /* render */ task.done() },
    hide: ({ task }) => { /* unrender */ task.done() },

    'click: left-1' : ({ target, dependencies }) => {
      if (target?.id === 'save-btn') {
        dependencies.analytics.track('save')
      }
    },

    'key: ctrl+s' : ({ dependencies }) => {
      // forward to the same handler a click would trigger
      dependencies.emit('click: left-1', { target: document.getElementById('save-btn') })
    }
  }
}
```

The shortcut name format is `<plugin>:<event-detail>`. For `Key` it's `key: <combo>` (e.g. `key: ctrl+s`). For `Click` it's `click: <button>`. For `Form` it's `form: <event>`. There's no schema or validation — typos mean the handler never fires, with no error.

---

## Events

Cuts has one built-in event: `@app-error`. It also passes through any custom event name you choose.

### `@app-error`

Fires whenever cuts logs an error. The handler receives the raw log entry:

```js
{
  name: 'home',
  scene: {
    show: ({ task }) => task.done(),
    hide: ({ task }) => task.done(),

    '@app-error': (logEntry) => {
      // logEntry: { type: 'error', message: 'Scene "X" is not available.', ... }
      console.error('[cuts]', logEntry.message)
    }
  }
}
```

Whether this fires depends on `logLevel`:
- `logLevel: 1` (default) — fires for every error
- `logLevel: 0` — never fires (cuts is fully silent)

A handler is only active while its scene is the current context. To make a global error handler, register it on every scene, or on a scene that stays mounted (e.g. a root scene).

### Custom events

Use `script.emit(name, ...args)` to fire any custom event:

```js
script.emit('analytics', { event: 'scene-entered', scene: 'home' })
```

A handler registered on the current scene under the same name will receive the args:

```js
{
  name: 'home',
  scene: {
    show: ({ task }) => task.done(),

    'analytics': (payload) => {
      console.log('analytics event:', payload)
    }
  }
}
```

For custom event names, a leading `@` is a common convention (e.g. `@analytics`) but not required.

### Chaining gestures

A common pattern: a keyboard shortcut fires the same handler that a click would. Use `dependencies.emit` to forward:

```js
'click: left-1': ({ target, dependencies }) => { /* save logic */ },
'key: ctrl+s':   ({ dependencies }) => {
  dependencies.emit('click: left-1', { target: document.getElementById('save-btn') })
}
```

`dependencies.emit` is always available in handlers — you don't need to call `setDependencies` to get it.

---

## Server-side rendering (SSR)

Cuts supports a one-shot SSR handshake: when the page is server-rendered with a particular scene already in the DOM, you tell cuts about it on hydration so it doesn't re-run `show` for that scene.

```js
// On the server, your HTML already contains the rendered 'home' scene.
// On the client, on hydration:
const script = cuts()
script.setScenes(scenes)
await script.show({ scene: 'home', options: { ssr: true } })
// → The 'home' scene's show function is NOT called.
//   state is recorded as if it had been.
```

`options.ssr` only takes effect on the very first `show` after the manager is created. After that, the `opened` flag is `true` and SSR is a no-op.

**State after SSR**: `getState()` returns `{ scene: 'home', parents: [...], opened: true }`. The scene's `parents` are recorded (this was the v2.1.4 fix), so navigating away after an SSR-loaded deep scene correctly hides its ancestors.

**What SSR doesn't do for you**:
- It doesn't manage the actual server rendering. You bring your own templating layer.
- It doesn't handle URL ↔ scene mapping.
- It doesn't replay shortcut events. Plugins only attach on the client.

---

## Error reference

`@app-error` handlers receive log entries from cuts. The current known error messages:

| Message | Cause | Fix |
|---|---|---|
| `Scene "X" is not available.` | `show({ scene: 'X' })` called before `X` was registered via `setScenes` | Register the scene first, or check the name for typos |
| `Some of 'X' parent scenes are not set.` | A scene's `parents` array references scenes that haven't been registered | Register all referenced parents before the child |
| `Scene name is not defined` | `setScenes` was passed an item with no `name` field | Add a `name` to every scene description |
| `Scene X is not defined` | `setScenes` was passed an item where `scene` is null/undefined | Provide a `scene` object for every name |

Plus errors forwarded from `@peter.naydenov/shortcuts` (e.g. unknown plugin, bad option). See the [shortcuts library](https://github.com/PeterNaydenov/shortcuts) for the upstream list.

---

## TypeScript

Cuts ships with TypeScript declarations. The default import gives you a `cuts()` factory whose return type is fully described:

```ts
import cuts from '@peter.naydenov/cuts'

const script = cuts({ logLevel: 1 })

script.setScenes([
  {
    name: 'home',
    scene: {
      show: ({ task }) => { task.done() },                 // ✓ typed
      hide: ({ task }) => { task.done() },                 // ✓ typed
      'click: left-1': ({ target, dependencies }) => { },  // ✓ typed
    }
  }
])
```

### Public types

```ts
type LogLevel = 0 | 1

interface CutsConfig {
  logLevel?: LogLevel
}

type PluginName = 'Key' | 'Click' | 'Form' | 'Hover' | 'Scroll'

interface AskObject {
  done(): void
}

interface ShowContext { task: AskObject; dependencies: Record<string, any> }
interface HideContext { task: AskObject; dependencies: Record<string, any> }
interface AfterShowContext { dependencies: Record<string, any>; done: () => void }
interface BeforeHideContext { dependencies: Record<string, any>; done: (continueHiding: boolean) => void }

interface SceneObject {
  show:    (ctx: ShowContext)                       => void | Promise<void>
  hide:    (ctx: HideContext)                       => void | Promise<void>
  afterShow?:  (ctx: AfterShowContext)              => void
  beforeHide?: (ctx: BeforeHideContext)             => void
  parents?:    string[]
  [shortcut: string]: any                           // see shortcut plugins
}

interface SceneDescription {
  name: string
  scene: SceneObject
}

interface CutsState {
  scene:   string | null
  parents: string[]
  opened:  boolean
}

interface CutsAPI {
  show(request: { scene: string; options?: { ssr?: boolean } }, ...args: any[]): Promise<any>
  hide(endSteps?: number | '*'): Promise<any>
  jump(request: { scene: string }, ...args: any[]): Promise<any>
  jumpBack(options?: { hops?: number }, ...args: any[]): Promise<any> | undefined
  jumpsReset(): void
  setScenes(list: SceneDescription[]): void
  listScenes(): string[]
  listShortcuts(sceneName: string): string[] | null
  setDependencies(deps: Record<string, any>): void
  getDependencies(): Record<string, any>
  setNote(note: string): void
  loadPlugins(plugins: PluginName[]): Promise<Function[]>
  enablePlugin(plugin: Function, options?: Record<string, any>): void
  disablePlugin(pluginName: PluginName): void
  getState(): CutsState
  emit(event: string, ...args: any[]): void
}

declare function cuts(cfg?: CutsConfig): CutsAPI
export default cuts
```

> **IntelliSense for shortcut keys**: shortcut names are free-form strings today (e.g. `'click: left-1'`, `'key: ctrl+s'`). For richer autocomplete on plugin-specific keys, see [Improving IntelliSense for shortcut keys](#improving-intellisense-for-shortcut-keys) below.

### Improving IntelliSense for shortcut keys

The plugin-specific shortcut keys (e.g. what counts as a valid `Click` shortcut) live in `@peter.naydenov/shortcuts`. Cuts is a thin wrapper that re-exports what you need. To get IntelliSense on shortcut keys in your scene objects, augment the `SceneObject` type in your own code:

```ts
import type { SceneObject } from '@peter.naydenov/cuts'

// Helper type: any string is allowed, but known ones autocomplete better
type ClickKey = `click: ${string}`
type KeyCombo = `key: ${string}`

declare module '@peter.naydenov/cuts' {
  interface SceneObject {
    [key: ClickKey | KeyCombo | `@${string}`]: (
      ctx: { target?: any; event?: any; dependencies: Record<string, any> }
    ) => void
  }
}
```

This gives you:
- Autocomplete on the common `click:` and `key:` prefixes
- The handler arg shape is described
- Custom events (`@my-event`) are also valid

---

## Best practices

### One file per scene (or one folder)

Scenes are self-contained. They render, tear down, and own their input handlers. Put each scene in its own file:

```
src/
  scenes/
    home.js
    about.js
    users.js
  index.js
```

### Keep `show` / `hide` small

`show` should set up the scene's DOM and call `task.done()`. Heavy lifting (lazy data loads, animations, analytics) goes in `afterShow` so the user sees the scene as fast as possible.

### Use `beforeHide` for unsaved-changes guards

```js
beforeHide: ({ done, dependencies }) => {
  if (dependencies.dirty) {
    if (confirm('Discard unsaved changes?')) done(true)
    else done(false)
  } else {
    done(true)
  }
}
```

### Test scenes in isolation

Each scene is just a function. You can test `show` and `hide` directly with the dependencies bag and a `task` you control:

```js
import { describe, it, expect } from 'vitest'

const homeScene = { /* ... */ }

it('renders on show', async () => {
  const task = { done: vi.fn() }
  await homeScene.show({ task, dependencies: {} })
  expect(task.done).toHaveBeenCalled()
})
```

For full-flow integration tests, use the existing `test/02-cuts.test.js` patterns.

### Don't rely on parents for ordering side effects

Cuts decides the show/hide order based on the parent chain. If you need cross-scene coordination, use `emit` + a custom event handler, not "this scene's show will fire before that scene's hide because of the parent stack".

### SSR only on the first show

`options.ssr` is a one-shot flag. After the first `show` lands, `state.opened` is `true` and SSR is silently ignored. If you need to re-trigger SSR (e.g. on a hard navigation), create a fresh `cuts()` instance.

---

## Migration

For 1.x → 2.x, see [Migration.guide.md](./Migration.guide.md). The headline change: `clickTarget` and `hoverTarget` plugin options became arrays (so you can match multiple attributes per click/hover target). All other cuts API methods are unchanged.

---

## Links

- [Shortcuts documentation](https://github.com/PeterNaydenov/shortcuts) — the input layer that cuts delegates to
- [Changelog](./Changelog.md) — release history
- [Migration guide](./Migration.guide.md) — 1.x → 2.x

---

## Credits

`@peter.naydenov/cuts` was created and is maintained by Peter Naydenov.

---

## License

`@peter.naydenov/cuts` is released under the [MIT License](http://opensource.org/licenses/MIT).
