# Screen Writer (@peter.naydenov/screen-writer)



Writing a SPA applications as writing a movie script - describe a set of stages (visual states). Each stage describes how the visual part of the application should look like and how the user will interact with it ( mouse, keyboard, etc.). Stages are described by **JS-page** data models. 

Build a relationship between stages and you will have a tree of visual states that can be traversed with a single instruction.



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
script.turnTo ( 'pageName' ) // change the current JS-page
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

```


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


JS-pages can be `opened` and `closed`, also some pages can be a child of another page. Every JS-page is a can be treated as a visual state of the application. 







All `JS-pages` are available on demand by calling a simple instruction `turnTo('pageName')`.



Because we have a structure (connection among JS-pages) all JS-page

Shifting to specific page creates a list of instructions that can move the user across all defined screens by calling a simple instruction `turnTo('pageName')`.



Library is a tool to manage your JS-page packages according different contexts.


Library is a tool to shift across application's JS-pages on demand.
Library to manage SPA screen-states and coresponding user interactions by using JS-pages.

## What is JS-Page?
JS-page contains a set of instructions how the visual html page should interact with the customer. All this instructions are coming in package called `JS-page`. The library `js-pages` is a tool to switch between your jsPage packages according different contexts.

Change context - change JS-page.

