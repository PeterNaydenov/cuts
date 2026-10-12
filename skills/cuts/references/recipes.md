# Recipes

## Contents
- [Project layout](#project-layout)
- [App shell with pages](#app-shell-with-pages)
- [Modal / confirm dialog](#modal--confirm-dialog)
- [Unsaved-changes guard](#unsaved-changes-guard)
- [Wizard steps](#wizard-steps)
- [Syncing with a URL router](#syncing-with-a-url-router)
- [Mounting framework components](#mounting-framework-components)
- [Testing scenes](#testing-scenes)

## Project layout

One file per scene, each exporting a `{ name, scene }` description. Shared shortcuts live in one module.

```
src/scenes/
    common.js        // shortcuts spread into every scene
    app.js
    users.js
    user.js
    confirm.js
    index.js         // export default [ app, users, user, confirm ]
```

```js
// src/scenes/users.js
import common from './common.js'
export default {
    name  : 'users',
    scene : {
          ...common
        , parents : [ 'app' ]
        , show    : ({ task, dependencies }) => { dependencies.ui.render ( 'users' ); task.done () }
        , hide    : ({ task, dependencies }) => { dependencies.ui.clear ( 'users' ); task.done () }
        , afterShow : ({ dependencies }) => dependencies.api.loadUsers ()
    }
}
```

Scene modules should get services through `dependencies` instead of importing them. This keeps scenes testable and avoids circular imports. To let scenes navigate, put the instance in dependencies: `script.setDependencies ({ script })`.

## App shell with pages

The shell is a root scene. Pages are its children, and switching between sibling pages leaves the shell rendered.

```js
const pages = [ 'dashboard', 'users', 'settings' ]
script.setScenes ([
      { name: 'app', scene: { show: renderShell, hide: removeShell } }
    , ...pages.map ( name => ({
            name
          , scene : {
                  ...common
                , parents : [ 'app' ]
                , show    : ({ task, dependencies }) => { dependencies.ui.page ( name ); task.done () }
                , hide    : ({ task }) => task.done ()
                , 'key: g,u' : ({ dependencies }) => dependencies.script.show ({ scene: 'users' })
            }
        }))
])
```

The shell's shortcuts are inactive while a page is current. Put app-wide keys in `common`.

## Modal / confirm dialog

```js
{
    name  : 'confirm',
    scene : {
          parents : [ '*' ]
        , show : ({ task, dependencies }, { text, onYes }) => {
                    dependencies.ui.openModal ( text )
                    dependencies.pending = onYes
                    task.done ()
                }
        , hide : ({ task, dependencies }) => { dependencies.ui.closeModal (); task.done () }
        , 'key: esc'   : ({ dependencies }) => dependencies.script.hide ()
        , 'key: enter' : async ({ dependencies }) => {
                            const run = dependencies.pending
                            await dependencies.script.hide ()
                            run ()
                        }
    }
}

await script.show ({ scene: 'confirm' }, { text: 'Delete user?', onYes: () => api.delete ( id ) })
```

- Close it with `hide ()`. `show` of the scene underneath does the same.
- Navigation args reach `show` as a second argument. `hide` gets no args from `hide ()`, but gets the next scene's args when a `show` call closes the overlay. Don't let `hide` depend on its args.
- While the modal is current, only its shortcuts fire. Page keys are blocked automatically.

## Unsaved-changes guard

```js
editor : {
      show : ...
    , hide : ...
    , beforeHide : async ({ dependencies }) => {
            const { form, ui } = dependencies
            if ( !form.dirty )   return true
            return ui.nativeConfirm ( 'Discard changes?' )   // resolves true / false
        }
}
```

Use a dialog that is not a cuts scene. The navigation is still running while the guard waits, so `show` of a cuts overlay from the guard is ignored.

## Wizard steps

Make the steps siblings under a root `wizard` scene, so the wizard frame stays rendered and the steps swap inside it. Use `jump` if "Back" must return to the exact previous step.

```js
const steps = [ 'step-1', 'step-2', 'step-3' ]
steps.forEach ( ( name, i ) => scenes.push ({
      name
    , scene : {
          parents : [ 'wizard' ]
        , show    : ({ task, dependencies }) => { dependencies.ui.step ( i ); task.done () }
        , hide    : ({ task }) => task.done ()
        , 'key: enter' : ({ dependencies }) => steps[i+1] && dependencies.script.jump ({ scene: steps[i+1] })
        , 'key: esc'   : ({ dependencies }) => dependencies.script.jumpBack ()
    }
}))
// on finish or cancel:
script.jumpsReset ()
await script.show ({ scene: 'dashboard' })   // closes the current step and 'wizard'
```

## Syncing with a URL router

Cuts doesn't touch the URL. Let the router own the URL and drive cuts from a guard that can cancel. Name the routes after the scenes, and navigate through the router, not by calling cuts from UI code. Vue Router example:

```js
router.beforeEach ( async to => {
        await script.show ({ scene: to.name }, to.params )
        return script.getState ().scene === to.name   // false keeps the old URL when beforeHide blocked the change
})
```

Going to the same scene with new params (`/users/1` → `/users/2`) re-runs its `hide` and `show` with the new params.

## Mounting framework components

`show` mounts, `hide` unmounts, and the framework keeps rendering inside the scene. Vue example:

```js
import { createApp } from 'vue'
import UsersPage from './UsersPage.vue'

let app
export default {
    name  : 'users',
    scene : {
          parents : [ 'app' ]
        , show : ({ task, dependencies }) => {
                    app = createApp ( UsersPage, { api: dependencies.api })
                    app.mount ( '#page' )
                    task.done ()
                }
        , hide : ({ task }) => { app.unmount (); app = null; task.done () }
    }
}
```

React works the same way with `createRoot ( el ).render (...)` / `root.unmount ()`. For click shortcuts, give elements in the component `data-click` attributes (or the attribute set in `clickTarget`).

## Testing scenes

Cuts runs in Node without a DOM as long as no input plugins are enabled. Test navigation by recording calls:

```js
import { it, expect } from 'vitest'
import cuts from '@peter.naydenov/cuts'

it ( 'opens the shell before the page', async () => {
        const calls = []
        const mk = ( name, parents = [] ) => ({ name, scene: {
                  parents
                , show : ({ task }) => { calls.push ( `show ${name}` ); task.done () }
                , hide : ({ task }) => { calls.push ( `hide ${name}` ); task.done () }
            }})
        const script = cuts ({ logLevel: 0 })
        script.setScenes ([ mk ( 'app' ), mk ( 'users', [ 'app' ] ) ])
        await script.show ({ scene: 'users' })
        expect ( calls ).toEqual ([ 'show app', 'show users' ])
        expect ( script.getState ().scene ).toBe ( 'users' )
})
```

To unit test one scene, call its functions directly: `scene.show ({ task: { done: vi.fn () }, dependencies: fakeDeps })`. To test handlers, call `scene[ 'key: ctrl+s' ] ({ dependencies: fakeDeps })`, or call `script.emit ( '@name', ...args )` for custom events while the scene is current.
