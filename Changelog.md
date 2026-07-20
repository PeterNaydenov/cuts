# Release History



## 2.1.7 (2026-07-20)
- [x] Dependency update. Ask-for-promise - v.3.2.0;


## 2.1.6 (2026-07-15)
- [x] Docs: Rewrote README to put the first-time-developer mental model up front — explicit "what cuts is and isn't" framing, scene/parent/overlay/jump mental model, async reference table, per-call-site argument reference, shortcut plugin reference, error reference, SSR section, and full TypeScript public type surface. The previous README was comprehensive but assumed the reader already knew what a "scene manager" was; this one builds the model from scratch;
- [x] Docs: Added an "Improving IntelliSense for shortcut keys" section showing how to augment the `SceneObject` type via TypeScript declaration merging so shortcut keys (e.g. `click: left-1`, `key: ctrl+s`) autocomplete inside scene definitions;
- [x] Types: Expanded the public type surface in `types/main.d.ts` beyond the 2.1.5 baseline. Added: `AskObject`, `ShowContext`/`HideContext`/`AfterShowContext`/`BeforeHideContext`/`ShortcutHandlerContext`, full `SceneObject` (with `show`, `hide`, `afterShow`, `beforeHide`, `parents`, and an index signature for shortcut handlers), `SceneDescription`, `PluginHandle`, and a top-level `CutsAPI` interface that the `cuts()` factory return type now references. Tightened `hide()` to `Promise<void>`. Corrected `CutsState.parents` to `string[] | null` (the runtime returns `null` before the first `show()`). Preserves the 2.1.5 exports (`CutsConfig`, `pluginNames`, `CutsState`);
- [x] Build: Moved the `tsc` postbuild output directory from `types/` to `dist/types/` so the hand-written public type surface is not overwritten on every `npm run build`. Auto-generated internal type artefacts now live in `dist/types/`, matching the typical `dist/` layout for a published library;
- [x] Tests: Added 5 new SSR test cases covering previously-untested paths:
  - `SSR first load + overlay lifts cleanly when navigating away` — wildcard overlay shown on top of an SSR-loaded base, then navigated to an unrelated scene (verifies the overlay lifts, the SSR-loaded base's `hide` fires, and the target is shown in the correct order);
  - `SSR first load + jump stack works for subsequent navigation` — multi-level jump/jumpBack round-trip starting from an SSR-loaded base, including the empty-stack no-op case;
  - `SSR first load + beforeHide guards subsequent navigation` — confirms that an SSR-loaded scene's `beforeHide` is still honoured by subsequent navigation, matching the behaviour of a normally-loaded scene;
  - `SSR first load + hide() closes the SSR-loaded scene` — verifies `hide()` with no argument correctly tears down a scene that was never `show()`-n;
  - `SSR first load + hide("*") climbs back through the recorded parent chain` — regression test for the 2.1.4 SSR-parents fix, ensuring `hide('*')` walks the full ancestor chain in the correct order on a deep SSR-loaded scene;

No breaking changes to the public API. Existing callers continue to type-check: `cuts({ logLevel: 1 })`, `setScenes([...])`, `getState()` callers, etc. all keep working. No dependency updates.



## 2.1.5 ( 2026-07-09 )
- [x] Types: `CutsConfig` is now an exported type in `types/main.d.ts` with `logLevel?: 0 | 1`. Previously only documented in README, not in the type declarations;
- [x] Types: `pluginNames` is now an exported union type (`'Key'|'Click'|'Form'|'Hover'|'Scroll'`) in `types/main.d.ts`, matching the values accepted by `loadPlugins`;
- [x] Types: new exported `CutsState` type in `types/main.d.ts` (`{ scene, parents, opened }`), used as the return type of `getState()`;
- [x] Types: `getState()` now returns `CutsState` instead of untyped `Object` — IntelliSense now autocompletes `{ scene, parents, opened }`;
- [x] Types: `hide()` return type corrected to `Promise<void>` instead of `Promise<any>`;
- [x] Fix: `jumpBack()` function body renamed from `jumpReset` to `jumpsReset` — implementation now matches the exported name;
- [x] Types: `jumpBack()` parameter default documented as `@param {number} [options.hops=1]` instead of the previous non-standard `{hops}=...` form;
- [x] Types: `hide()` `@param` annotation now clarifies the default (`1` = current scene only) and the `'*'` wildcard meaning;
- [x] Docs: README note on `logLevel` type updated from `logLevel: number` to `logLevel?: 0 | 1` to match the new typedef;
- [x] Fix: `beforeHide` now works correctly when it returns a Promise. Previously the return value was ignored entirely — async blocking logic (e.g. confirm dialogs) was silently broken, and the navigation proceeded before the Promise resolved. Both `show()` and `hide()` now detect Promise returns and await them before calling `unloadTask.done`. Errors in the Promise chain are caught and treated as `done(false)`;
- [x] Fix: scene functions (`show`/`hide`) that reject without being caught no longer produce unhandled promise rejections. `setInstruction` wraps the returned promise with `.catch(() => {})`. `jump()` and `jumpBack()` do the same on their `show()` call;
- [x] Tests: two new regression tests for async `beforeHide` — one verifying navigation is blocked when the Promise resolves to `false`, one verifying it proceeds when the Promise resolves to `true`;



## 2.1.4 ( 2026-07-09 )
- [x] Fix: `hide()` with the default single step (or any `endSteps` short of the full chain) left `currentScene`/`currentParents` pointing at the just-hidden scene instead of climbing to its still-visible parent, so no scene's shortcuts context was active afterward. This affected every nested scene, not only wildcard overlays - the 2.1.3 fix was scoped too narrowly. `hide()` is rewritten to climb the recorded ancestor chain directly, which also removes the need for the wildcard-specific special-casing from 2.1.3;
- [x] Fix: server-side-rendered (`options.ssr: true`) first loads never recorded the scene's `parents`, so navigating away from a deep SSR-loaded scene skipped hiding its ancestors entirely, leaving them stale;
- [x] Docs: `afterShow`'s typedef claimed it could return `false` to cancel the show - it never could (the return value was always ignored) and the README never documented that behavior either. The typedef now describes the actual fire-and-forget contract;
- [x] Fix: `hide()` never checked `beforeHide`, so it always bypassed the "prevent navigation away" guard that `show()` already respected - calling `hide()` directly could skip it entirely even when it returned `false`;
- [x] Fix: `jump()` pushed onto the jump stack unconditionally, even when the underlying navigation was blocked (eg. by `beforeHide`) or failed - leaving a phantom entry that desynced `jumpBack()` from what actually happened;
- [x] Fix: `show()` passed `state.currentParents` into `findInstructions` by reference; since `findInstructions` is a lazy generator, mutating that same array mid-iteration (as the wildcard-overlay climb in `getStep` now does) corrupted its still-pending computation and silently dropped a `hide` step, leaking the scene an overlay was covering as permanently visible after navigating elsewhere;
- [x] Fix: showing a wildcard-overlay scene with no underlying scene (`currentScene` was `null`) recorded a literal `null` placeholder in `currentParents`, which crashed any later navigation away from it;
- [x] Fix: re-showing a wildcard-overlay scene while it was already current pushed it onto its own ancestor chain, so a later `hide()` reported the overlay as still current even though it had actually just been hidden;



## 2.1.3 ( 2026-07-09 )
- [x] Fix: `getState()` returned a live reference to `state.currentParents` instead of a copy; a caller mutating the returned array corrupted cuts' own internal state;
- [x] Fix: `hide()` on a wildcard-overlay scene left `currentScene`/`currentParents` pointing at the (now-hidden) overlay instead of climbing back to the scene it was shown on top of, so that scene's shortcuts context never reactivated;
- [x] Fix: `cuts({ logLevel: 0 })` didn't actually silence errors - `cfg.logLevel || 1` treated the explicit `0` as falsy and forced it back to `1`, and even after correcting that, the internal log callback never checked the configured level before emitting `@app-error`;



## 2.1.2 ( 2026-07-09 )
- [x] Fix: `show()` crashed when a scene with `parents: ['*']` was the very first scene shown (`state.currentParents` was read before being initialized);
- [x] Fix: `hide()` (including `hide('*')` and multi-step `hide(n)`) left `currentScene`/`currentParents` stale instead of updating them as each parent scene was closed;
- [x] Fix: `listShortcuts()` still excluded the old `beforeUnload`/`afterLoad` property names, so the current `beforeHide`/`afterShow` scene methods leaked into the returned shortcuts list;
- [x] Fix: `@app-error` handlers received a `{ dependencies, type: 'custom' }` context object instead of the log entry, because `@peter.naydenov/shortcuts` v4.1.x's `emit()` now injects that context ahead of the forwarded arguments. Cuts now emits through the raw (unwrapped) emitter for its internal error event;
- [x] Fix: `script.emit()` had the same issue - listeners now receive exactly the arguments passed to `emit()`, with no injected context object;
- [x] Fix: showing a wildcard-overlay scene (`parents: ['*']`) never switched the shortcuts context to it, so the overlay's own shortcut and event handlers never fired;
- [x] Fix: showing a wildcard-overlay scene aliased `state.currentParents` to the underlying scene's own `parents` array; pushing onto it permanently corrupted that scene's `parents` definition and crashed later navigation back to it;




## 2.1.1 ( 2026-07-08 )
- [x] Dependency update. @peter.naydenov/shortcuts - v.4.1.2 
- [x] (fixes TypeScript declaration emit for `PluginAPI` and `ShortcutsAPI`);



## 2.1.0 ( 2026-06-07 )
- [x] Dependency update. @peter.naydenov/shortcuts - v.4.1.0;
- [x] Now each event callback has dependencies.emit. Chains of events are getting easier;


## 2.0.3 ( 2026-04-23 )
- [x] Dependency update. ask-for-promise - v.3.1.1;



## 2.0.2 ( 2026-04-02 )
- [x] Dependency update. @peter.naydenov/shortcuts - v.4.0.2;



## 2.0.1 ( 2026-03-24 )
- [x] Dev dependency update. Typescript - v.6.0.2;
- [x] Rebuild types according the new version of typescript;



## 2.0.0 ( 2025-11-09 )
- [x] All 'cuts' errors goes to '@app-error' event;
- [x] Configuration 'logLevel' default value is 1. If you want to dissable errors logging, set 'logLevel' to 0;
- [x] Code cleaning. Removing unused code;
- [x] Test code coverage on 85%;
- [x] Fix: SSR option for first scene loading;
- [x] Shortcuts version 4.0.0. New shortcut plugins - 'scroll' and 'hover';




## 1.5.0 ( 2025-10-23 )
- [x] Dependency update. @peter.naydenov/shortcuts - v.3.5.1
- [x] Dev dependency update. Vitest - v.4.0.1
- [x] Cuts has event '@app-error'. Shortcut errors will trigger this event;
- [x] Type improvements;
- [x] New method `getState` returns an object with the current state;
- [x] Fix: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



## 1.4.4 ( 2025-10-10)
- [x] Dependency update. @peter.naydenov/shortcuts - v.3.3.1 ( fixing problem with 'key:specialCharacters' events);
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



## 1.4.3 ( 2025-09-30)
- [x] Dependency update. ask-for-promise@3.0.2;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



## 1.4.2 ( 2025-09-29)
- [x] Dependency update. @peter.naydenov/shortcuts@3.3.0;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



## 1.4.1. ( 2025-09-24)
- [x] Fix: Cleaning a duplicated line of code in main.js;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


## 1.4.0 ( 2025-09-06)
- [x] New methods: jump, jumpBack, jumpsReset;
- [ ] Bug: Duplicated line of code in main.js;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


## 1.3.1 ( 2025-08-15)
- [ ] Fix: Missing typedef for plugin 'form'
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


## 1.3.0 ( 2025-08-15)
- [x] Dependency update. @peter.naydenov/shortcuts@3.1.5. Plugin 'form' is available;
- [ ] Miss: Missing typedef for plugin 'form'
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


## 1.2.8 ( 2025-05-03)
- [x] Dependency update. @peter.naydenov/shortcuts@3.1.4;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.2.7 ( 2025-02-04)
- [x] Dependency update. @peter.naydenov/log@1.1.1;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.2.6 ( 2025-01-23)
- [x] Improve: Warn that the scene is not defined if scene is set to null;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.2.4 ( 2025-01-15)
- [x] Dependency update. @peter.naydenov/shortcuts@3.1.3;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.2.3 ( 2024-12-23)
- [x] Dependency update. @peter.naydenov/shortcuts@3.1.2;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


### 1.2.2 ( 2024-12-22 )
- [x] Fix: Wrong argument 'dependencies' for 'beforeHide' and 'afterShow' methods;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;

### 1.2.1 ( 2024-12-21 )
- [x] Fix: Wrong settings if missing 'beforeHide' method;
- [ ] Bug: Wrong argument 'dependencies' for 'beforeHide' and 'afterShow' methods;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


### 1.2.0 (2024-12-21)
- [x] Extend 'scene' with optional 'afterShow' and 'beforeHide' methods;
- [ ] Bug: Wrong settings if missing 'beforeHide' method;
- [ ] Bug: Wrong argument 'dependencies' for 'beforeHide' and 'afterShow' methods;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.1.0 (2024-12-13)
- [x] Type improvements;
- [x] Refactoring related to types;
- [x] New method `loadPlugins` to load shortcut plugins: `Key`, `Click` or both;
- [x] Method 'setScene' errors goes to '@app-error'
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.0.2 (2024-12-12)
- [x] Create d.ts files in folder 'types';
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.0.1 (2024-05-10)
- [x] Fix: Repository address in package.json;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.0.0 (2024-05-08)
- [x] Initial release;


