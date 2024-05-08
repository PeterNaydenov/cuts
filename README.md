# Cuts (@peter.naydenov/cuts)

![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/peterNaydenov/cuts/main)
![GitHub License](https://img.shields.io/github/license/peterNaydenov/cuts)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40peter.naydenov%2Fcuts)


In filmmaking, a change of scene is typically referred to as a "**cut**". Cuts are an essential part of film editing and are used to create a cohesive narrative by connecting different scenes together.

Let's define SPA application as a set of scenes (pages/visual states) and each scene discribes a visual elements on the page and possible user interaction ( mouse, keyboard, etc.). **Cuts** controls the flow among scenes in SPA application.

When all interactions can be described in the **Scene** data models, means that the components (react,vue, svelte or any other framework) can be used as simple template engines - to render only html.




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





## Screen Cuts Methods Overview

```js
  setScenes       : 'Provide list of scenes to the app'
, show            : 'Change the current scene'
, hide            : 'Hide the current scene'
, listScenes      : 'List of loaded Scene names'
, listShortcuts   : 'List shortcuts per Scene. Provide the name of the Scene'
, setDependencies : 'Add object to the "dependencies" object. This object will be passed to the Scene "show" method'
, getDependencies : 'Returns the "dependencies" object'
, enablePlugin    : 'Enable a shortcut plugin. Available after version 1.1.0'
, disablePlugin   : 'Disable a shortcut plugin. Available after version 1.1.0'
, emit            : 'Emit an event. Available after version 2.0.0'
```



## Scene

Scene is a data model that describes how to render the scene and how the user will interact with it ( mouse, keyboard, etc.):

```js
{
    show    // method. Returns a promise
  , hide    // method. Returns a promise
  , parents // list of parent Scene names.
  // ... shortcuts for all user interactions with the screen ( mouse, keyboard, etc.)
  // Shortcuts are implemented with @peter.naydenov/shortcuts
}
```


Scenes can be `visible`(show) and `unvisible`(hide), also some scenes can be a child of another scene. Every scene can be treated as a visual state of the application. All provided to script `Scenes` are available on demand by calling them with a simple instruction `show({scene:sceneName})`. What should be visible and what should be unvisible is managed by the library.





## Links
- [History of changes](https://github.com/PeterNaydenov/cuts/blob/main/Changelog.md)
- [Learn how shortcuts are implemented](https://github.com/PeterNaydenov/shortcuts)




## Credits
'@peter.naydenov/cuts' was created and supported by Peter Naydenov.



## License
'@peter.naydenov/cuts' is released under the [MIT License](http://opensource.org/licenses/MIT).