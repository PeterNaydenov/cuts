<img src="https://github.com/PeterNaydenov/cuts/blob/main/cuts.png" width="100%" alt="Cuts" align="center" />



# Cuts (@peter.naydenov/cuts)

![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/peterNaydenov/cuts/main)
![GitHub License](https://img.shields.io/github/license/peterNaydenov/cuts)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40peter.naydenov%2Fcuts)


`An abstract idea of a cut`: In filmmaking, a change of scene is typically referred to as a "**cut**". Cuts are an essential part of film editing and are used to create a cohesive narrative by connecting different scenes together.

## Description
Let's define SPA application as a set of scenes (context/visual states) and each scene discribes a visual elements on the page and possible user interaction ( mouse, keyboard, scroll, hover, etc.). **Cuts** controls the flow among scenes in SPA application.

Behaviour description is based on '[@peter.naydenov/shortcuts](https://github.com/PeterNaydenov/shortcuts)' and every scene is a different shortcuts context.



## Why Cuts?
 - SPA as a set of many scenes: Every scene can be developed and tested separately;
 - Easy for reshape the flow of the application;
 - Many developers can work toghether on the same project without conflicts;
 - User interaction is easy to read and solve some problems of native DOM events;
 - As user interaction is defined separately from the html markup, you have large choice of frameworks and template engines (react, vue, svelte, [morph](https://github.com/PeterNaydenov/morph), mustache, handlebars, etc.) to build your application visually;
 - As user interaction is defined separately, visual components can be reused many times with different user interaction on each reuse;




## Installation

```
npm install @peter.naydenov/cuts
```



## Usage

```js
import cuts from '@peter.naydenov/cuts'

const script = cuts ();

script.setScenes () // provide list of Scenes to the app
script.setDependencies () // add object to the "dependencies" object. This object will be passed to the Scene "show" method
// script is ready to use
script.show ({ scene : 'sceneName'}) // change the current Scene

```




## Configuration

`cuts()` accepts an options object. Currently one option is supported: [`logLevel`](#loglevel-default--1). See the [`@app-error`](#app-error) section for details on how it affects event emission.





## Screen Cuts Methods Overview

```js
  setScenes       : 'Provide list of scenes to the app'
, show            : 'Change the current scene'
, hide            : 'Hide the current scene'
, jump            : 'Go to the requested scene but remember the current scene'
, jumpBack        : 'Jump back to the scene before the jump'
, jumpsReset      : 'Reset the jump stack'
, listScenes      : 'List of loaded Scene names'
, listShortcuts   : 'List shortcuts per Scene. Provide the name of the Scene'
, setDependencies : 'Add object to the "dependencies" object. This object will be passed to the Scene "show" and "hide" methods and events descriptors'
, getDependencies : 'Returns the "dependencies" object'
, enablePlugin    : 'Enable a shortcut plugin.' 
, disablePlugin   : 'Disable a shortcut plugin.'
, getState        : 'Get the current state of the application'
, emit            : 'Emit an event'
```



## Scene

Scene is a data model that describes how to render the scene and how the user will interact with it ( mouse, keyboard, etc.):

```js
{
    show       // method. Returns a promise
  , afterShow  // method. Starts after the scene is shown (optional)
  , hide       // method. Returns a promise
  , beforeHide // method. Starts before the scene is hidden (optional)
  , parents    // list of parent Scene names.
  // ... shortcuts for all user interactions with the screen ( mouse, keyboard, etc.)
  // Shortcuts are implemented with @peter.naydenov/shortcuts
}
```


Scenes can be `visible`(show) and `unvisible`(hide), also some scenes can be a child of another scene. Every scene can be treated as a visual state of the application. All provided to script `Scenes` are available on demand by calling them with a simple instruction `show({scene:sceneName})`. What should be visible and what should be unvisible is managed by the library.



## AfterShow and BeforeHide

AfterShow and BeforeHide are optional methods that coming after version 1.2.x. `Aftershow` is created to run a javascript, that we normally want to 'deffer'. They are not related to showing the scene, could need more time to execute and don't have user interaction triggers. Something like 'document.onload' but here in a context of SPA.

`BeforeHide` is function that will run before navigation away from the scene. It's inspired by the `beforeunload` event. Here we can write code that will prevent navigation away from the scene. Should return a boolean. If true, navigation will be allowed, if false, navigation will be prevented.


## Jump, JumpBack and JumpsReset methods

Jump and JumpBack are created to simplify scene navigation flow. `Jump` will change the current scene as show method, but will remember the current scene as a point to return. `JumpBack` will go back to the scene before the jump. You can have multiple jumps. All scene names are recorded in the jump stack and you can getback to any scene in the stack. `JumpsReset` will reset the memory of the jump stack.

```js
script.show ({ scene : 'test' }) // Will load the 'test' scene. No memory
script.jump ({ scene : 'blue' }) // Will load the 'blue' scene. Will remember 'test' scene in the jump stack
script.jump ({ scene : 'green' }) // Will load the 'green' scene. Will remember 'blue' scene in the jump stack

script.jumpBack () // Will load scene from the jump stack. Will load 'blue' scene
script.jumpBack () // Will load scene from the jump stack. Will load 'test' scene
script.jumpBack () // Will do nothing. No more scenes in the jump stack

// Let's imagine that we made some jumps already. Our jumpStack is ['test', 'blue']
// If we want to go back few steps back, we can use the 'hops' parameter
script.jumpBack ({hops:2}) // Will load scene from the jump stack. Will load 'test' scene
// Default value for the 'hops' parameter is 1
```



## Plugin Configuration

Shortcuts has a plugin system. To load them, use the `loadPlugins` method.

```js
import cuts from '@peter.naydenov/cuts'

const 
     script = cuts ()
   , [ pluginClick, pluginHover] = await script.loadPlugins(['Click', 'Hover'])
   ;

// Enable click plugin
script.enablePlugin ( pluginClick )

// Enable hover plugin 
script.enablePlugin ( pluginHover )
```


**Available Plugins in v4.x.x:**
- **Key**: Keyboard shortcuts
- **Click**: Mouse click events  
- **Form**: Form input events
- **Hover**: Mouse hover events (new in v4.0.0)
- **Scroll**: Scroll events (new in v4.0.0)





## Events

Cuts emits a single built-in event and exposes a passthrough for custom events.

### `@app-error`

Triggered whenever an error is logged inside cuts (scene not found, invalid context, shortcut error, etc.). Register a handler in a scene's shortcuts:

```js
const script = cuts ({ logLevel: 1 });

script.setScenes ([
  {
    name: 'home',
    scene: {
      show     : ({ task }) => task.done(),
      hide     : ({ task }) => task.done(),
      '@app-error' : ( logEntry ) => {
                          // logEntry: { type: 'error', message: 'Scene "X" is not available.', ... }
                          console.error ( '[cuts]', logEntry.message )
                      }
    }
  }
])
```

The handler receives the raw log entry produced by `@peter.naydenov/log`. It has at least `{ type: 'error', message: <string> }`; the full shape is whatever the log library reports. The event name is fixed and cannot be renamed from the cuts configuration.

#### `logLevel` (default: `1`)

Whether `@app-error` fires depends on the `logLevel` option passed to `cuts()`. Internally cuts uses `@peter.naydenov/log` to emit its log entries (scene not found, invalid context, etc.). A log entry is processed only when its level is less than or equal to the configured `logLevel`. Cuts logs only at level `1`, so the only meaningful values are:

- **`1` (default)** — errors are logged. The log callback fires for every error, which is what re-emits each one as `@app-error`. Use this when you want cuts to surface problems to your code.
- **`0`** — completely silent. No log output, and **no `@app-error` events are emitted**. Use this in production if you don't want to handle cuts errors at the event level.

```js
// Default: errors fire @app-error
const script = cuts ();

// Silent: no @app-error events
const script = cuts ({ logLevel: 0 });
```

The option is also exposed in `types/main.d.ts` as `logLevel: number`.

### Custom events via `emit`

Cuts does not define additional events, but it forwards `script.emit(event, ...args)` to the underlying shortcuts manager. Custom event handlers are registered inside a scene's `scene` object - same place as `@app-error`, just under any name you choose.

Full round-trip: define, register, emit, handle.

```js
import cuts from '@peter.naydenov/cuts'

const script = cuts ()

// 1. Register a handler inside a scene, keyed by your custom event name
script.setScenes ([
  {
    name: 'home',
    scene: {
      show         : ({ task }) => task.done(),
      hide         : ({ task }) => task.done(),

      // Custom event handler. Receives whatever args `script.emit` passed.
      '@analytics' : ( payload ) => {
                          // payload === { event: 'scene-entered', scene: 'home', ts: 1700000000000 }
                          console.log ( '[analytics]', payload )
                      }
    }
  }
])

// 2. Trigger it from anywhere you have a reference to `script`
await script.show ({ scene: 'home' })

script.emit ( '@analytics', {
                  event : 'scene-entered'
                , scene : 'home'
                , ts    : Date.now ()
            })
```

Event name convention: use a plugin-style prefix to avoid collisions with built-in shortcuts (e.g. `@my-app:foo` or `@analytics`). Any string works; a leading `@` is a common convention but not required.

A handler is only active while its scene is the current context. To make a handler global, register it on every scene, or wire it to a scene that stays mounted (e.g. a root scene).




## Links
- [Shortcuts documentation - @peter.naydenov/shortcuts](https://github.com/PeterNaydenov/shortcuts)
- [History of changes](https://github.com/PeterNaydenov/cuts/blob/main/Changelog.md)
- [Migration Guide](https://github.com/PeterNaydenov/cuts/blob/main/Migration.guide.md)



## Credits
'@peter.naydenov/cuts' was created and supported by Peter Naydenov.



## License
'@peter.naydenov/cuts' is released under the [MIT License](http://opensource.org/licenses/MIT).