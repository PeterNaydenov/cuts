# Navigation

## Contents
- [Scene tree](#scene-tree)
- [How show() computes a transition](#how-show-computes-a-transition)
- [hide() steps](#hide-steps)
- [Overlays: parents ['*']](#overlays-parents-)
- [Jump stack](#jump-stack)
- [Guards: beforeHide](#guards-beforehide)
- [One navigation at a time](#one-navigation-at-a-time)
- [Shortcut context during transitions](#shortcut-context-during-transitions)

## Scene tree

`parents` describes where a scene sits in a tree. It is the full path from the root to the direct parent:

```
app                         parents: []
├── users                   parents: [ 'app' ]
│   └── user                parents: [ 'app', 'users' ]
└── settings                parents: [ 'app' ]
login                       parents: []
confirm (overlay)           parents: [ '*' ]
```

While `user` is current, `app` and `users` are open (rendered) underneath it, but only `user`'s shortcuts are active.

## How show() computes a transition

Cuts compares the current path with the target path, position by position, and keeps the shared prefix open. Using the tree above:

| From | `show` target | Calls, in order |
|---|---|---|
| nothing | `user` | show `app` → show `users` → show `user` |
| `users` | `user` | show `user` (target is a descendant; nothing closes) |
| `user` | `settings` | hide `user` → hide `users` → show `settings` |
| `user` | `users` | hide `user` (target is already open underneath) |
| `user` | `app` | hide `user` → hide `users` |
| `settings` | `login` | hide `settings` → hide `app` → show `login` (different branch) |
| `users` | `users` | hide `users` → show `users` (re-show / refresh) |

Rules:
- Calls run in sequence. Each one waits for the previous `task.done ()`.
- When the target is already open underneath the current scene, it is **not** shown again. Only the scenes above it are hidden, the same as `hide ( n )`.
- `afterShow` runs once, for the target only, after the whole sequence.
- Extra `...args` passed to `show` reach every `show` and `hide` in the sequence: `show ({ scene: 'settings' }, x)` from `users` calls `users.hide ( ctx, x )` and `settings.show ( ctx, x )`.

## hide() steps

`hide ( endSteps = 1 )` closes the current scene and climbs toward the root:

| From `user` | Calls | New current |
|---|---|---|
| `hide ()` | hide `user` | `users` |
| `hide ( 2 )` | hide `user` → hide `users` | `app` |
| `hide ( '*' )` | hide `user` → hide `users` → hide `app` | `null` (all shortcuts off) |

The scene you return to is not shown again, because it was never closed. `hide` takes no extra arguments. Shortcuts are paused while the hide sequence runs.

Calling `hide ()` when nothing is current resolves without doing anything.

## Overlays: parents ['*']

An overlay goes on top of whatever is current, without a fixed place in the tree. Use it for modals, drawers, toasts and confirm dialogs.

- `show ({ scene: 'confirm' })` runs only `confirm.show`. The scene underneath stays rendered, and its name is added to the parent chain.
- `hide ()` from the overlay runs `confirm.hide` and makes the underlying scene current again, with its shortcuts.
- `show` of another scene from an overlay closes the overlay first, then transitions from the underlying scene as usual. From a `confirm` over `users`, `show ({ scene: 'settings' })` runs hide `confirm` → hide `users` → show `settings`.
- `show` of the scene underneath (or any open ancestor) just lifts the overlay, the same as `hide ()`.
- Showing an overlay from another overlay stacks it: each `hide ()` lifts one.
- Showing the overlay that is already current runs its `show` again without stacking it on itself.
- An overlay shown when nothing is current has no scene to return to. `hide ()` leaves nothing current.

An overlay's `afterShow` and `beforeHide` work like on any other scene.

## Jump stack

`show` doesn't remember where you came from. `jump` does:

```js
await script.show ({ scene: 'users' })
await script.jump ({ scene: 'settings' })   // stack: [ 'users' ]
await script.jump ({ scene: 'login' })      // stack: [ 'users', 'settings' ]
await script.jumpBack ()                    // show 'settings' → stack: [ 'users' ]
await script.jumpBack ()                    // show 'users'    → stack: []
script.jumpBack ()                          // undefined, no-op
```

- Use `jump` for detours you return from (help screen, settings opened from anywhere, login interruption). Use `show` for normal forward navigation.
- `jumpBack` navigates with a normal `show`, so the transition rules above apply and `beforeHide` can cancel it. Entries are removed only when it lands, so a cancelled Back leaves the stack as it was and can be retried.
- `jumpBack ({ hops: n })` returns to the `n`-th entry from the top and removes all `n` entries. With fewer than `n` entries it returns `undefined` and changes nothing.
- `jump` pushes only when navigation lands on the target. Blocked or invalid jumps leave the stack unchanged.
- Plain `show` and `hide` don't touch the stack. Call `jumpsReset ()` when the user's flow restarts (logout, new document), or `jumpBack` may return to stale scenes.

## Guards: beforeHide

`beforeHide` of the **current** scene runs before `show`, `jump`, `jumpBack` and `hide`. It runs before anything is torn down, so cancelling leaves everything as it was.

```js
beforeHide : ({ done, dependencies }) => {
        if ( !dependencies.form.dirty )   return done ( true )
        dependencies.ui.confirm ( 'Discard changes?' ).then ( ok => done ( ok ) )
}
// or
beforeHide : async ({ dependencies }) => !dependencies.form.dirty || await dependencies.ui.confirm ( 'Discard changes?' )
```

Ancestors closed by the same transition do not run their guards. If an ancestor holds unsaved state, check it in the current scene's guard. Don't show a cuts overlay from inside `beforeHide`: the navigation is still running, so the call is ignored. Use a non-scene dialog for the question.

## One navigation at a time

While a navigation (`show`, `hide`, `jump`, `jumpBack`) is running, new navigation signals are **ignored**: they resolve at once without changes. "Running" lasts until every `show`/`hide` in the transition has called `task.done()`, including the wait for a `beforeHide` answer. Once the scene is ready, signals are accepted again.

A scene's `show` and `hide` load and release the scene's resources; they are not meant to navigate. If a scene needs to send the user on (a redirect), do it from `afterShow`, which runs when the scene is ready.

Two quick clicks on `settings` and `users` while on `users`: the move to `settings` completes, and the `users` click is ignored. Ignored `jump` calls don't push and ignored `jumpBack` calls don't pop the jump stack.

## Shortcut context during transitions

- The context switches to the target scene when the transition finishes, before `afterShow`.
- After `hide ( '*' )` the context is cleared and no shortcuts fire until the next `show`.
- Handlers on scenes that are open but not current are inactive. To keep a key working across a whole branch, spread it into every scene of the branch.
