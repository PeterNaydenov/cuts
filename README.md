# Screen Writer (@peter.naydenov/screen-writer)
*Warning: The library is experimental and is not ready for production use*

![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/peterNaydenov/screen-writer/main)
![GitHub License](https://img.shields.io/github/license/peterNaydenov/screen-writer)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40peter.naydenov%2Fscreen-writer)



Writing a SPA applications as writing a movie script - describe a set of stages (visual states). Each stage describes how the visual part of the application should look like and how the user will interact with it ( mouse, keyboard, etc.). Stages are described by **JS-page** data models. 

Build a relationship between stages and you will have a tree of visual states that can be traversed with a single programing instruction.

When all interactions can be described in the JS-page data models, means that the components (react,vue, svelte or any other framework) can be used as simple template engines - to render only html. 




## Installation

```
npm install @peter.naydenov/screen-writer
```



## Usage

```js
import screenWriter from '@peter.naydenov/screen-writer'

const script = screenWriter ();

script.setPages () // provide list of JS-pages to the app
script.setDependencies () // add object to the "dependencies" object. This object will be passed to the JS-page "show" method
// script is ready to use
script.turnTo ({ page : 'pageName'}) // change the current JS-page
```





## Screen Writer Methods Overview

```js
  setPages        : 'Provide list of JS-pages to the app'
, turnTo          : 'Change the current JS-page'
, close           : 'Close the current JS-page'
, listPages       : 'List of loaded JS-pages names'
, listShortcuts   : 'List shortcuts per JS-page. Provide the name of the JS-page'
, setDependencies : 'Add object to the "dependencies" object. This object will be passed to the JS-page "show" method'
, getDependencies : 'Returns the "dependencies" object'
, enablePlugin    : 'Enable a shortcut plugin. Available after version 1.1.0'
, disablePlugin   : 'Disable a shortcut plugin. Available after version 1.1.0'
```

* Version 1.1.0 - first version of the library based on `@peter.naydenov/shortcuts` version 3.0.0. 

## JS-page

JS-page is a data model that describes how to render a specific stage and how the user will interact with it ( mouse, keyboard, etc.):

```js
{
    show    // method. Returns a promise
  , hide    // method. Returns a promise
  , parents // list of parent JS-pages names.
  // ... shortcuts for all user interactions with the screen ( mouse, keyboard, etc.)
  // Shortcuts are implemented with @peter.naydenov/shortcuts
}
```


JS-pages can be `opened` and `closed`, also some pages can be a child of another page. Every JS-page is a can be treated as a visual state of the application. All provided to script `JS-pages` are available on demand by calling them with a simple instruction `turnTo({page:pageName})`. What should be opened and what should be closed is managed by the library.





## Links
- [History of changes](https://github.com/PeterNaydenov/screen-writer/blob/main/Changelog.md)
- [Learn how shortcuts are implemented](https://github.com/PeterNaydenov/shortcuts)




## Credits
'@peter.naydenov/screen-writer' was created and supported by Peter Naydenov.



## License
'@peter.naydenov/screen-writer' is released under the [MIT License](http://opensource.org/licenses/MIT).