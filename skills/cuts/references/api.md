# API reference

## Contents
- [Factory](#factory)
- [Methods](#methods)
- [Per-call-site arguments](#per-call-site-arguments)
- [Errors](#errors)
- [SSR hydration](#ssr-hydration)
- [Types](#types)

## Factory

```js
import cuts from '@peter.naydenov/cuts'          // default export
const script = cuts ({ logLevel: 1 })            // 1 (default) publishes cuts errors on '@app-error'; 0 = silent
```

## Methods

| Method | Returns | Notes |
|---|---|---|
| `show ({ scene, options? }, ...args)` | `Promise` | Resolves when the transition finishes, is cancelled or fails. `options.ssr` — see [SSR](#ssr-hydration). |
| `hide ( endSteps? )` | `Promise` | `1` (default), a number, or `'*'`. Resolves without changes if no scene is current. |
| `jump ({ scene }, ...args)` | `Promise` | `show` + push the previous scene on the jump stack if the target was reached. |
| `jumpBack ({ hops? }?, ...args)` | `Promise \| undefined` | `undefined` when the stack has fewer than `hops` entries. Stack entries are removed only if the navigation lands. |
| `jumpsReset ()` | `void` | Clears the jump stack. |
| `setScenes ( list )` | `void` | `list` = `[{ name, scene }]`. Can be called again to add scenes. Registering an existing name replaces it. Invalid items are logged and skipped. |
| `listScenes ()` | `string[]` | Registered names. |
| `listShortcuts ( sceneName )` | `string[] \| null` | Keys of the scene object, without `show`, `hide`, `parents`, `afterShow`, `beforeHide`. Names are not normalized. `null` for an unknown scene. |
| `setDependencies ( deps )` | `void` | Merges into the dependencies bag. |
| `getDependencies ()` | `object` | The live bag, including `emit`. |
| `setNote ( note )` | `void` | String passed to shortcut handlers as `data.note`. |
| `loadPlugins ( names )` | `Promise<Function[]>` | `names` from `'Key' \| 'Click' \| 'Form' \| 'Hover' \| 'Scroll'`. Handles come back in the same order. |
| `enablePlugin ( handle, options? )` | `void` | App-wide plugin options. Option names are in the shortcuts skill. |
| `disablePlugin ( name )` | `void` | Plugin name, case-insensitive: `'Click'` or `'click'`. |
| `getState ()` | `{ scene, parents, opened }` | A copy. `scene` is `null` when nothing is current, `parents` is `null` before the first `show`, and `opened` is `false` until a `show` lands. For an overlay, `parents` contains the scene underneath it. |
| `emit ( name, ...args )` | `void` | Calls handlers for `name` in the current scene with exactly `args`. Use custom `@names`; plugin names like `'key: ctrl+s'` are not normalized and won't match. |

## Per-call-site arguments

| Function | Receives |
|---|---|
| `show` / `hide` | `({ task, dependencies }, ...navigationArgs)` — call `task.done ()` |
| `afterShow` | `({ dependencies, done })` — `done` is a no-op; return value ignored |
| `beforeHide` | `({ dependencies, done })` — `done ( boolean )`, or return `Promise<boolean>` |
| plugin shortcut (`'key: …'`, `'click: …'`, …) | The shortcuts action data object: `{ context, note, dependencies, options, viewport, type, …plugin fields }`. Field lists are in the shortcuts skill. `context` is the scene name. |
| `'<plugin>: setup'` | `({ dependencies, defaults, options })` — return option overrides for this scene |
| custom event via `emit` | Exactly the emitted arguments |
| `'@app-error'` | A cuts log entry `{ message, type: 'error', level, logLevel }`, or a message string from shortcuts |

`dependencies` always contains `emit` and everything passed to `setDependencies`.

## Errors

Cuts never throws for these. With `logLevel: 1` they are published on `'@app-error'` and reach the handler on the current scene.

| Message | Cause |
|---|---|
| `Scene "X" is not available.` | `show`/`jump` to an unregistered name. Navigation is skipped. |
| `Some of 'X' parent scenes are not set.` | An ancestor in `X.parents` isn't registered. Navigation is skipped. |
| `Scene name is not defined` | `setScenes` item without `name`. |
| `Scene X is not defined` | `setScenes` item without `scene`. |

`setScenes` errors reach a handler only if a scene with `'@app-error'` is already current. At startup, check `listScenes ()` after registering. For a global error handler, spread `'@app-error'` into every scene.

## SSR hydration

When the server already rendered a scene, record it without running its `show`:

```js
const script = cuts ()
script.setScenes ( scenes )
await script.show ({ scene: 'user', options: { ssr: true } })
// no show() calls, afterShow of 'user' runs; state = { scene: 'user', parents: [ 'app', 'users' ], opened: true }; context 'user' active
```

- It works only for the first `show` of a fresh instance. Later, the flag is ignored.
- The ancestors are assumed to be rendered too, and later navigation hides them normally.
- Only `show` is skipped. `afterShow` runs as usual, so put client-only setup (data refresh, analytics) there.

## Types

From `@peter.naydenov/cuts`: `CutsAPI`, `CutsConfig`, `LogLevel`, `SceneObject`, `SceneDescription`, `ShowContext`, `HideContext`, `AfterShowContext`, `BeforeHideContext`, `ShortcutHandlerContext`, `AskObject`, `Dependencies`, `CutsState`, `PluginName`, `PluginHandle`.

`SceneObject` has an open index signature for shortcut keys. For autocomplete, augment it:

```ts
declare module '@peter.naydenov/cuts' {
  interface SceneObject {
    [key: `key: ${string}` | `click: ${string}` | `@${string}`]: ( ...args: any[] ) => any
  }
}
```
